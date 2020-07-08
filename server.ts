require("dotenv").config();
var path = require('path');
let https = require('https');
import express from 'express';
import {transformBeneClientToServer} from './server/utils/transformBeneficiaries'
import {transformTransferClientToServer} from './server/utils/transformTransfers'
import {transformRolloverClientToServer} from './server/utils/transformRollovers'
import {resumeApplication} from './server/utils/retrieveFromSalesforce'
import {saveCurrentStateOfApplication} from './server/utils/saveToSalesforce'
import * as getPageInfoHandlers from './server/utils/getPageInfoHandlers'
import * as saveStateHandlers from './server/utils/saveStateHandlers'
import * as applicationInterfaces from './client/src/helpers/Utils'
import * as salesforceSchema from './server/utils/postgresSchema'
import * as validatedPages from './server/utils/validatePages'
import {createAppSession} from './server/utils/appSessionHandler';
import jsforce, {Connection as jsfConnection} from 'jsforce'
import pg, { Client, Connection } from 'pg'
const { v4: uuidv4 } = require('uuid');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgresql://postgres:welcome@localhost';
var client  = new pg.Client(connectionString);

var userInstances: any = {}

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
    console.log(`instance url: ${serverConn.instanceUrl}`)
  }).catch((err)=>{
    if (err) {
      console.log(err);
      return console.log('fail');
    }
  })
}

client.connect();
client.query('DELETE FROM salesforce.application_session')

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
  console.log('Charge credit card on server');
  
  let sessionId = req.body.sessionId;
  validateSessionId(res, sessionId);
  
  let paymentQuery = {
    text: 'SELECT * FROM salesforce.payment WHERE session_id = $1 AND status= $2',
    values: [sessionId, 'Completed']
  }
  
  //may want to move this to another end point that triggered when the user lands on payment info 
  //could also call this endpoint and supply a null parameter for creditcard/
  client.query(paymentQuery).then(function(paymentResult: pg.QueryResult){
    if(paymentResult.rowCount > 0){
      let completedPayment = paymentResult.rows[0]
      res.json({Status: completedPayment.status, statusdetails: completedPayment.status_details, PaymentAmount: completedPayment.payment_amount});
      return
    }
    let sessionQuery = {
      text: 'SELECT * FROM salesforce.application_session WHERE session_id = $1',
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

    let body = {'creditCardNumber': req.body.creditCardNumber, 'expirationDateString': req.body.expirationDateString};
  
    serverConn.apex.post('/applications/' + application_session.application_id + '/payments', body, function(err : any, data : any) {
      if (err) { 
        res.status(500).send(err.message);  
        return
      }
      let application_session : salesforceSchema.application_session = result.rows[0];

      let body = {'creditCardNumber': req.body.creditCardNumber, 'expirationDateString': req.body.expirationDateString}
    
      serverConn.apex.post('/applications/' + application_session.application_id + '/payments', body, function(err : any, data : any) {
        if (err) { 
          res.status(500).send(err.message);  
          return
        }
        console.log("response: ", data);
        
        if(data.status === 'Completed')
        {
          let insertString = 'INSERT INTO salesforce.payment(status_details, status, payment_amount, discount_amount, session_id) VALUES($1, $2, $3, $4, $5)';
          let queryInsert = {text: insertString, values: [data.StatusDetails, data.Status, data.PaymentAmount, data.DiscountAmount]}

          client.query(queryInsert);
        }

        res.json({Status: data.Status, StatusDetails: data.StatusDetails, PaymentAmount: data.PaymentAmount});
          return
        })
      }).catch()
    })
  })
})

app.post('/saveApplication', (req, res) =>{
  let sessionId : string = req.body.sessionId;
  saveCurrentStateOfApplication(sessionId, client, serverConn).then((result)=>{
    res.send(result);
  })
})

app.post('/getESignUrl', (req, res) => {
  console.log('Get ESignUrl on server');
  
  let sessionId = req.body.sessionId;
  validateSessionId(res, sessionId);
  
  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(sessionQuery).then(function(result:pg.QueryResult){
    result = validateApplicationSessionQuery(res, result);
    let application_session : salesforceSchema.application_session = result.rows[0];
    
    let returnBaseUrl = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : 'http://localhost:3000'
    let endpoint = '/v1/accounts/' + application_session.account_number + `/esign-url?return-url=${returnBaseUrl}/DocusignReturn/${sessionId}`;

    serverConn.apex.get(endpoint, function(err: any, data: any) {
      if (err) { 
        res.status(500).send(err.message);  
        return
      }
      else {
        res.json({eSignUrl: data.eSignUrl}); 
        return
      }
    })
  })
});

app.post('/handleDocusignReturn', (req : express.Request, res : express.Response) => {
  console.log('handleDocusignReturn running on server' );
  
  let sessionId = req.body.sessionId;
  validateSessionId(res, sessionId);

  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE session_id = $1',
    values: [sessionId]
  }
  
  client.query(sessionQuery).then(function(result: pg.QueryResult){
    result = validateApplicationSessionQuery(res, result);
    let application_session : salesforceSchema.application_session = result.rows[0];

    let returnBaseUrl = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : 'http://localhost:3000'    
    let body = {'eSignResult': req.body.eSignResult, 'eSignReturnUrl': `${returnBaseUrl}/DocusignReturn/${sessionId}`};

    serverConn.apex.post('/applications/' + application_session.application_id + '/docusign-return', body, function(err : any, data : any) {
      if (err) { 
        res.status(500).send(err.message);  
        return
      }
      else {
        console.log("response: ", data);
        res.json({docusignAttempts: data.DocusignAttempts, docusignUrl: data.DocusignUrl, accountType: data.AccountType}); 
        return
      }
    })
  }).catch()
});

app.get('/getPenSignDocs', (req : express.Request, res : express.Response) => {
  console.log('getPenSignDocs running on server' );

  let sessionId = req.query['sessionId'];
  validateSessionId(res, sessionId.toString());
  
  let sessionQuery = {
    text: 'SELECT * FROM salesforce.application_session WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(sessionQuery).then(function(result:pg.QueryResult) {
    result = validateApplicationSessionQuery(res, result);
    let application_session : salesforceSchema.application_session = result.rows[0];
    
    let eSignResult = req.query['eSignResult'];
    let instanceUrl = serverConn.instanceUrl || 'https://entrust--qa.my.salesforce.com'

    let endpoint = instanceUrl + '/services/apexrest/v1/accounts/' + application_session.account_number + '/pen-sign-documents?esign-result=' + eSignResult;
    console.log('getPenSignDoc enpoint: ' + endpoint);

    let options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + serverConn.accessToken,
        'Content-Type':  'application/pdf',
      }
    }

    let request = https.request(endpoint, options, function(response: any) { 
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

function validateSessionId(res : express.Response, sessionId: String) {
  if(sessionId === '' || sessionId === undefined) {
    console.log('no sesssion id');
    res.status(500).send('no session id');
    return
  }  
}

function validateApplicationSessionQuery(res : express.Response, result: pg.QueryResult) {
  if(result.rowCount == 0) {
    console.log('no application')
    res.status(500).send('no application');
    return;
  }
  return result;
}
app.get('/loaderio-18abbe8b69ba76fa08ae8d129f865a2f/', (req : express.Request, res : express.Response) => {
  console.log('deliver loader file')
  const file = `${__dirname}/loaderio-18abbe8b69ba76fa08ae8d129f865a2f.txt`;
  res.download(file); // Set disposition and send it.
});

app.get("*", function (req : Express.Response, res : express.Response) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.post('/resume', (req: express.Request, res: express.Response)=>{
  resumeApplication(client, userInstances, serverConn, req.body, res)
})

app.post('/startApplication', function(req : express.Request, res : express.Response){
  
  let welcomePageData : applicationInterfaces.saveWelcomeParameters = req.body;
  let sessionId : string = welcomePageData.session.sessionId;
  let page : string = welcomePageData.session.page;

  if(sessionId !== ''){
    console.log('application has already been started');
    console.log(sessionId);
    res.status(500).send('SessionId set');
    return;
  }
  
  if(page !== 'welcomePage'){
    
    console.log('Cannot start an application on this page ' + page);
    res.status(500).send('Wrong page ' + page);
    return;
  }

  //figure out what page they're on
  saveStateHandlers.initializeApplication(welcomePageData.data, res, client)
});


app.post('/saveState', function(req : express.Request, res : express.Response){
  let packet : applicationInterfaces.requestBody = req.body;
  let sessionId : string = packet.session.sessionId;
  let page : string = packet.session.page;

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
    saveStateHandlers.saveOwnerInformationPage(sessionId, packet.data, res, client, serverConn, userInstances);
    return
  }

  if(page === 'beneficiary'){
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

  if(page === 'initial_investment'){
    let initInvestmentData : applicationInterfaces.initialInvestmentForm = packet.data;
    saveStateHandlers.saveInitialInvestment(sessionId, initInvestmentData, res, client);
    return
  }
  res.status(500).send('no handler for this page');
});

app.post('/validatePage', function(req: express.Request, res: express.Response){
  let packet : applicationInterfaces.requestBody = req.body;
  let sessionId : string = packet.session.sessionId;

  if(sessionId === undefined || sessionId === '')
  {
    console.log('sessionId or page not set in request');
    res.status(500).send('invalid arguments');
    return
  }
  validatedPages.saveValidatedPages(sessionId, packet.data, client, res);
})

app.post('/getValidatedPages', function(req: express.Request, res: express.Response){
  let packet : applicationInterfaces.requestBody = req.body;
  let sessionId : string = packet.session.sessionId;
  if(sessionId === undefined || sessionId === '')
  {
    console.log('sessionId or page not set in request');
    res.status(500).send('invalid arguments');
    return
  }
  validatedPages.getValidatedPages(sessionId, client, res);
})

app.post('/getPageFields', function(req : express.Request, res : express.Response){
  let requestPacket:applicationInterfaces.requestBody = req.body;
  let sessionId = requestPacket.session.sessionId;
  let page = requestPacket.session.page;
  console.log(`page: ${page} sessionId: ${sessionId}`)
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

  if(page === 'initial_investment'){
    getPageInfoHandlers.handleInitialInvestmentPage(sessionId, res, client);
    return
  }

  res.status(500).send('no handler for this page');
})

var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));