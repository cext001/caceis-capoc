var express = require('express'),
    app = express(),
    http = require('http'),
    httpServer = http.Server(app),
    bodyParser = require('body-parser')
mysql = require('mysql')
_ = require('lodash')
helper = require('./helper');


app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/home.html');
});

app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/chat.html');
});
app.get('/caccenter', function (req, res) {
    res.sendFile(__dirname + '/caccenter.html');
});
app.post('/api/webhook', function (req, res) {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.result) {
        console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
        switch (req.body.result.action) {
            case "input.welcome":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Hi , I'm Rosy , How can I help you today."
                    }]
                }).end();
                break;
            case "caceis.nameCompanyIntent":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "What's this query related to ?"
                        }
                    ]
                }).end();
                break;
            /**--------First scenario-Transfer agent START----------**/
            case "caceis.nameIntent":
                var clientName;
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Can you tell me in a few words how I can help? Would you like me to query the data on your behalf ?"
                    },
                    {
                        "type": 1,
                        "platform": "facebook",
                        "title": "Please select",
                        "subtitle": "",
                        "buttons": [{
                            "text": "Yes Please",
                            "postback": "yes"
                        },
                        {
                            "text": "No I am Fine",
                            "postback": "no"
                        }]
                    }]
                }).end();
                break;
            case "caceis.nameIntent-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Please can you tell me your account number with us"
                    }]
                }).end();
                break;
            case "caceis.nameIntent-yes-getAccountNumber":
                var accountNumber = req.body.result.parameters.accountNumber;
                return helper.getCustomerDetails(accountNumber).then((result) => {
                    console.log('customer count', result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Thanks for sharing the information. Could you please share your query ?"
                            }]
                        }).end();
                    } else {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Cant find account information. Please try again."
                            }]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("get customer details err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.rightsIssueQuery":
                var securityName = req.body.result.parameters.securityName;
                return helper.getSecurityDetailsByName(securityName).then((result) => {
                    console.log("securityinfo", result);
                    console.log("securityinfo row count", result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "You are talking about , ISIN number " + result[0].ISIN + " and  Stock name - " + result[0].Security_Name + " ?"
                                }
                            ],
                            contextOut: [
                                {
                                    name: "security-info",
                                    parameters: {
                                        securityISIN: result[0].ISIN,
                                        securityName: result[0].Security_Name
                                    },
                                    lifespan: 5
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "Unable to find security information."
                                }
                            ]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("fetch security details err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.rightsIssueQuery-confirm":
                var isin = req.body.result.contexts[2].parameters.securityISIN;
                var securityName = req.body.result.contexts[0].parameters.securityName;
                var accountNumber = req.body.result.contexts[0].parameters.accountNumber;
                console.log("isin: " + isin + " ,securityName: " + securityName + " ,accountNumber: " + accountNumber);

                return helper.getHoldingAndCorporateActionData(accountNumber, isin).then((result) => {
                    console.log('Holdings data', result[0][0]);
                    console.log('Holdings data row count', result[0].length);
                    console.log('corporate action data', result[1][0]);
                    console.log('corporate action data', result[1].length);

                    var holdingsInfo = (result[0].length > 0) ? "You have " + result[0][0].quantity + " quantiy of " + securityName + " shares as of now. Voluntary corporate action for rights issue is initiated by  " + securityName + " ."
                        : "Unable to find holdings for this ISIN from " + securityName;
                    var corporateActionInfo = (result[1].length > 0) ? result[1][0].Event_Name + " issue is offered at " + result[1][0].Pershare_Offer + ":1 @ Rs " + result[1][0].Pershare_Offer + ". Would you be interested to opt for rights issue?."
                        : "Unable to find records for the corporate action events for the ISIN";
                    var contextArray = (result[1].length > 0) ?
                        [
                            {
                                name: "corporateactionvent-info",
                                parameters: {
                                    Event_Date: result[1][0].Event_Date,
                                    Payment_Date: result[1][0].Payment_Date,
                                    Settlement_Date: result[1][0].Settlement_Date
                                },
                                lifespan: 5
                            }
                        ] : [];
                    var response = {
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": holdingsInfo
                            },
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": corporateActionInfo
                            }
                        ],
                        contextOut: contextArray
                    };

                    if (result[1].length > 0 && result[0].length > 0) {
                        response.messages.push({
                            "type": 1,
                            "platform": "facebook",
                            "title": "Please select",
                            "subtitle": "",
                            "buttons": [{
                                "text": "Yes",
                                "postback": "yes"
                            },
                            {
                                "text": "No",
                                "postback": "no"
                            }]
                        });
                    }

                    console.log("respnbse", JSON.stringify(response));

                    res.json(response).end();
                }).catch((err) => {
                    console.log("err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.rightsIssueQuery-confirm-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "I take the response as \"Yes\" for corporate action for rights issue."
                    },
                    {
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Thanks for sharing the information. Would you like to know the important dates for the rights issue."
                    }
                    ]
                }).end();
                break;
            case "caceis.rightsIssueQuery-confirm-no":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "I take the response as \"No\" for corporate action for rights issue."
                    },
                    {
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Thanks for sharing the information. Would you like to know the important dates for the rights issue."
                    }]
                }).end();
                break;
            case "caceis.rightsIssueQuery-confirm-yes-yes":
                var Event_Date = req.body.result.contexts[5].parameters.Event_Date;
                var Settlement_Date = req.body.result.contexts[5].parameters.Settlement_Date;
                var Payment_Date = req.body.result.contexts[5].parameters.Payment_Date;
                console.log("Payment_Date: " + Payment_Date + " ,Settlement_Date: " + Settlement_Date + " ,Event_Date:" + Event_Date);

                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Important date for the corporate actions for your reference.\n\nLast date for response - " + Event_Date + "\n\nPayment date - " + Payment_Date + "\n\nSettlement date - " + Settlement_Date + ""
                        }
                    ],
                    contextOut: [
                        {
                            name: "subject-info",
                            parameters: {
                                Subject: "Customer query on corporate actions"
                            },
                            lifespan: 3
                        }
                    ]
                }).end();
                break;
            case "caceis.rightsIssueQuery-confirm-no-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Last date for response - 21-05-2018\nPayment date - 25-05-2018\nSettlement date - 28-05-2018"
                    }],
                    contextOut: [
                        {
                            name: "subject-info",
                            parameters: {
                                Subject: "Customer query on corporate actions"
                            },
                            lifespan: 3
                        }
                    ]
                }).end();
                break;
            /**--------First scenario-Transfer agent END----------**/
            /**--------Second scenario-Transfer agent START----------**/
            case "caceis.transferAgentQuery":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Can you tell me entity id of your company with us."
                        }
                    ]
                }).end();
                break;
            case "caceis.transferAgentQuery-getEntityId":
                var entityId = req.body.result.parameters.entityId;
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', 'name-company-info']);
                var companyName = nameCompanyInfo.parameters.companyName;
                console.log("entityId :" + entityId + " ,companyName: " + companyName);

                return helper.getCustomerDetails(entityId).then((result) => {
                    console.log('customer info', result);
                    console.log('customer info row count', result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Thanks for sharing the information. Could you please share your query ?"
                            }],
                            contextOut: [
                                {
                                    name: "customer-info",
                                    parameters: {
                                        Customer_Name: result[0].Customer_Name,
                                        Customer_ID: result[0].Customer_ID
                                    },
                                    lifespan: 5
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Cant find entity information. Please check and try again."
                            }]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("get entity information err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.transferAgentQuery-getEntityId-getQuery":
                var securityName = req.body.result.parameters.securityName;
                return helper.getSecurityDetailsByName(securityName).then((result) => {
                    console.log("securityinfo", result);
                    console.log("securityinfo row count", result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "You are talking about , ISIN number " + result[0].ISIN + " and  Stock name - " + result[0].Security_Name + " ?"
                                }
                            ],
                            contextOut: [
                                {
                                    name: "security-info",
                                    parameters: {
                                        securityISIN: result[0].ISIN,
                                        securityName: result[0].Security_Name
                                    },
                                    lifespan: 5
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "Unable to find security information."
                                }
                            ]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("get security details err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.transferAgentQuery-getEntityId-getQuery-confirmation":
                var securityInfo = _.find(req.body.result.contexts, ['name', 'security-info']);
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', 'name-company-info']);
                var isin = securityInfo.parameters.securityISIN;
                var companyName = nameCompanyInfo.parameters.companyName;
                var customerId = nameCompanyInfo.parameters.entityId;
                console.log("isin: " + isin + " ,company name: " + companyName + " ,customerId: " + customerId);

                return helper.getHoldingAndCorporateActionData(customerId, isin).then((result) => {
                    console.log('Holdings data', result[0][0]);
                    console.log('Holdings data row count', result[0].length);
                    console.log('corporate action data', result[1][0]);
                    console.log('corporate action data', result[1].length);

                    var holdingsInfo = (result[0].length > 0)
                        ? "Holdings on this ISIN from " + companyName + " is " + result[0][0].quantity + " shares"
                        : "Unable to find holdings for this ISIN from " + companyName;
                    var corporateActionInfo = (result[1].length > 0)
                        ? result[1][0].Event_Name + " issue is offered at " + result[1][0].Pershare_Offer + ":1 @ Rs " + result[1][0].Pershare_Offer + ". What is your query about ?"
                        : "Unable to find records for the corporate action events for the ISIN";
                    var contextArray = (result[1].length > 0)
                        ? [
                            {
                                name: "corporateactionvent-info",
                                parameters: {
                                    Event_Date: result[1][0].Event_Date,
                                    Payment_Date: result[1][0].Payment_Date,
                                    Settlement_Date: result[1][0].Settlement_Date
                                },
                                lifespan: 5
                            }
                        ]
                        : [];

                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": holdingsInfo
                            },
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": corporateActionInfo
                            }
                        ],
                        contextOut: contextArray
                    }).end();
                }).catch((err) => {
                    console.log("err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.transferAgentFinialise":
                var securityInfo = _.find(req.body.result.contexts, ['name', 'security-info']);
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', 'name-company-info']);
                var securityName = securityInfo.parameters.securityName;
                var customerId = nameCompanyInfo.parameters.entityId;
                var isin = securityInfo.parameters.securityISIN;
                console.log("isin: " + isin + ", customerId: " + customerId + " , securityName: " + securityName);

                return helper.getTradeStatusBySecurityIdAndCustomerId(isin, customerId).then((result) => {
                    console.log("tradeinfo", result);
                    console.log("tradeinfo row count", result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "I see. I would like to inform that " + result[0].quantity + " quanity of " + securityName + " shares are " + result[0].Status + "."
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "Trade info not found in the system."
                                }
                            ]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("trade status err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.transferAgentFinialise-confirm":
                var corporateactionventInfo = _.find(req.body.result.contexts, ['name', 'corporateactionvent-info']);
                var Event_Date = corporateactionventInfo.parameters.Event_Date;
                var Settlement_Date = corporateactionventInfo.parameters.Settlement_Date;
                var Payment_Date = corporateactionventInfo.parameters.Payment_Date;
                console.log("Payment_Date: " + Payment_Date + " ,Settlement_Date: " + Settlement_Date + " ,Event_Date:" + Event_Date);

                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Important date for the corporate actions for your reference.\n\nLast date for response - " + Event_Date + "\n\nPayment date - " + Payment_Date + "\n\nSettlement date - " + Settlement_Date + ""
                        }
                    ],
                    contextOut: [
                        {
                            name: "subject-info",
                            parameters: {
                                Subject: "Reconcilliation issue"
                            },
                            lifespan: 3
                        }
                    ]
                }).end();
                break;
            /**--------Second scenario-Transfer agent END----------**/
            /**--------Third scenario-Payables and Receivables START----------**/
            case "caceis.payRecRaiseIssue":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Please share the customers's account number with us ?"
                    }]
                }).end();
                break;
            case "caceis.payRecRaiseIssue-getCustId":
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', "name-company-info"]);
                var custId = req.body.result.parameters.entityId;
                console.log("nameCompanyInfo", nameCompanyInfo);
                console.log("custId", custId);
                return helper.getCustomerDetails(custId).then((result) => {
                    console.log('customer count', result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Alright , he has custody accont with " + nameCompanyInfo.parameters.companyName + ".?"
                            }],
                            contextOut: [
                                {
                                    name: "customer-info",
                                    parameters: {
                                        Customer_Name: result[0].Customer_Name,
                                        Customer_ID: result[0].Customer_ID
                                    },
                                    lifespan: 5
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Cant find account information. Please try again."
                            }]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("get customer details err", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.payRecRaiseIssue-getCustId-yes":
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', "name-company-info"]);
                var custId = nameCompanyInfo.parameters.entityId;
                console.log("custId", custId);
                return helper.getPayableRecievableInfoByCustId(custId).then((result) => {
                    console.log('payable recievable rs length', result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "You are referring to  ISIN number " + result[0].isin + " and  Stock name - " + result[0].Security_Name + " ?"
                                }
                            ],
                            contextOut: [
                                {
                                    name: "selected-securiry-info",
                                    parameters: {
                                        securityISIN: result[0].isin,
                                        securityName: result[0].Security_Name,
                                        Trade_Date: result[0].Trade_Date,
                                        EX_Date: result[0].EX_Date,
                                        customer_ID: result[0].customer_ID,
                                        Trade_Action: result[0].Trade_Action
                                    },
                                    lifespan: 5
                                }
                            ]
                        }).end();
                    } else {
                        res.json({
                            messages: [
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "Unable to find payable recievable records."
                                }
                            ]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("payable recievable error", err);
                    res.json({
                        messages: [
                            {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Something went wrong"
                            }
                        ]
                    }).end();
                });
                break;
            case "caceis.payRecRaiseIssue-getCustId-yes-confirm":
                var payableRecievableInfo = _.find(req.body.result.contexts, ['name', "selected-securiry-info"]);
                var bankInfo = _.find(req.body.result.contexts, ['name', "bank-info"]);
                console.log('payableRecievableInfo', JSON.stringify(payableRecievableInfo));
                var tradeAction = (payableRecievableInfo.parameters.Trade_Action == "Buy") ? "bought" : "sold";
                var summaryMessage = (payableRecievableInfo.parameters.Trade_Action == "Buy") ? "This makes the claim against you." : "This makes the claim against " + bankInfo.parameters.bankName;
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "The customer " + tradeAction + " the securities on " + payableRecievableInfo.parameters.Trade_Date + " and the Ex date for the corporate action was" + payableRecievableInfo.parameters.EX_Date
                        },
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": summaryMessage
                        }
                    ],
                    contextOut: [
                        {
                            name: "subject-info",
                            parameters: {
                                Subject: "Payables and Receivables"
                            },
                            lifespan: 3
                        }
                    ]
                }).end();
                break;
            /**--------Third scenario-Payables and Receivables END----------**/
            case "caceis.thankAndBye":
                res.json({
                    messages: [{
                        "type": 0,
                        "speech": "Happy to help you. Have a nice day."
                    }]
                }).end();
                break;
        }
    }
});

app.post('/chatbot/savehistory', function (req, res) {
    var botconversation = JSON.parse(req.body.botconversation);

    var contexts = req.body.contexts;
    var sessionId = botconversation.sessionId;
    var dateFormatted = helper.getFormattedDate();

    botconversation = JSON.stringify(botconversation);
    var record = [sessionId, "Chat", req.body.customerId, req.body.customerName, dateFormatted, req.body.subject, "", "", botconversation];
    console.log("record", record);

    return helper.saveChatHistory(record).then((result) => {
        res.send("saved history")
    }).catch((err) => {
        console.log("history save err", err);
        res.send("Something went wrong");
    });
});

app.get('/test', function (req, res) {
    return helper.getPayableRecievableInfoByCustId("22222222").then((result) => {
        console.log('rs1', result.length);
        var test = _.find(result, ['Security_Name', "Infosys"]);
        console.log("rese", test);
        res.send("succ")
    }).catch((err) => {
        console.log("err", err);
        res.send("Something went wrong");
    });
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});