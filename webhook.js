var express = require('express'),
  app = express(),
  http = require('http'),
  httpServer = http.Server(app),
  bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const REST_PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.redirect("/caceiswebsite");
});

app.get('/caceiswebsite', function (req, res) {
  res.sendFile(__dirname + '/home.html');
});

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chat.html');
});

app.post('/api/webhook', function (req, res) {
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  
  console.log("botconversation", botconversation);
  if (req.body.result) {
    console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
    switch (req.body.result.action) {
      case "input.welcome":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Hi , I'm Rosy , How can I help you today."
            }
          ]
        }).end();
        break;
      case "caceis.nameIntent":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Can you tell me in a few words how I can help? Would you like me to query the data on your behalf ?"
            },
            {
              "type": 1,
              "platform": "facebook",
              "title": "Please select",
              "subtitle": "",
              "buttons": [
                {
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
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Please can you tell me your account number with us"
            }
          ]
        }).end();
        break;
      case "caceis.accountNumberIntent":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Thanks for sharing the information. Could you please share your query ?"
            }
          ]
        }).end();
        break;
      case "caceis.raiseQuery":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "You are talking about , ISIN number US0378831005 and  Stock name - Apple"
            }
          ]
        }).end();
        break;
      case "caceisraiseQuery.caceisraiseQuery-custom":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "You have 1500 quantiy of Apple shares as of now. Voluntary corporate action for rights issue is initiated by Apple.\n\nRights issue is offered at 2:1 @ Rs 25. Would you be interested to opt for rights issue?."
            },
            {
              "type": 1,
              "platform": "facebook",
              "title": "Please select",
              "subtitle": "",
              "buttons": [
                {
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
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "I take the response as \"Yes\" for corporate action for rights issue.\nThanks for sharing the information. Would you like to know the important dates for the rights issue."
            }
          ]
        }).end();
        break;
      case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-no":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "I take the response as \"No\" for corporate action for rights issue.\nThanks for sharing the information. Would you like to know the important dates for the rights issue."
            }
          ]
        }).end();
        break;
      case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-no.caceisraiseQuery-custom-no-yes":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Last date for response - 21-05-2018\nPayment date - 25-05-2018\nSettlement date - 28-05-2018"
            }
          ]
        }).end();
        break;
      case "caceisraiseQuery.caceisraiseQuery-custom.caceisraiseQuery-custom-yes.caceisraiseQuery-custom-yes-yes":
        res.json({
          messages: [
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Last date for response - 21-05-2018\nPayment date - 25-05-2018\nSettlement date - 28-05-2018"
            }
          ]
        }).end();
        break;
      case "caies.thankIntent":
        res.json({
          messages: [
            {
              "type": 0,
              "speech": "Happy to help you. Have a nice day."
            }
          ]
        }).end();
        break;
    }
  }
});

app.listen(REST_PORT, function () {
  console.log('Rest service ready on port ' + REST_PORT);
});