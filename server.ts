require("dotenv").config();
var path = require('path');
import express from 'express';
import { Http2SecureServer } from 'http2';
import {transformBeneClientToServer} from './server/utils/transformBeneficiaries'
import {transformTransferClientToServer} from './server/utils/transformTransfers'
import {transformRolloverClientToServer} from './server/utils/transformRollovers'
import * as getPageInfoHandlers from './server/utils/getPageInfoHandlers'
import * as saveStateHandlers from './server/utils/saveStateHandlers'
import * as applicationInterfaces from './client/src/helpers/Utils'
import * as salesforceSchema from './server/utils/salesforce'
import {createAppSession} from './server/utils/appSessionHandler';
import jsforce, {Connection as jsfConnection} from 'jsforce'
import pg, { Client, Connection } from 'pg'
import { create } from 'domain';
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
  }).catch((err)=>{
    if (err) {
      console.log(err);
      return console.log('fail');
    }
  })
}

console.log('query url: ' +  connectionString)
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

app.get('/getPenSignDoc', (req : express.Request, res : express.Response) => {

    console.log(serverConn.accessToken);
    let accountNumber = '1234567';
    let url = 'https://entrust--qa.my.salesforce.com'+'/services/apexrest/v1/accounts/' + accountNumber + '/pen-sign-documents';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + serverConn.accessToken,
        'Content-Type':  'application/pdf',
      }
    }

    let https = require('https');

    let request = https.request(url, options, function(response: any) { 
      response.pipe(res);
  }); 
  
  request.end();

});

app.post('/chargeCreditCard', (req : express.Request, res : express.Response) => {
  let sessionId = req.body.sessionId;

  if(sessionId === '' || sessionId === undefined){
    console.log('no sesssion id');
    res.status(500).send('no session id');
    return;
  }

  let paymentQuery = {
    text: 'SELECT * FROM salesforce.payment WHERE token = $1 AND status= $2',
    values: [sessionId, 'Completed']
  }
  
  //may want to move this to another end point that triggered when the user lands on payment info 
  //could also call this endpoint and supply a null parameter for creditcard/
  client.query(paymentQuery).then(function(paymentResult: pg.QueryResult)
  {
    if(paymentResult.rowCount > 0){
      let completedPayment = paymentResult.rows[0]
      res.json({Status: completedPayment.Status, statusdetails: completedPayment.statusdetails, PaymentAmount: completedPayment.paymentamount});
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

      let body = {'creditCardNumber': req.body.creditCardNumber, 'expirationDateString': req.body.expirationDateString}
    
      serverConn.apex.post('/applications/' + application_session.application_id + '/payments', body, function(err : any, data : any) {
        if (err) { return console.error(err); }
        console.log("response: ", data);
        if(data.status === 'Completed')
        {
          let insertString = 'INSERT INTO salesforce.payment(statusdetails, status, paymentamount, discountamount, token) VALUES($1, $2, $3, $4, $5)';
          let queryInsert = {text: insertString, values: [data.StatusDetails, data.Status, data.PaymentAmount, data.DiscountAmount]}

          client.query(queryInsert);
        }

        res.json({Status: data.Status, StatusDetails: data.StatusDetails, PaymentAmount: data.PaymentAmount});
        return
      })
    }).catch()
  })
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
    console.log('account num ' + application_session.account_number)
    let returnurl = process.env.HEROKU_APP_NAME ? `${process.env.HEROKU_APP_NAME}.com` : 'localhost:3030'
    console.log(returnurl);
    serverConn.apex.get('/v1/accounts/' + application_session.account_number + `/esign-url?return-url=http://${returnurl}/docusignReturn`, function(err: any, data: any) {
      if (err) { return console.error(err); }
      else {
        console.log("eSignUrl: ", data.eSignUrl);
        res.json({eSignUrl: data.eSignUrl}); 
        return
      }
    })
  })
});

app.get("*", function (req : Express.Response, res : express.Response) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//need to move to generic location
interface resume{
  last_name:string,
  last_4_ssn:string,
  date_of_birth:string,
  email:string
}
interface resumeRequest{
  appExternalId: string
  data: resume
}

app.post('/resume', (req: express.Request, res: express.Response)=>{
  let authParams : resumeRequest = req.body;
  let options :jsforce.ExecuteOptions ={}
  let token = authParams.appExternalId

  interface salesforceResumeResponse{
    attributes:{
      type:string,
      url:string
    }
    Id:string,
    AccountNew__c:string,
    Last_Name__c:string,
    Email__c:string,
    SSN__c:string,
    DOB__c:string,
    heroku_token__c:string
  }
  serverConn.sobject('Online_Application__C').findOne({heroku_token__c:token}, ['Id','AccountNew__c','Last_Name__c','Email__c', 'SSN__c', 'DOB__c', 'heroku_token__c']).execute(options,(err, record : any)=>{
    console.log(record);
    let salesforceOnlineApp:salesforceResumeResponse= record
    //let lastFourSocial = onlineAppResponse.SSN__c.substring()
    
    let lastFourSocial = salesforceOnlineApp.SSN__c?.match(/\d{4}/)
    if(lastFourSocial === null || lastFourSocial === undefined){
      console.group('failed, application likely does not have ssn')
      res.status(500).send('failed to authenticate');  
    }

    console.log(lastFourSocial)
    let dateOfBirthsMatch = authParams.data.date_of_birth === salesforceOnlineApp.DOB__c;
    let emailsMatch = authParams.data.email.toLowerCase() === salesforceOnlineApp.Email__c.toLowerCase()
    let lastNamesMatch = authParams.data.last_name.toLowerCase() === salesforceOnlineApp.Last_Name__c.toLowerCase()
    let lastFourSocialMatch = authParams.data.last_4_ssn === lastFourSocial[0]

    if(dateOfBirthsMatch && emailsMatch && lastNamesMatch && lastFourSocialMatch)
    {
      console.log('success')
      let sessionId : string = uuidv4();
      let ownerInfo : Partial<salesforceSchema.applicant> ={
        application_id: record.Id,
        account_number: record.AccountNew__c,
        last_name: record.Last_Name__c,
        email: record.Email__c,
        ssn: record.SSN__c,
        dob: record.DOB__c,
        token: record.heroku_token__c
      }
      let queryParams = saveStateHandlers.generateQueryString('applicant', ownerInfo, 'token')
      saveStateHandlers.runQueryReturnPromise(queryParams, client).then((result:pg.QueryResult)=>{
        createAppSession(salesforceOnlineApp.AccountNew__c, salesforceOnlineApp.Id, sessionId, client, userInstances, res)
      })
      return
    }
    console.group('fail')
    res.status(500).send('failed to authenticate');
  })
})

app.post('/startApplication', function(req : express.Request, res : express.Response){
  
  let welcomePageData : applicationInterfaces.saveWelcomeParameters = req.body;
  let sessionId : string = welcomePageData.session.sessionId;
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
  saveStateHandlers.initializeApplication(welcomePageData.data, res, client)
});



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
    saveStateHandlers.saveApplicationIdPage(sessionId, packet.data, res, client, serverConn, userInstances);
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

  if(page === 'initial_investment'){
    let initInvestmentData : applicationInterfaces.initialInvestmentForm = packet.data;
    saveStateHandlers.saveInitialInvestment(sessionId, initInvestmentData, res, client);
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

  if(page === 'initial_investment'){
    getPageInfoHandlers.handleInitialInvestmentPage(sessionId, res, client);
    return
  }

  res.status(500).send('no handler for this page');
})

var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));