import * as applicationInterfaces from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';
import {Connection as jsfConection, RecordResult} from 'jsforce'
import {startSFOnlineApp} from './saveToSalesforce'
const { v4: uuidv4 } = require('uuid');

export function initializeApplication(welcomeParameters : applicationInterfaces.welcomePageParameters, res: express.Response, pgClient: pg.Client){
  //need to resolve offering_id and owner_id
  let sessionId : string = uuidv4();
  console.log(welcomeParameters)
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  runQueryReturnPromise(welcomePageUpsertQuery,pgClient).then((result:pg.QueryResult)=>{
    res.json({'sessionId': sessionId});
  }).catch(err=>{
    console.log(err);
    console.log('failed to start app')
    res.status(500).send('unable to initialize application')
  })
}

export function saveWelcomeParameters(sessionId: string, welcomeParameters: applicationInterfaces.welcomePageParameters, res: express.Response, pgClient: pg.Client)
{
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  runQuery(welcomePageUpsertQuery, res, pgClient);
}

export function saveApplicationIdPage(sessionId: string, applicantForm : applicationInterfaces.applicantIdForm, res: express.Response, pgClient: pg.Client, serverConn: Partial<jsfConection>, userInstances:any){
    //query for application_session
    //if none exists
    //insert on SF and create a new application_session
    let sessionQuery = {
      text: 'SELECT * FROM salesforce.application_session WHERE session_id = $1',
      values: [sessionId]
    }
    pgClient.query(sessionQuery).then( function(appSessionResult:pg.QueryResult){
      if(appSessionResult.rowCount == 0 && serverConn.accessToken !== 'test_conn')
      {
        let appQueryUpsert : queryParameters = updateAppId(sessionId, applicantForm);
        startSFOnlineApp(sessionId,pgClient, serverConn,applicantForm,appQueryUpsert,res)
        //insert salesforce app
      }else
      {
        let appQueryUpsert : queryParameters = updateAppId(sessionId, applicantForm);
        runQuery(appQueryUpsert, res, pgClient);
        /*runQueryReturnPromise(appQueryUpsert,pgClient).then((queryUpsertResult:pg.QueryResult)=>{
                createAppSession('', '', sessionId,pgClient, userInstances,res)
              }).catch(err=>{
                console.log('could not upsert app')
                res.status(500).send('failed inserting app')
              });*/
      }
    }).catch(err=>{
      console.log(err)
      res.status(500).send('unknown exception saving application')
    })
}

export function saveBeneficiaryPage(sessionId: string, beneficiaryForm: applicationInterfaces.beneficiaryForm, res: express.Response, pgClient: pg.Client){
  let beneQueryUpsert :queryParameters = updateBeneficiaries(sessionId, beneficiaryForm);
  runQuery(beneQueryUpsert, res, pgClient);
}

export function saveFeeArrangementPage(sessionId: string, feeArrangementForm: applicationInterfaces.feeArrangementForm, res: express.Response, pgClient: pg.Client){
  let feeArrangementQueryUpsert : queryParameters = updateFeeArrangementPage(sessionId, feeArrangementForm);
  runQuery(feeArrangementQueryUpsert, res, pgClient);
}

export function saveAccountNotificationsPage(sessionId: string, accountNotificationsForm: applicationInterfaces.accountNotificationsForm,  res: express.Response, pgClient: pg.Client){
  let accountNotificationsQueryUpsert : queryParameters = updateAccountNotifications(sessionId, accountNotificationsForm);
  runQuery(accountNotificationsQueryUpsert, res, pgClient);
}

export function saveTransferPage(sessionId: string, transferForm: applicationInterfaces.transferForm,  res: express.Response, pgClient: pg.Client)
{
  let transferFormQueryUpsert : queryParameters = updateTransfer(sessionId, transferForm)
  runQuery(transferFormQueryUpsert, res, pgClient);
}

export function saveContributionPage(sessionId: string, contributionForm: applicationInterfaces.contributionForm,  res: express.Response, pgClient: pg.Client){
  let contributionQueryUpsert : queryParameters = updateContributionsPage(sessionId, contributionForm);
  console.log(contributionForm);
  console.log(contributionQueryUpsert);
  runQuery(contributionQueryUpsert, res, pgClient);
}

export function saveRolloverPage(sessionId: string, contributionForm: applicationInterfaces.rolloverForm,  res: express.Response, pgClient: pg.Client){
  let rolloverQueryUpsert : queryParameters = updateRolloverPage(sessionId, contributionForm);
  runQuery(rolloverQueryUpsert, res, pgClient);
}

export function saveInitialInvestment(sessionId: string, initialInvestmentForm: applicationInterfaces.initialInvestmentForm,  res: express.Response, pgClient: pg.Client){
  let initialInvestmentUpsert :queryParameters = updateInitialInvestmentPage(sessionId, initialInvestmentForm);
  runQuery(initialInvestmentUpsert, res, pgClient);
}
//HELPERS
function updateInitialInvestmentPage(token: string,  initialInvestmentForm: applicationInterfaces.initialInvestmentForm,): queryParameters
{
  console.log(initialInvestmentForm)
  let upsertInitialInvestmentParameters: Partial<salesforceSchema.initial_investment> ={...initialInvestmentForm, token:token}
  return generateQueryString('initial_investment', upsertInitialInvestmentParameters, 'token')
}

function updateRolloverPage(token: string, rolloverForm: applicationInterfaces.rolloverForm): queryParameters{
  let upsertTransferList  : Array<salesforceSchema.rollover> = []
  rolloverForm.rollovers.forEach((element : applicationInterfaces.rollover) => {
    let upsertRollover: salesforceSchema.rollover = {...element, key: token+element.index, token: token}
    upsertTransferList.push(upsertRollover)
  });
  return generateQueryStringFromList('rollover', upsertTransferList, 'key');
}

function updateTransfer(token: string, transferForm: applicationInterfaces.transferForm): queryParameters{
  let upsertTransferList  : Array<salesforceSchema.transfer> = []
  transferForm.transfers.forEach((element : applicationInterfaces.transfer) => {
    let upsertTransfer: salesforceSchema.transfer = {...element, key: token+element.index, token: token}
    upsertTransferList.push(upsertTransfer)
  });
  return generateQueryStringFromList('transfer', upsertTransferList, 'key');
}

function updateContributionsPage(token: string,  contributionForm: applicationInterfaces.contributionForm): queryParameters
{
  let upsertContributionParameters: salesforceSchema.contribution ={...contributionForm, token:token}
  return generateQueryString('contribution', upsertContributionParameters, 'token')
}

function updateAccountNotifications(token: string, accountNotificationsForm: applicationInterfaces.accountNotificationsForm): queryParameters
{
  let upsertAccountNotificationsParameters: salesforceSchema.interested_party ={...accountNotificationsForm, token:token}
  return generateQueryString('interested_party', upsertAccountNotificationsParameters, 'token')
}

function updateFeeArrangementPage(token: string, feeArrangementForm: applicationInterfaces.feeArrangementForm): queryParameters{
  let upsertFeeArrangementParamters : Partial<salesforceSchema.fee_arrangement> =
  {//need to remove initial investment type, this should really be saved elsewhere or not carried over
    cc_number: feeArrangementForm.cc_number,
    cc_exp_date: feeArrangementForm.cc_exp_date,
    fee_schedule: feeArrangementForm.fee_schedule,
    payment_method: feeArrangementForm.payment_method,
    token: token
  }

  return generateQueryString('fee_arrangement', upsertFeeArrangementParamters, 'token')
}

function updateWelcomeForm(session_id: string, welcomeParameters: applicationInterfaces.welcomePageParameters): queryParameters{
  let upsertWelcomeParameters : salesforceSchema.body ={
    ...welcomeParameters,
    session_id: session_id,
    //need to make these nullable and exclude them from this upsert or possibly move them to their own table
    bank_account: {},
    case_management: '',
    credit_card: {},
    investment_amount:0
  }
  return generateQueryString('body', upsertWelcomeParameters, 'session_id');
}

function updateAppId(sessionId : string, applicantForm : applicationInterfaces.applicantIdForm): queryParameters{
    let upsertApplicantv2 : Partial<salesforceSchema.applicant> = applicantForm
    console.log(upsertApplicantv2)
    upsertApplicantv2.token = sessionId;
    return generateQueryString('applicant', upsertApplicantv2, 'token')
}

function updateBeneficiaries(token: string, beneficiaryData: applicationInterfaces.beneficiaryForm): queryParameters{
  let beneCount = beneficiaryData.beneficiary_count
  let beneficiaryDataList : Array<Partial<salesforceSchema.beneficiary>> = [];
  let count = 0;
  beneficiaryData.beneficiaries.forEach((bene : applicationInterfaces.beneficiary) =>{
    let pgBene : Partial<salesforceSchema.beneficiary> =  bene
    count++;
    console.log('dob')
    console.log(bene.dob)
    pgBene.position = count;
    pgBene.bene_uuid = token+count;
    pgBene.token = token;
    beneficiaryDataList.push(pgBene);
  })

  return generateQueryStringFromList('beneficiary', beneficiaryDataList, 'bene_uuid');
}

export function generateQueryString(table : string, upsertObject : any , constraint: string = undefined) : queryParameters{
  return generateQueryStringFromList(table, [upsertObject], constraint);
}

function generateQueryStringFromList(table: string, upsertObjectList : Array<any>, constraint: string = undefined): queryParameters{
  let pgFields : string = '';
  let placeHolderList : Array<string> = [];
  let valueList : Array<any> = [];
  let upsertFields : Array<string> = []
  let itemCount = 0;

  upsertObjectList.forEach(element => {
    let elementValues: Array<any> = Object.values(element);
    if(pgFields === '')
    {
      pgFields = Object.keys(element).join(',');
      Object.keys(element).forEach(key=>{
        if(key !== constraint && key !== undefined){
          upsertFields.push(`${key} = EXCLUDED.${key}`)
        }
      })
    }
    placeHolderList.push('('+ elementValues.map(e=>{itemCount++; return `$${itemCount}`}) +')')
    valueList = valueList.concat(elementValues)
  });
  let valueString = placeHolderList.join(',');
  let insertString : string = `INSERT INTO salesforce.${table}(${pgFields}) VALUES${valueString}`

  if(constraint !== undefined){
    let handleConflict : string = upsertFields.join(',');
    let upsertString : string = insertString + ` ON CONFLICT(${constraint}) DO UPDATE SET ` + handleConflict;
    return{
      text: upsertString,
      values: valueList
    }
  }

  return {
    text: insertString,
    values: valueList
  }
}  

function runQuery(queryString: queryParameters, res: express.Response, pgClient: pg.Client)
{
  pgClient.query(queryString).then(result=>{
    res.send('ok');
  }).catch(err=>{
    console.log(err);
    res.status(500).send('failed saving fee arrangements');
  })
}

export function runQueryReturnPromise(queryString: queryParameters, pgClient: pg.Client)
{
  console.log(queryString)
  return pgClient.query(queryString)
}