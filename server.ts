require("dotenv").config();
var path = require('path');
//var express = require('express');
import express from 'express';
import { Http2SecureServer } from 'http2';
import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantId} from './client/src/helpers/Utils'
const { v4: uuidv4 } = require('uuid');
var session = require('express-session');
var router = require('express').Router();
var bodyParser = require('body-parser');
var connectionString = process.env.DATABASE_URL || 'postgresql://postgres@localhost';
import * as salesforceSchema from './server/utils/salesforce'
import pg, { Client } from 'pg'
import e from 'express';
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

// var connectionString = process.env.DATABASE_URL;

// const client = new Client({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// client.connect();
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
  
    /*response.on('data', function(chunk) { 
      res.write(chunk);
      console.log('writing chunk');
    }); 
  
    response.on('end', function() {
      res.end(); 
    }); */
  }); 
  
  request.end();

});

app.get("*", function (req : Express.Response, res : express.Response) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});


app.post('/startApplication', function(req : express.Request, res : express.Response){
  
  let welcomePageData : saveWelcomeParameters = req.body;
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

function initializeApplication(welcomePageData : welcomePageParameters, res: express.Response, token : string){
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
  let packet : requestBody = req.body;
  let sessionId : String = packet.session.sessionId;
  let page : String = packet.session.page;
  console.log('saving state')
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
    let welcomePacket : saveWelcomeParameters = req.body;
    //updateDataBase(onlineAppData, res, sessionId);
  }

  if(page === 'appId'){
    let appIdPacket : applicantId = packet.data;
    let appQueryInsert : queryParameters = updateAppId(appIdPacket, sessionId);
    client.query(appQueryInsert).then(result=>{
      res.send('ok')
    })
  }
  //figure out what page the user is on, upsert data

});

interface fieldValuePair{
  schemaField: string, insertValue?: any
}

interface queryParameters{
  text: string,
  values: Array<any>
}

function updateAppId(appIdPacket : applicantId, token : String): queryParameters{
  let fieldValuePairs:Array<fieldValuePair> = [
    createFieldValuePair('salutation',appIdPacket.salutation),
    createFieldValuePair('first_name',appIdPacket.firstName),
    createFieldValuePair('last_name',appIdPacket.lastName),
    createFieldValuePair('social_security_number',appIdPacket.ssn),
    createFieldValuePair('date_of_birth',appIdPacket.dob === '' ? undefined : appIdPacket.dob),
    createFieldValuePair('email',appIdPacket.email),
    createFieldValuePair('phone',appIdPacket.primaryPhone),
    createFieldValuePair('marital_status',appIdPacket.maritalStatus),
    createFieldValuePair('alternate_phone',appIdPacket.alternatePhone),
    createFieldValuePair('preferred_contact_method',appIdPacket.preferredContactMethod),
    createFieldValuePair('mothers_maiden_name',appIdPacket.mothersMaidenName),
    createFieldValuePair('occupation',appIdPacket.occupation),
    createFieldValuePair('token',token)
  ]
  return generateQueryString('applicant', fieldValuePairs)
}

function generateQueryString(table : string, paramters : Array<fieldValuePair>) : queryParameters{
  let substitutes : Array<string> = []
  let fields : Array<string> = []
  let values : Array<any>  = []
  let count = 1;

  paramters.forEach(element => {
    substitutes.push(`$${count}`)
    fields.push(element.schemaField)
    values.push(element.insertValue)
    count++ 
  });
  let fieldsString = fields.join(',')
  let substitutesString = substitutes.join(',')
  let textString = `INSERT INTO salesforce.${table}(${fieldsString}) VALUES(${substitutesString})`
  console.log(textString)
  return {
    text: `INSERT INTO salesforce.${table}(${fieldsString}) VALUES(${substitutesString})`,
    values: values
  };
}

function createFieldValuePair(fieldName: string, value: any): fieldValuePair{
  let result : fieldValuePair = {schemaField: fieldName, insertValue: value} 
  return result
}

app.post('/saveApplication', function(req : express.Request, res : express.Response){
  var session = req.body.session;

  //merge data in forms
  //insert or upsert data to salesforce
  
  res.send('ok');
})

app.post('/getPageFields', function(req : express.Request, res : express.Response){
  let requestPacket:requestBody = req.body;
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
    let bodyQuery = {
      text : 'SELECT * FROM salesforce.body WHERE token = $1',
      values : [sessionId]
    }
    client.query(bodyQuery).then( function(result:any){
    //get data from database
    //load into response
    let welcomePage : welcomePageParameters;
    let rows = result['rows'];
    welcomePage.AccountType = rows.account_type;
    welcomePage.TransferIra = rows.transfer_form;
    welcomePage.RolloverEmployer = rows.rollover_form;
    welcomePage.CashContribution = rows.cash_contribution_form;
    welcomePage.InitialInvestment = rows.investment_type;
    welcomePage.SalesRep = rows.owner_id;
    welcomePage.SpecifiedSource = rows.referred_by;
    welcomePage.ReferralCode = rows.offering_id;
    
    res.json(welcomePage);
  })
  }

  if(page === 'appId')
  {
    let bodyQuery = {
      text : 'SELECT * FROM salesforce.applicant WHERE token = $1',
      values : [sessionId]
    }
    client.query(bodyQuery).then( function(result:pg.QueryResult ){
      let data : applicantId = {
        isSelfEmployed: false,
        hasHSA: false,
        homeAndMailingAddressDifferent: false,
        firstName:'',
        lastName:'', 
        ssn: '', 
        email: '', 
        confirmEmail:'',
        dob: '', 
        salutation: '',
        maritalStatus: '',
        mothersMaidenName: '',
        occupation: '',
        idType: '', 
        idNumber: '',
        issuedBy:'', 
        issueDate: '', 
        expirationDate: '',
        legalAddress: '', 
        legalCity: '', 
        legalState:'',
        legalZip: '',
        mailingAddress: '', 
        mailingCity: '', 
        mailingState: '',
        mailingZip: '', 
        primaryPhone: '', 
        preferredContactMethod:'', 
        alternatePhone:'', 
        alternatePhoneType:''
    };
      let row : salesforceSchema.applicant = result.rows[0]
      console.log(row);
      //console.log(result)
      data.firstName = row.first_name;
      data.lastName = row.last_name;
      //data.dob = row.date_of_birth;
      res.json({'data': data})
    })
  }
  //res.send('ok');
  })

/*function insertApplication(onlineApp){
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
}*/




var port = process.env.PORT || 3030;

app.listen(port, () => console.log(port));