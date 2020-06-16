require("dotenv").config();
var path = require('path');
//var express = require('express');
import express from 'express';
import { Http2SecureServer } from 'http2';
import {transformBeneClientToServer} from './server/utils/transformBeneficiaries'
import {transformTransferClientToServer} from './server/utils/transformTransfers'
import * as getPageInfoHandlers from './server/utils/getPageInfoHandlers'
import * as saveStateHandlers from './server/utils/saveStateHandlers'
import * as applicationInterfaces from './client/src/helpers/Utils'
//{applicationInterfaces.saveWelcomeParameters, applicationInterfaces.requestBody, applicationInterfaces.welcomePageParameters, applicationInterfaces.beneficiaryForm, applicationInterfaces.feeArrangementForm, accountNotificationsForm, transferForm}
const { v4: uuidv4 } = require('uuid');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgresql://postgres:welcome@localhost';
import pg, { Client } from 'pg'
var client  = new pg.Client(connectionString);
var jsforce = require('jsforce');
var serverConn = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
    //loginUrl : 'https://dcurtin-iraonline.cs17.force.com/client',
    clientId : process.env.QAServer_id || 'test',
    clientSecret : process.env.QAServer_sec || 'test',
    redirectUri : process.env.QAServer_url || 'test'
  }
});
//+ process.env.UserToken
var qaUser = process.env.qaUserId || 'test';
var qaPw = process.env.qaUserPw || 'test';

//need to setup for local testing
if(qaUser === 'test' || qaPw === 'test')
{
  serverConn = {
    accessToken: 'test_conn'
  }
}else{
  serverConn.login(process.env.qaUserId, process.env.qaUserPw, function(err : any, userInfo : any) {
    console.log('token: ' + serverConn.accessToken)
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
    saveStateHandlers.saveApplicationIdPage(sessionId, packet.data, res, client);
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
    let rolloverData : applicationInterfaces.rolloverForm = packet.data;
    saveStateHandlers.saveContributionPage(sessionId, contributionData, res, client);
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

  res.status(500).send('no handler for this page');
  })

var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));