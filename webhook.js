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
                            "name": "claim-processing-enquiry"
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
            /**--------Third scenario-Payables and Receivables START----------**/
            case "caceis.claimProcessingEnquiry":
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
                                "speech": "Greetings Mr " + result[0].Counter_Party_Name + ""
                            }, {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "My Name is Emily"
                            }, {
                                "type": 0,
                                "platform": "facebook",
                                "speech": "Is your query about our recent e-mail"
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
            case "caceis.claimProcessingEnquiry-askEmailEnquiry":
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
                                    "speech": "Thank you."
                                },
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "You are referring to the claims processing of " + result[0].Security_Name + " Corporate Action - <Dividend> (ISIN number " + result[0].isin + ")",
                                },
                                {
                                    "type": 0,
                                    "platform": "facebook",
                                    "speech": "Is that correct?",
                                }
                            ],
                            contextOut: [
                                {
                                    name: "selected-securiry-info",
                                    parameters: {
                                        securityISIN: result[0].isin,
                                        securityName: result[0].Security_Name,
                                        Trade_Date: result[0].Trade_Date,
                                        Payment_Date: result[0].Payment_Date,
                                        EX_Date: result[0].EX_Date,
                                        customer_ID: result[0].customer_ID,
                                        Trade_Action: result[0].Trade_Action,
                                        Customer_Name: result[0].Customer_Name,
                                        quantity: result[0].quantity,
                                        Counter_Party_Name: result[0].Counter_Party_Name
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
            case "caceis.claimProcessingEnquiry-askEmailEnquiry-confirmSecurityInfo":
                var payableRecievableInfo = _.find(req.body.result.contexts, ['name', "selected-securiry-info"]);
                console.log('payableRecievableInfo', JSON.stringify(payableRecievableInfo));
                var tradeAction = (payableRecievableInfo.parameters.Trade_Action == "Buy") ? "bought" : "sold";
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Our customer Mr " + payableRecievableInfo.parameters.Customer_Name + " " + tradeAction + " " + payableRecievableInfo.parameters.quantity + " shares of " + payableRecievableInfo.parameters.securityName + " on trade date " + payableRecievableInfo.parameters.Trade_Date + " and the ex-date for CA is " + payableRecievableInfo.parameters.EX_Date + ".",
                        },
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Mr " + payableRecievableInfo.parameters.Customer_Name + " is  entitled to receive the cash dividend"
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
            case "caceis.choosePayRec-yes-confirmClaimsProcessing-validateStockName":

                break;
            case "caceis.choosePayRec-yes-confirmClaimsProcessing-validateStockName-agree":
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
            case "caceis.choosePayRec-yes-confirmClaimsProcessing-validateStockName-disagree":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "I am passing you the transaction details by email to you."
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
