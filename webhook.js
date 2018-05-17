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
  console.log(req.body);
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  if (req.body.result) {
    console.log("Action: " + req.body.result.action + ", Intent: " + req.body.result.metadata.intentName);
    switch (req.body.result.action) {
      case "caceis.raiseIssue":
        res.json({
          messages: [
            {
              platform: "facebook",
              speech: "Can you tell me in a few words how I can help? Would you like me to query the data on your behalf ?",
              type: 0
            },
            {
              platform: "facebook",
              title: "Please select",
              type: 1,
              buttons: [
                {
                  postback: "Yes Please",
                  text: "yes"
                },
                {
                  postback: "No I am Fine",
                  text: "no"
                }
              ]
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