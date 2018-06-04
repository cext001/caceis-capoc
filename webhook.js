var express = require('express'),
    app = express(),
    http = require('http'),
    httpServer = http.Server(app),
    bodyParser = require('body-parser')
mysql = require('mysql')
_ = require('lodash')
helper = require('./helper');

app.use(bodyParser.urlencoded({ extended: false }))
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
    console.log("custid", req.query.custid)
    res.sendFile(__dirname + '/caccenter.html');
});
app.post('/api/webhook', function (req, res) {
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    if (req.body.result) {
        console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
        switch (req.body.result.action) {
            case "input.welcome":
                var customerId = req.body.sessionId.split("@")[0];
                var tradeId = req.body.sessionId.split("@")[1];
                var response = {};
                if (tradeId && customerId) {
                    response = {
                        "followupEvent": {
                            "name": "choose_payrec"
                        }
                    }
                } else {
                    response = {
                        messages: [{
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Hi , I'm Rosy , How can I help you today."
                        }]
                    };
                }
                console.log("response", response);
                res.json(response).end();
                break;
            case "caceis.nameCompanyIntent":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "What's your query related to ?"
                        }
                    ]
                }).end();
                break;
            /**--------Second scenario-Reconciliation issue START----------**/
            case "caceis.raiseReconciliationIssue":
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
                                    "speech": "You are referring to ISIN number " + result[0].ISIN + " and  Stock name - " + result[0].Security_Name + " ?"
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
            case "caceis.raiseReconciliationIssue-confirm":
                var securityInfo = _.find(req.body.result.contexts, ['name', 'security-info']);
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', 'name-company-info']);
                var isin = securityInfo.parameters.securityISIN;

                //need to handle these items
                var companyName = nameCompanyInfo.parameters.companyName;
                var customerId = req.body.sessionId.split("@")[0];

                console.log("isin: " + isin + " ,company name: " + companyName + " ,customerId: " + customerId);

                return helper.getHoldingAndCorporateActionData(customerId, isin).then((result) => {
                    console.log('Holdings data', result[0][0]);
                    console.log('Holdings data row count', result[0].length);
                    console.log('corporate action data', result[1][0]);
                    console.log('corporate action data', result[1].length);

                    var holdingsInfo = (result[0].length > 0)
                        ? "Your holdings on this ISIN from " + companyName + " is " + result[0][0].quantity + "shares"
                        : "Unable to find holdings for this ISIN from " + companyName;
                    var corporateActionInfo = (result[1].length > 0)
                        ? companyName + " is providing " + result[1][0].Event_Name + " issue and its offered at " + result[1][0].Pershare_Offer + ":1 @ Rs " + result[1][0].Pershare_Offer + ". What is your query about ?"
                        : "Unable to find records for the corporate action events for the ISIN";

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
                        ]
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
            case "caceis.raiseReconciliationIssue-confirm-query":
                var securityInfo = _.find(req.body.result.contexts, ['name', 'security-info']);
                var nameCompanyInfo = _.find(req.body.result.contexts, ['name', 'name-company-info']);
                var securityName = securityInfo.parameters.securityName;
                var customerId = req.body.sessionId.split("@")[0];
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
            case "caceis.raiseReconciliationIssue-confirm-query-wrapup":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "I hope, we were able to clarify your queries . Do you have any further clarifications ?"
                        }
                    ]
                }).end();
                break;
            /**--------Second scenario-Reconciliation issue END----------**/
            /**--------Third scenario-Payables and Receivables START----------**/
            case "caceis.confirmPayRec":
                var customerId = req.body.sessionId.split("@")[0];
                var tradeId = req.body.sessionId.split("@")[1];
                console.log("customerId:" + customerId + ", tradeId:" + tradeId);
                return helper.getTradeInfoByCustIdAndTradeId(customerId, tradeId).then((result) => {
                    console.log("rese", result[0].Counter_Party_Name);
                    console.log('tradeinfo count', result.length);
                    if (result.length > 0) {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Hi , I am Rosy"
                            }, {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Mr " + result[0].Counter_Party_Name + ", whether your query is in regard to our claims e-mail"
                            }]
                        }).end();
                    } else {
                        res.json({
                            messages: [{
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Unable to find counterparty info."
                            }]
                        }).end();
                    }
                }).catch((err) => {
                    console.log("tradeinfo details err", err);
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
            case "caceis.choosePayRec-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Could you please explain the quey in few words."
                    }]
                }).end();
                break;
            case "caceis.payRecRaiseIssue":
                var customerId = req.body.sessionId.split("@")[0];
                var tradeId = req.body.sessionId.split("@")[1];
                console.log("customerId:" + customerId + ", tradeId:" + tradeId);
                return helper.getPayableRecievableInfoByCustId(customerId).then((result) => {
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
                                        Trade_Action: result[0].Trade_Action,
                                        Customer_Name: result[0].Customer_Name,
                                        quantity: result[0].quantity
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
            case "caceis.payRecRaiseIssue-yes":
                var payableRecievableInfo = _.find(req.body.result.contexts, ['name', "selected-securiry-info"]);
                var bankInfo = _.find(req.body.result.contexts, ['name', "bank-info"]);
                console.log('payableRecievableInfo', JSON.stringify(payableRecievableInfo));
                var tradeAction = (payableRecievableInfo.parameters.Trade_Action == "Buy") ? "bought" : "sold";
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Our customer Mr " + payableRecievableInfo.parameters.Customer_Name + " " + payableRecievableInfo.parameters.tradeAction + " " + payableRecievableInfo.parameters.quantity + " shares of " + payableRecievableInfo.parameters.securityName + " on trade date " + payableRecievableInfo.parameters.Trade_Date + " and the ex-date for CA is " + payableRecievableInfo.parameters.EX_Date
                        },
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "This makes our customer entitle to receive the cash dividend"
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
            case "caceis.payRecRaiseIssue-yes-yes":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "I hope, we were able to clarify your queries. Do you have any further clarifications."
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
            case "caceis.testIntent":
                res.json({
                    messages: [{
                        "type": 0,
                        "speech": "test intent fired."
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
    console.log("SSESSS", req.session);
    return helper.getTradeInfoByCustIdAndTradeId('615201508040', 'T45456971').then((result) => {
        console.log("rese", result[0]);
        res.send("succ")
    }).catch((err) => {
        console.log("err", err);
        res.send("Something went wrong");
    });
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});
