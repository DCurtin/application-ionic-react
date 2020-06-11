import {saveWelcomeParameters, welcomePageParameters, applicantId, beneficiaryForm, beneficiary, feeArrangementForm} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';

export function saveWelcomeParameters(sessionId: string, welcomeParameters: welcomePageParameters, res: express.Response, client: pg.Client)
{
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  console.log(welcomePageUpsertQuery);
  client.query(welcomePageUpsertQuery).then(result=>{
    res.send('ok');
 }).catch(err=>{
  console.log(err);
  res.status(500).send('failed');
})
}

export function saveApplicationIdPage(sessionId: string, applicantForm : applicantId, res: express.Response, client: pg.Client){
    let appQueryInsert : queryParameters = updateAppId(sessionId, applicantForm);
    client.query(appQueryInsert).then(result=>{
      res.send('ok')
    }).catch(err=>{
      console.log(err);
      res.status(500).send('failed');
    })
}

export function saveBeneficiaryPage(sessionId: string, beneficiaryForm: beneficiaryForm, res: express.Response, client: pg.Client){
  let queryString :queryParameters = updateBeneficiaries(sessionId, beneficiaryForm);
  client.query(queryString).then(result=>{
    res.send('ok');
  }).catch(err=>{
    console.log(err);
    res.status(500).send('failed');
  })
  //res.send('ok');
}

export function saveFeeArrangementPage(sessionId: string, feeArrangementForm: feeArrangementForm, res: express.Response, client: pg.Client){
  let queryString : queryParameters = updateFeeArrangementPage(sessionId, feeArrangementForm);
  client.query(queryString).then(result=>{
    res.send('ok');
  }).catch(err=>{
    console.log(err);
    res.status(500).send('failed saving fee arrangements');
  })
}

//HELPERS
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

function updateAppId(token : string, applicantForm : applicantId): queryParameters{
    let addresses: {'mailing': addressSchema, 'legal': addressSchema} = generateAddress(applicantForm);
    let identification: identificationSchema = generateIdentification(applicantForm);
    let upsertApplicant : salesforceSchema.applicant ={
      alternate_phone: applicantForm.alternatePhone,
      alternate_phone_type: applicantForm.alternatePhoneType,
      date_of_birth: applicantForm.dob === '' ? null : new Date(applicantForm.dob),
      email: applicantForm.email,
      first_name: applicantForm.firstName,
      last_name: applicantForm.lastName,
      has_hsa: applicantForm.hasHSA,
      home_and_mailing_address_different: applicantForm.homeAndMailingAddressDifferent,
      identification: identification,
      is_self_employed: applicantForm.isSelfEmployed,
      legal_address: addresses.legal,
      mailing_address: addresses.mailing,
      marital_status: applicantForm.maritalStatus,
      middle_name: '',
      mothers_maiden_name: applicantForm.mothersMaidenName,
      occupation: applicantForm.occupation,
      phone: applicantForm.primaryPhone,
      preferred_contact_method: applicantForm.preferredContactMethod,
      salutation: applicantForm.salutation,
      social_security_number: applicantForm.ssn,
      statement: applicantForm.salutation,
      token: token
    }
    return generateQueryString('applicant', upsertApplicant, 'token')
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
      date_of_birth: (bene.beneficiary_dob === '' || bene.beneficiary_dob === undefined) ? undefined : new Date(bene.beneficiary_dob),
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

function generateQueryString(table : string, upsertObject : any , constraint: string = undefined) : queryParameters{
  return generateQueryStringFromList(table, [upsertObject], constraint);
}
  
  
function generateAddress(applicantForm: applicantId): {'mailing': addressSchema, 'legal': addressSchema}{
  let resultAddress : {'mailing': addressSchema, 'legal': addressSchema} ={
    mailing :{address: applicantForm.mailingAddress,
      city: applicantForm.mailingCity,
      state: applicantForm.mailingState,
      zip: applicantForm.mailingZip
    },
    legal:{
      address: applicantForm.legalAddress,
      city: applicantForm.legalCity,
      state: applicantForm.legalState,
      zip: applicantForm.legalZip
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

function generateIdentification(applicantForm: applicantId): identificationSchema{
  let resultId: identificationSchema ={
    expirationDate: applicantForm.expirationDate,
    idNumber: applicantForm.idNumber,
    idType: applicantForm.idType,
    issueDate: applicantForm.issueDate,
    issuedBy: applicantForm.issuedBy
  }

  return resultId;
}
