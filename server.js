require("dotenv").config();
var path = require('path');
var express = require('express');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost/salesforce';
var pg = require('pg');
var client = new pg.Client(connectionString);
var jsforce = require('jsforce');
var serverConn = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
    //loginUrl : 'https://dcurtin-iraonline.cs17.force.com/client',
    clientId : process.env.SFServer_Id,
    clientSecret : process.env.SFServer_Sec,
    redirectUri : process.env.SF_Redirect
  }
});
serverConn.login(process.env.UserId, process.env.UserPw + process.env.UserToken, function(err, userInfo) {
  console.log('token: ' + serverConn.accessToken)
  if (err) {
    console.log(err);
    return console.log('fail');
  }
})

console.log('query url: ' +  connectionString)
client.connect();

var app = express();
app.use(session({
  secret: 'S3CRE7',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// var connectionString = process.env.DATABASE_URL;

// const client = new Client({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// client.connect();

app.use(router);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.post('/startApplication', function(req, res){
  var session = req.body.session;
  //establish application, generate session
  //return sessionId

  var onlineAppData = req.body.data;
  console.log(onlineAppData);
  var page = session.page;
  var sessionId = session.sessionId;

  console.log(session);

  if(sessionId !== ''){
    console.log('application must be started first, a step was skipped or the session was lost');
    console.log(sessionId);
    res.status(500).send('SessionId not set');
    return;
  }
  //figure out what page they're on
  const hash = require('crypto').createHash('sha256');
  var token = hash.update(JSON.stringify(onlineAppData) + Math.random().toString()).digest('hex');
  //onlineAppData['dedicated_rep__c'] = '0050M00000Dv1h5QAB';
  onlineAppData['token__c'] = token;
  //updateDataBase(onlineAppData, res, token);
  initializeApplication(onlineAppData, res, token);
});

function initializeApplication(onlineAppData, res, token){
  const insertAppDataQuery = {
    text: 'INSERT INTO salesforce.initial_app_data(account_type, transfer_ira, rollover_employer, cash_contribution, initial_investment, sales_rep, specified_source, referral_code, token__c) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    values: [onlineAppData['AccountType'], onlineAppData['TransferIra'], onlineAppData['RolloverEmployer'], onlineAppData['CashContribution'], onlineAppData['InitialInvestment'], onlineAppData['SalesRep'], onlineAppData['SpecifiedSource'], onlineAppData['ReferralCode'], token],
  }
  client.query(insertAppDataQuery, function(err, response){
    res.json({'sessionId': token});
  });
}

function updateDataBase(onlineAppData, res, token)
{
  console.log(token);
  const insertAppQuery = {
    text: 'INSERT INTO salesforce.application__c(first_name__c, last_name__c, email__c, ssn__c, dob__c, dedicated_rep__c, token__c) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (token__c) DO UPDATE SET first_name__c = EXCLUDED.first_name__c, last_name__c = EXCLUDED.last_name__c, email__c = EXCLUDED.email__c, ssn__c = EXCLUDED.ssn__c, dob__c = EXCLUDED.dob__c, dedicated_rep__c = EXCLUDED.dedicated_rep__c',
    values: [onlineAppData['first_name__c'], onlineAppData['last_name__c'], onlineAppData['email__c'], onlineAppData['ssn__c'], onlineAppData['dob__c'], onlineAppData['dedicated_rep__c'], token],
  }
  client.query(insertAppQuery, function(err, response){
    console.log("response");
    console.log(response);
    console.log("err");
    console.log(err);
    res.json({'sessionId': token});
  });
}



app.post('/saveState', function(req, res){
  console.log(serverConn);
  console.log(req.body);
  var onlineAppData = req.body.data;
  var session = req.body.session;
  var page = session.page;
  var sessionId = session.sessionId;

  if(sessionId === ''){
    console.log('application must be started first, a step was skipped or the session was lost');
    console.log(sessionId);
    res.status(500).send('SessionId not set');
    return;
  }

  updateDataBase(onlineAppData, res, sessionId);
  //figure out what page the user is on, upsert data

});

app.post('/saveApplication', function(req, res){
  var session = req.body.session;

  //merge data in forms
  //insert or upsert data to salesforce
  
  res.send('ok');
})

app.post('/getPageFields', function(req, res){
  var session = req.body.session;

  let applicationQuery = {
    text : 'SELECT * FROM salesforce.application__c WHERE token__c = $1',
    values : [session.sessionId]
  }
  client.query(applicationQuery).then( function(result){
  //get data from database
  //load into response
  res.json(result['rows']);
  //res.send('ok');
  })
})

function insertApplication(onlineApp){
  serverConn.sobject("Online_Application__c").create(onlineApp, function(err, ret){
    console.log(ret);
    if(ret.success === true){
      
    }
  });
}

function updateApplication(){
  serverConn.sobject("Online_Application__c").create(onlineApp, function(err, ret){
    console.log(ret);
    if(ret.success === true){
      
    }
  });
}




var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));