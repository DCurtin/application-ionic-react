import {saveWelcomeParameters, welcomePageParameters, applicantIdForm, beneficiaryForm, beneficiary, feeArrangementForm, accountNotificationsForm, transferForm, transfer} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';

export function saveWelcomeParameters(sessionId: string, welcomeParameters: welcomePageParameters, res: express.Response, client: pg.Client)
{
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  runQuery(welcomePageUpsertQuery, res, client);
}

export function saveApplicationIdPage(sessionId: string, applicantForm : applicantIdForm, res: express.Response, client: pg.Client){
    let appQueryUpsert : queryParameters = updateAppId(sessionId, applicantForm);
    runQuery(appQueryUpsert, res, client);
}

export function saveBeneficiaryPage(sessionId: string, beneficiaryForm: beneficiaryForm, res: express.Response, client: pg.Client){
  let beneQueryUpsert :queryParameters = updateBeneficiaries(sessionId, beneficiaryForm);
  runQuery(beneQueryUpsert, res, client);
}

export function saveFeeArrangementPage(sessionId: string, feeArrangementForm: feeArrangementForm, res: express.Response, client: pg.Client){
  let feeArrangementQueryUpsert : queryParameters = updateFeeArrangementPage(sessionId, feeArrangementForm);
  runQuery(feeArrangementQueryUpsert, res, client);
}

export function saveAccountNotificationsPage(sessionId: string, accountNotificationsForm: accountNotificationsForm,  res: express.Response, client: pg.Client){
  let accountNotificationsQueryUpsert : queryParameters = updateAccountNotifications(sessionId, accountNotificationsForm);
  runQuery(accountNotificationsQueryUpsert, res, client);
}

export function saveTransferPage(sessionId: string, transferForm: transferForm,  res: express.Response, client: pg.Client)
{
  let transferFormQueryUpsert : queryParameters = updateTransfer(sessionId, transferForm)
  runQuery(transferFormQueryUpsert, res, client);
}
//HELPERS
function updateTransfer(token: string, transferForm: transferForm): queryParameters{
  let upsertTransferList  : Array<salesforceSchema.transfer> = []
  transferForm.transfers.forEach(element => {
    let upsertTransfer: salesforceSchema.transfer = {
      account_number: element.ira_account_number,
      account_type: element.ira_account_type,
      amount: element.ira_cash_amount,
      contact_name: element.ira_contact_name,
      contact_phone_number: element.ira_contact_phone_number,
      delivery_method: element.delivery_method,
      full_or_partial: element.ira_full_or_partial_cash_transfer,
      institution_name: element.ira_institution_name,
      address: generateTransferFormAddress(element),
      asset_name_1: element.transfer_assetname1,
      asset_name_2: element.transfer_assetname2,
      asset_name_3: element.transfer_assetname3,
      transfer_type: element.transfer_type,
      index: element.index,
      key: token + element.index,
      token: token
    }
    upsertTransferList.push(upsertTransfer)
  });
  return generateQueryStringFromList('transfer', upsertTransferList, 'key');
}

function updateAccountNotifications(token: string, accountNotificationsForm: accountNotificationsForm): queryParameters
{
  let upsertAccountNotificationsParameters: salesforceSchema.interested_party ={
    statement_option : accountNotificationsForm.statement_option__c,
    access_level: accountNotificationsForm.interested_party_access_level__c,
    address : generateIPAddress(accountNotificationsForm),
    company_name: accountNotificationsForm.interested_party_company_name__c,
    email : accountNotificationsForm.interested_party_email__c,
    email_notifications : accountNotificationsForm.interested_party_email_notifications__c,
    first_name : accountNotificationsForm.interested_party_first_name__c,
    middle_name : '',
    last_name : accountNotificationsForm.interested_party_last_name__c,
    phone : accountNotificationsForm.interested_party_phone__c,
    title : accountNotificationsForm.interested_party_title__c,
    online_access : accountNotificationsForm.interested_party_online_access__c,
    ira_statement : accountNotificationsForm.interested_party_ira_statement__c,
    token : token
  }
  return generateQueryString('interested_party', upsertAccountNotificationsParameters, 'token')
}

function updateFeeArrangementPage(token: string, feeArrangementForm: feeArrangementForm): queryParameters{
  let upsertFeeArrangementParamters : salesforceSchema.fee_arrangement ={
    credit_number: feeArrangementForm.cc_number__c,
    expiration_date: feeArrangementForm.cc_exp_date__c,
    fee_agreement: feeArrangementForm.fee_schedule__c,
    payment_method: feeArrangementForm.payment_method__c,
    token: token
  }

  return generateQueryString('fee_arrangement', upsertFeeArrangementParamters, 'token')
}

function updateWelcomeForm(token: string, welcomeParameters: welcomePageParameters): queryParameters{
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

function updateAppId(token : string, applicantForm : applicantIdForm): queryParameters{
    let addresses: {'mailing': addressSchema, 'legal': addressSchema} = generateAddress(applicantForm);
    let identification: identificationSchema = generateIdentification(applicantForm);
    let upsertApplicantv2 : Partial<salesforceSchema.applicant> = applicantForm
    console.log(upsertApplicantv2)
    upsertApplicantv2.mailing_address = addresses.mailing;
    upsertApplicantv2.legal_address = addresses.legal;
    upsertApplicantv2.identification = identification;
    upsertApplicantv2.token = token;
    return generateQueryString('applicant', upsertApplicantv2, 'token')
}

function updateBeneficiaries(token: string, beneficiaryData: beneficiaryForm): queryParameters{
  let beneCount = beneficiaryData.beneficiary_count
  let beneficiaryDataList : Array<salesforceSchema.beneficiary> = [];
  let count = 0;
  beneficiaryData.beneficiaries.forEach(bene =>{
    count++;
    console.log('dob')
    console.log(bene.beneficiary_dob)
    let beneficiaries : salesforceSchema.beneficiary ={
      address: generateBeneAddress(bene),
      beneficiary_type: bene.beneficiary_type,
      date_of_birth: bene.beneficiary_dob,
      email: bene.beneficiary_email,
      first_name: bene.beneficiary_first_name,
      last_name: bene.beneficiary_last_name,
      middle_name: '',
      phone: bene.beneficiary_phone,
      relationship: bene.beneficiary_relationship,
      share_percentage: bene.beneficiary_share === '' ? 0 : parseFloat(bene.beneficiary_share),
      social_security_number: bene.beneficiary_ssn,
      position: count,
      bene_uuid: token + count.toString(),
      token: token
    }
    beneficiaryDataList.push(beneficiaries);
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
  
function generateAddress(applicantForm: applicantIdForm): {'mailing': addressSchema, 'legal': addressSchema}{
  let resultAddress : {'mailing': addressSchema, 'legal': addressSchema} ={
    mailing :{address: applicantForm.mailing_street,
      city: applicantForm.mailing_city,
      state: applicantForm.mailing_state,
      zip: applicantForm.mailing_zip
    },
    legal:{
      address: applicantForm.mailing_street,
      city: applicantForm.mailing_city,
      state: applicantForm.mailing_state,
      zip: applicantForm.mailing_zip
    }
  }
  return resultAddress;
}

function generateBeneAddress(beneForm: beneficiary): addressSchema{
  let resultAddress : addressSchema ={
    address: beneForm.beneficiary_street,
    city: beneForm.beneficiary_city,
    state: beneForm.beneficiary_state,
    zip: beneForm.beneficiary_zip

  }
  return resultAddress;
}

function generateIPAddress(accountNotificationsForm: accountNotificationsForm): addressSchema{
  let resultAddress: addressSchema ={
    address : accountNotificationsForm.interested_party_street__c,
    city : accountNotificationsForm.interested_party_city__c,
    state : accountNotificationsForm.interested_party_state__c,
    zip : accountNotificationsForm.interested_party_zip__c
  }
  return resultAddress;
}

function generateTransferFormAddress(transfer: transfer){
  let resultAddress: addressSchema ={
    address: transfer.ira_street,
    city: transfer.ira_city,
    state: transfer.ira_state,
    zip: transfer.ira_zip
  }
  return resultAddress;
}

function generateIdentification(applicantForm: applicantIdForm): identificationSchema{
  let resultId: identificationSchema ={
    expirationDate: applicantForm.expiration_date,
    idNumber: applicantForm.id_number,
    idType: applicantForm.id_type,
    issueDate: applicantForm.issue_date,
    issuedBy: applicantForm.issued_by
  }

  return resultId;
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
