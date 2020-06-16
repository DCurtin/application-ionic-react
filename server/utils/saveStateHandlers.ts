import * as applicationInterfaces from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';
import {Connection as jsfConection, RecordResult} from 'jsforce'
import { text } from 'body-parser';

export function saveWelcomeParameters(sessionId: string, welcomeParameters: applicationInterfaces.welcomePageParameters, res: express.Response, client: pg.Client)
{
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  runQuery(welcomePageUpsertQuery, res, client);
}

export function saveApplicationIdPage(sessionId: string, applicantForm : applicationInterfaces.applicantIdForm, res: express.Response, client: pg.Client, serverConn: Partial<jsfConection>){
    //query for application_session
    //if none exists
    //insert on SF and create a new application_session
    let sessionQuery = {
      text: 'SELECT * FROM salesforce.application_session WHERE token = $1',
      values: [sessionId]
    }
    client.query(sessionQuery).then( function(appSessionResult:pg.QueryResult){
      if(appSessionResult.rowCount == 0)
      {
        console.log('found no app')
        serverConn.sobject("Online_Application__c").create({'First_Name__c': applicantForm.first_name, 
        'Last_Name__c':applicantForm.last_name, 
        'Token__c':sessionId, 
        'IntegrationOwner__c':'0052i000000Mz0CAAS', 
        'Expiration_Date__c':'2025-10-10', 
        'Account_Type__c':'Traditional IRA', 
        'Email__c': applicantForm.email,
        'Legal_Address__c': applicantForm.legal_street,
        'legal_City__c':applicantForm.legal_city,
        'legal_State__c':applicantForm.legal_state,
        'legal_Zip__c':applicantForm.legal_zip      
      }).then((result:any)=>{
          serverConn.sobject("Online_Application__c").retrieve(result.id).then((queryResult: any)=>{
            //console.log(queryResult);
            console.log(queryResult['First_Name__c']);
            console.log(queryResult['AccountNew__c']);
            let sessionInsert : queryParameters = {
              text:'INSERT INTO salesforce.application_session(account_number,application_id,token) VALUES($1,$2,$3)',
              values:[queryResult['AccountNew__c'], result.id, sessionId]
            }
            client.query(sessionInsert).then(result=>{
              let appQueryUpsert : queryParameters = updateAppId(sessionId, applicantForm);
              runQuery(appQueryUpsert, res, client);
            })
          })
        }).catch(err=>{
          console.log('failed to start session');
          res.status(500).send('failed to start session');
        });
        //insert salesforce app
      }else
      {
        let appQueryUpsert : queryParameters = updateAppId(sessionId, applicantForm);
        runQuery(appQueryUpsert, res, client);
      }
    })
}

export function saveBeneficiaryPage(sessionId: string, beneficiaryForm: applicationInterfaces.beneficiaryForm, res: express.Response, client: pg.Client){
  let beneQueryUpsert :queryParameters = updateBeneficiaries(sessionId, beneficiaryForm);
  runQuery(beneQueryUpsert, res, client);
}

export function saveFeeArrangementPage(sessionId: string, feeArrangementForm: applicationInterfaces.feeArrangementForm, res: express.Response, client: pg.Client){
  let feeArrangementQueryUpsert : queryParameters = updateFeeArrangementPage(sessionId, feeArrangementForm);
  runQuery(feeArrangementQueryUpsert, res, client);
}

export function saveAccountNotificationsPage(sessionId: string, accountNotificationsForm: applicationInterfaces.accountNotificationsForm,  res: express.Response, client: pg.Client){
  let accountNotificationsQueryUpsert : queryParameters = updateAccountNotifications(sessionId, accountNotificationsForm);
  runQuery(accountNotificationsQueryUpsert, res, client);
}

export function saveTransferPage(sessionId: string, transferForm: applicationInterfaces.transferForm,  res: express.Response, client: pg.Client)
{
  let transferFormQueryUpsert : queryParameters = updateTransfer(sessionId, transferForm)
  runQuery(transferFormQueryUpsert, res, client);
}

export function saveContributionPage(sessionId: string, controbutionForm: applicationInterfaces.contributionForm,  res: express.Response, client: pg.Client){
  let contributionQueryUpsert : queryParameters = updateContributionsPage(sessionId, controbutionForm);
  console.log(controbutionForm);
  console.log(contributionQueryUpsert);
  runQuery(contributionQueryUpsert, res, client);
}

export function saveRolloverPage(sessionId: string, controbutionForm: applicationInterfaces.rolloverForm,  res: express.Response, client: pg.Client){
  let rolloverQueryUpsert : queryParameters = updateRolloverPage(sessionId, controbutionForm);
  runQuery(rolloverQueryUpsert, res, client);
}
//HELPERS
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

function updateContributionsPage(token: string,  controbutionForm: applicationInterfaces.contributionForm): queryParameters
{
  let upsertContributionParameters: salesforceSchema.contribution ={...controbutionForm, token:token}
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

function updateWelcomeForm(token: string, welcomeParameters: applicationInterfaces.welcomePageParameters): queryParameters{
  let upsertWelcomeParameters : salesforceSchema.body ={
    account_type: welcomeParameters.AccountType,
    transfer_form: welcomeParameters.TransferIra,
    rollover_form: welcomeParameters.RolloverEmployer,
    cash_contribution_form: welcomeParameters.CashContribution,
    investment_type: welcomeParameters.InitialInvestment,
    owner_id: welcomeParameters.SalesRep,
    referred_by: welcomeParameters.SpecifiedSource,
    offering_id: welcomeParameters.ReferralCode,
    token: token,
    //need to make these nullable and exclude them from this upsert or possibly move them to their own table
    bank_account: {},
    case_management: '',
    credit_card: {},
    investment_amount:0
  }
  return generateQueryString('body', upsertWelcomeParameters, 'token');
}

function updateAppId(token : string, applicantForm : applicationInterfaces.applicantIdForm): queryParameters{
    let upsertApplicantv2 : Partial<salesforceSchema.applicant> = applicantForm
    console.log(upsertApplicantv2)
    upsertApplicantv2.token = token;
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

function generateQueryString(table : string, upsertObject : any , constraint: string = undefined) : queryParameters{
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

function runQuery(queryString: queryParameters, res: express.Response, client: pg.Client)
{
  client.query(queryString).then(result=>{
    res.send('ok');
  }).catch(err=>{
    console.log(err);
    res.status(500).send('failed saving fee arrangements');
  })
}
