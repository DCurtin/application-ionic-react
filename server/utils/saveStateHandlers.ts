import * as applicationInterfaces from '../../client/src/helpers/Utils'
import * as postgresSchema from './postgresSchema'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';
import {Connection as jsfConection, RecordResult} from 'jsforce'
import {startSFOnlineApp, saveFirstStageToSalesforce} from './saveToSalesforce'
import {createAppSession} from './appSessionHandler'
const { v4: uuidv4 } = require('uuid');

export function initializeApplication(welcomeParameters : applicationInterfaces.welcomePageParameters, res: express.Response, pgClient: pg.Client){
  //need to resolve offering_id and owner_id
  let sessionId : string = uuidv4();
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

export function saveOwnerInformationPage(sessionId: string, applicantForm : applicationInterfaces.applicantIdForm, res: express.Response, pgClient: pg.Client, serverConn: Partial<jsfConection>, userInstances:any){
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
        //let appQueryUpsert : queryParameters = updateApplicant(sessionId, applicantForm);
        startSFOnlineApp(sessionId, pgClient, serverConn,applicantForm).then(( appSessionParams : Partial<postgresSchema.application_session> )=>{
          if(appSessionParams === null){
            return null
          }
          let appQueryUpsert:queryParameters = insertApplicant(sessionId, appSessionParams.heroku_token, applicantForm)
          return runQueryReturnPromise(appQueryUpsert,pgClient).then(()=>{
            appSessionParams.session_id = sessionId;
            return createAppSession(appSessionParams,pgClient, {}, res);
          })
        })
        //insert salesforce app
      }else
      {
        saveFirstStageToSalesforce(sessionId, pgClient, serverConn, applicantForm, appSessionResult.rows[0].heroku_token).then((appSessionParams)=>{
          let appQueryUpsert : queryParameters = updateApplicant(sessionId, applicantForm);
          runQuery(appQueryUpsert, res, pgClient);
        })
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
function updateInitialInvestmentPage(session_id: string,  initialInvestmentForm: applicationInterfaces.initialInvestmentForm,): queryParameters
{
  let upsertInitialInvestmentParameters: Partial<postgresSchema.initial_investment> ={...initialInvestmentForm, session_id:session_id}
  return generateQueryString('initial_investment', upsertInitialInvestmentParameters, 'session_id')
}

function updateRolloverPage(session_id: string, rolloverForm: applicationInterfaces.rolloverForm): queryParameters{
  let upsertTransferList  : Array<postgresSchema.rollover> = []
  rolloverForm.rollovers.forEach((element : applicationInterfaces.rollover) => {
    let upsertRollover: postgresSchema.rollover = {...element, key: session_id+element.index, session_id: session_id}
    upsertTransferList.push(upsertRollover)
  });
  return generateQueryStringFromList('rollover', upsertTransferList, 'key');
}

function updateTransfer(session_id: string, transferForm: applicationInterfaces.transferForm): queryParameters{
  let upsertTransferList  : Array<postgresSchema.transfer> = []
  transferForm.transfers.forEach((element : applicationInterfaces.transfer) => {
    let upsertTransfer: postgresSchema.transfer = {...element, key: session_id+element.index, session_id: session_id}
    upsertTransferList.push(upsertTransfer)
  });
  return generateQueryStringFromList('transfer', upsertTransferList, 'key');
}

function updateContributionsPage(session_id: string,  contributionForm: applicationInterfaces.contributionForm): queryParameters
{
  let upsertContributionParameters: postgresSchema.contribution ={...contributionForm, session_id:session_id}
  return generateQueryString('contribution', upsertContributionParameters, 'session_id')
}

function updateAccountNotifications(session_id: string, accountNotificationsForm: applicationInterfaces.accountNotificationsForm): queryParameters
{
  let upsertAccountNotificationsParameters: postgresSchema.interested_party ={...accountNotificationsForm, session_id:session_id}
  return generateQueryString('interested_party', upsertAccountNotificationsParameters, 'session_id')
}

function updateFeeArrangementPage(session_id: string, feeArrangementForm: applicationInterfaces.feeArrangementForm): queryParameters{
  let upsertFeeArrangementParamters : Partial<postgresSchema.fee_arrangement> =
  {//need to remove initial investment type, this should really be saved elsewhere or not carried over
    cc_number: feeArrangementForm.cc_number,
    cc_exp_date: feeArrangementForm.cc_exp_date,
    fee_schedule: feeArrangementForm.fee_schedule,
    payment_method: feeArrangementForm.payment_method,
    session_id: session_id
  }

  return generateQueryString('fee_arrangement', upsertFeeArrangementParamters, 'session_id')
}

function updateWelcomeForm(session_id: string, welcomeParameters: applicationInterfaces.welcomePageParameters): queryParameters{
  let upsertWelcomeParameters : postgresSchema.body ={
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

export function insertApplicant(sessionId : string, herokuToken: string, applicantForm : applicationInterfaces.applicantIdForm): queryParameters{
  let upsertApplicant : Partial<postgresSchema.applicant> = applicantForm
  upsertApplicant.session_id = sessionId;
  upsertApplicant.heroku_token = herokuToken;
  return generateQueryString('applicant', upsertApplicant, 'session_id')
}

function updateApplicant(sessionId : string, applicantForm : applicationInterfaces.applicantIdForm): queryParameters{
    let upsertApplicant : Partial<postgresSchema.applicant> = applicantForm
    upsertApplicant.session_id = sessionId;
    return generateQueryString('applicant', upsertApplicant, 'session_id')
}

function updateBeneficiaries(session_id: string, beneficiaryData: applicationInterfaces.beneficiaryForm): queryParameters{
  let beneCount = beneficiaryData.beneficiary_count
  let beneficiaryDataList : Array<Partial<postgresSchema.beneficiary>> = [];
  let count = 0;
  beneficiaryData.beneficiaries.forEach((bene : applicationInterfaces.beneficiary) =>{
    let pgBene : Partial<postgresSchema.beneficiary> =  {...bene, key: session_id+bene.index, session_id: session_id}
    beneficiaryDataList.push(pgBene);
  })

  return generateQueryStringFromList('beneficiary', beneficiaryDataList, 'key');
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