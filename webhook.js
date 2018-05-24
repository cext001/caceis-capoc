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

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/home.html');
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});
app.get('/caccenter', function(req, res) {
    res.sendFile(__dirname + '/caccenter.html');
});
app.post('/api/webhook', function(req, res) {
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
            case "caceis.nameIntent":
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
                                }
                            ]
                        }
                    ]
                }).end();
                break;
            case "caceisnameIntent.caceisnameIntent-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Please can you tell me your account number with us"
                    }]
                }).end();
                break;
            case "caceis.accountNumberIntent":
                var accountNumber = req.body.result.parameters.number;
                return helper.getCustomerDetails(accountNumber).then((result) => {
                    console.log('result count', result[0].count);
                    if(result[0].count > 0) {
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
                    console.log("err", err);
                    res.send("Something went wrong");
                });                
                break;
            case "caceis.raiseQuery":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "You are talking about , ISIN number US0378831005 and  Stock name - Apple"
                    }]
                }).end();
                break;
            case "caceisraiseQuery.caceisraiseQuery-custom":
                res.json({
                    messages: [{
                            "type": 0,
                            "platform": "facebook",
                            "speech": "You have 1500 quantiy of Apple shares as of now. Voluntary corporate action for rights issue is initiated by Apple."
                        },
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Rights issue is offered at 2:1 @ Rs 25. Would you be interested to opt for rights issue?."
                        },
                        {
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
                                }
                            ]
                        }
                    ]
                }).end();
                break;
            case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-yes":
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
            case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-no":
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
                        }
                    ]
                }).end();
                break;
            case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-no.caceisraiseQuery-custom-no-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Last date for response - 21-05-2018\nPayment date - 25-05-2018\nSettlement date - 28-05-2018"
                    }]
                }).end();
                break;
            case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-yes.caceisraiseQuery-custom-yes-yes":
                res.json({
                    messages: [{
                        "type": 0,
                        "platform": "facebook",
                        "speech": "Last date for response - 21-05-2018\nPayment date - 25-05-2018\nSettlement date - 28-05-2018"
                    }]
                }).end();
                break;
            case "caies.thankIntent":
                res.json({
                    messages: [{
                        "type": 0,
                        "speech": "Happy to help you. Have a nice day."
                    }]
                }).end();
                break;
            case "caceis.nameCompanyIntent":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Can you tell me in a few words how I can help you ?."
                        }
                    ]
                }).end();
                break;
            case "caceis.corporateActionQuery":
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
            case "caceiscorporateActionQuery.caceiscorporateActionQuery-custom":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Thanks for sharing the information. Could you please share your query ?."
                        }
                    ]
                }).end();
                break;
            case "caceiscorporateActionQuery.caceiscorporateActionQuery-custom.caceiscorporateActionQuery-custom-getEntityId-getQuery":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "You are talking about , ISIN number US0378831005 and  Stock name - Apple ?."
                        }
                    ]
                }).end();
                break;
            case "caceiscorporateActionQuery.caceiscorporateActionQuery-custom.caceiscorporateActionQuery-custom-getEntityId-getQuery.caceiscorporateActionQuery-custom-getEntityId-getQuery-confirmation":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Holdings on this ISIN from JP Morgan is 1,57,000 shares"
                        },
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Rights issue is offered at 2:1 @ Rs 25. What is your query about ?"
                        }
                    ]
                }).end();
                break;
            case "caceis.corporateActionQueryFinialise":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "I see. I would like to inform that 2000 quanity of apple shares are not yet settled ."
                        }
                    ]
                }).end();
                break;
            case "caceiscorporateActionQueryFinialise-confirm":
                res.json({
                    messages: [
                        {
                            "type": 0,
                            "platform": "facebook",
                            "speech": "Important date for the corporate actions for your reference.\n\nLast date for response - 21-05-2018\n\nPayment date - 25-05-2018\n\nSettlement date - 28-05-2018"
                        }
                    ]
                }).end();
                break;
        }
    }
});

app.post('/chatbot/savehistory', function(req, res) {
    var botconversation = JSON.parse(req.body.botconversation);

    var contexts = req.body.contexts;
    var sessionId = botconversation.sessionId;

    botconversation = JSON.stringify(botconversation);
    var record = [sessionId, "Chat", req.body.customerId, req.body.customerName, "2017-09-15", "Dividend Payout", "", "", botconversation];
    console.log("record", record);

    return helper.saveChatHistory(record).then((result) => {
        res.send("saved history")
    }).catch((err) => {
        console.log("err", err);
        res.send("Something went wrong");
    });
});

app.get('/test', function(req, res) {
    return helper.getCustomerDetails('77777777').then((result) => {
        console.log(result[0].count);
        res.send("succ" + result[0].count)
    }).catch((err) => {
        console.log("err", err);
        res.send("Something went wrong");
    });
});

app.listen(REST_PORT, function() {
    console.log('Rest service ready on port ' + REST_PORT);
});