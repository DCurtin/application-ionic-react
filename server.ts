require("dotenv").config();
var path = require('path');
let https = require('https');
import express from 'express';
import {transformBeneClientToServer} from './server/utils/transformBeneficiaries'
import {transformTransferClientToServer} from './server/utils/transformTransfers'
import {transformRolloverClientToServer} from './server/utils/transformRollovers'
import * as getPageInfoHandlers from './server/utils/getPageInfoHandlers'
import * as saveStateHandlers from './server/utils/saveStateHandlers'
import * as applicationInterfaces from './client/src/helpers/Utils'
import * as salesforceSchema from './server/utils/salesforce'
import jsforce, {Connection as jsfConnection} from 'jsforce'
const { v4: uuidv4 } = require('uuid');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgresql://postgres:welcome@localhost';
import pg, { Client, Connection } from 'pg'
var client  = new pg.Client(connectionString);

var serverConn :Partial<jsfConnection> = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
    clientId : process.env.QAServer_id || 'test',
    clientSecret : process.env.QAServer_sec || 'test',
    redirectUri : process.env.QAServer_url || 'test'
  }
});

var qaUser = process.env.qaUserId || 'test';
var qaPw = process.env.qaUserPw || 'test';

if(qaUser === 'test' || qaPw === 'test')
{
  serverConn = {
    accessToken: 'test_conn', 
  }
}else{
  serverConn.login(process.env.qaUserId, process.env.qaUserPw).then(function(userInfo : any) {
    console.log('token: ' + serverConn.accessToken)
  }).catch((err)=>{
    if (err) {
      console.log(err);
      return console.log('fail');
    }
  })
}

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

app.use(function(req : express.Request, res : express.Response, next : express.NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(router);

app.post('/chargeCreditCard', (req : express.Request, res : express.Response) => {
  let sessionId = req.body.sessionId;

  if(sessionId === '' || sessionId === undefined){
    console.log('no sesssion id');
    res.status(500).send('no session id');
    return;
  }
  
  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE token = $1',
    values: [sessionId]
  }
  
  client.query(sessionQuery).then(function(result:pg.QueryResult){
    if(result.rowCount == 0)
    {
      console.log('no application')
      res.status(500).send('no application');
      return;
    }
    let application_session : salesforceSchema.application_session = result.rows[0];

    let body = {'creditCardNumber': req.body.creditCardNumber, 'expirationDateString': req.body.expirationDateString}
  
    serverConn.apex.post('/applications/' + application_session.application_id + '/payments', body, function(err : any, data : any) {
      if (err) { 
        res.status(500).send(err.message);  
        return
      }
      else {
        res.json({Status: data.Status, StatusDetails: data.StatusDetails, PaymentAmount: data.PaymentAmount}); 
        return
      }
    })
  }).catch()
});

app.post('/getESignUrl', (req, res) => {
  console.log('Get ESignUrl on server');
  let sessionId = req.body.sessionId;

  if(sessionId === '' || sessionId === undefined){
    console.log('no sesssion id');
    res.status(500).send('no session id');
    return
  }
  
  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE token = $1',
    values: [sessionId]
  }

  client.query(sessionQuery).then(function(result:pg.QueryResult){
    if(result.rowCount == 0)
    {
      console.log('no application')
      res.status(500).send('no application');
      return;
    }
    
    let application_session : salesforceSchema.application_session = result.rows[0];
    let returnurl = process.env.HEROKU_APP_NAME ? `${process.env.HEROKU_APP_NAME}.com` : 'localhost:3000'
    let endpoint = '/v1/accounts/' + application_session.account_number + `/esign-url?return-url=http://${returnurl}/DocusignReturn/${sessionId}`;
    console.log('getESignUrl sessionId: ' + sessionId);
    console.log('getESignUrl enpoint: ' + endpoint);

    serverConn.apex.get(endpoint, function(err: any, data: any) {
      if (err) { return console.error(err); }
      else {
        console.log("eSignUrl: ", data.eSignUrl);
        res.json({eSignUrl: data.eSignUrl}); 
        return
      }
    })
  })
});

app.get('/getPenSignDocs', (req : express.Request, res : express.Response) => {
  console.log('getPenSignDocs running on server' );

  let sessionId = req.query['sessionId'];
  
  if(sessionId === '' || sessionId === undefined){
    console.log('no sesssion id');
    res.status(500).send('no session id');
    return
  }
  
  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE token = $1',
    values: [sessionId]
  }

  client.query(sessionQuery).then(function(result:pg.QueryResult) {
    if(result.rowCount == 0)
    {
      console.log('no application')
      res.status(500).send('no application');
      return;
    }
    
    let application_session : salesforceSchema.application_session = result.rows[0];
    let url = 'https://entrust--qa.my.salesforce.com'+'/services/apexrest/v1/accounts/' + application_session.account_number + '/pen-sign-documents';
    console.log('getPenSignDoc enpoint: ' + url);

    let options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + serverConn.accessToken,
        'Content-Type':  'application/pdf',
      }
    }

    let request = https.request(url, options, function(response: any) { 
      if (response.statusCode === 200) {
        response.pipe(res);
      }
      else {
        res.status(response.statusCode).send(response.statusMessage);
      }
    })

    request.end();
  })
});

app.get('/loaderio-18abbe8b69ba76fa08ae8d129f865a2f/', (req : express.Request, res : express.Response) => {
  console.log('deliver loader file')
  const file = `${__dirname}/loaderio-18abbe8b69ba76fa08ae8d129f865a2f.txt`;
  res.download(file); // Set disposition and send it.
});

app.get("*", function (req : Express.Response, res : express.Response) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.post('/startApplication', function(req : express.Request, res : express.Response){
  
  let welcomePageData : applicationInterfaces.saveWelcomeParameters = req.body;
  let sessionId : String = welcomePageData.session.sessionId;
  let page : string = welcomePageData.session.page;

  console.log("sessionId");
  console.log(sessionId);

  if(sessionId !== ''){
    console.log('application has already been started');
    console.log(sessionId);
    res.status(500).send('SessionId not set');
    return;
  }
  
  if(page !== 'welcomePage'){
    
    console.log('Cannot start an application on this page ' + page);
    res.status(500).send('Wrong page ' + page);
    return;
  }

  //figure out what page they're on
  var token = uuidv4();
  initializeApplication(welcomePageData.data, res, token);
});

function initializeApplication(welcomePageData : applicationInterfaces.welcomePageParameters, res: express.Response, token : string){
  //need to resolve offering_id and owner_id
  const insertAppDataQuery = {
    text: 'INSERT INTO salesforce.body(account_type, transfer_form, rollover_form, cash_contribution_form, investment_type, owner_id, referred_by, offering_id, token) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    values: [welcomePageData.AccountType, welcomePageData.TransferIra, welcomePageData.RolloverEmployer, welcomePageData.CashContribution, welcomePageData.InitialInvestment, welcomePageData.SalesRep, welcomePageData.SpecifiedSource, welcomePageData.ReferralCode, token],
  }
  client.query(insertAppDataQuery, function(err : any, response : any){
    console.log(err);
    console.log(response);
    res.set('session-id', token);
    res.json({'sessionId': token});
  });
}

app.post('/saveState', function(req : express.Request, res : express.Response){
  let packet : applicationInterfaces.requestBody = req.body;
  let sessionId : string = packet.session.sessionId;
  let page : string = packet.session.page;
  console.log('saving state ' + sessionId + ' page ' + page)

  if(sessionId === ''){
    console.log('application must be started first, a step was skipped or the session was lost');
    console.log(sessionId);
    res.status(500).send('SessionId not set');
    return;
  }

  if(page === ''){
    console.log('no page specified.');
    console.log(page);
    res.status(500).send('no page specified');
    return;
  }
  
  if(page === 'welcomePage'){
    saveStateHandlers.saveWelcomeParameters(sessionId, packet.data, res, client);
    return;
    //updateDataBase(onlineAppData, res, sessionId);
  }

  if(page === 'appId'){
    saveStateHandlers.saveApplicationIdPage(sessionId, packet.data, res, client, serverConn);
    return
  }

  if(page === 'beneficiary'){
    //console.log(packet.data)
    let beneficiaryData : applicationInterfaces.beneficiaryForm = transformBeneClientToServer(packet.data)
    saveStateHandlers.saveBeneficiaryPage(sessionId, beneficiaryData, res, client);
    return 
  }

  if(page === 'feeArrangement'){
    let feeArrangementData : applicationInterfaces.feeArrangementForm = packet.data;
    saveStateHandlers.saveFeeArrangementPage(sessionId, feeArrangementData, res, client);
    return
  }
  
  if(page === 'accountNotification'){
    let accountNotificationsData : applicationInterfaces.accountNotificationsForm = packet.data;
    saveStateHandlers.saveAccountNotificationsPage(sessionId, accountNotificationsData, res, client);
    return
  }
  
  if(page === 'transfer'){
    let transferData : applicationInterfaces.transferForm = transformTransferClientToServer(packet.data);
    saveStateHandlers.saveTransferPage(sessionId, transferData, res, client);
    return
  }

  if(page === 'contribution'){
    let contributionData : applicationInterfaces.contributionForm = packet.data;
    saveStateHandlers.saveContributionPage(sessionId, contributionData, res, client);
    return
  }

  if(page === 'rollover'){
    let rolloverData : applicationInterfaces.rolloverForm = transformRolloverClientToServer(packet.data);
    saveStateHandlers.saveRolloverPage(sessionId, rolloverData, res, client);
    return
  }

  res.status(500).send('no handler for this page');
});

app.post('/saveApplication', function(req : express.Request, res : express.Response){
  var session = req.body.session;

  //merge data in forms
  //insert or upsert data to salesforce
  
  res.send('ok');
})

app.post('/getPageFields', function(req : express.Request, res : express.Response){
  let requestPacket:applicationInterfaces.requestBody = req.body;
  let sessionId = requestPacket.session.sessionId;
  let page = requestPacket.session.page;

  if(sessionId === ''){
    console.log('no sessionId set');
    res.status(500).send('no sessionId');
    return
  }

  if(page === '' || page === undefined){
    console.log('no page set');
    res.status(500).send('no page');
    return
  }

  if(page === 'rootPage')
  {
    getPageInfoHandlers.handleWelcomePageRequest(sessionId, res, client);
    return
  }

  if(page === 'appId')
  {
    getPageInfoHandlers.handleApplicationIdPage(sessionId, res, client);
    return
  }

  if(page === 'beneficiary')
  {
    getPageInfoHandlers.handleBeneficiaryPage(sessionId, res, client);
    return
  }

  if(page === 'feeArrangement'){
    getPageInfoHandlers.handleFeeArrangementPage(sessionId, res, client);
    return
  }

  if(page === 'accountNotification'){
    getPageInfoHandlers.handleAccountNotificationPage(sessionId, res, client);
    return
  }

  if(page === 'transfer'){
    getPageInfoHandlers.handleTransferPage(sessionId, res, client);
    return
  }

  if(page === 'contribution'){
    getPageInfoHandlers.handleContributionPage(sessionId, res, client);
    return
  }
  
  if(page === 'rollover'){
    getPageInfoHandlers.handleRolloverPage(sessionId, res, client);
    return
  }

  res.status(500).send('no handler for this page');
})

var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));