import {saveWelcomeParameters, welcomePageParameters, applicantId, beneficiaryForm} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas';
import express from 'express';
import pg from 'pg';

export function saveWelcomeParameters(sessionId: string, welcomeParameters: welcomePageParameters, res: express.Response, client: pg.Client)
{
  let welcomePageUpsertQuery : queryParameters = updateWelcomeForm(sessionId, welcomeParameters);
  client.query(welcomePageUpsertQuery).then(result=>{
    res.send('ok');
 })
}

export function saveApplicationIdPage(sessionId: string, applicantForm : applicantId, res: express.Response, client: pg.Client){
    let appQueryInsert : queryParameters = updateAppId(sessionId, applicantForm);
    client.query(appQueryInsert).then(result=>{
      res.send('ok')
    })
}

export function saveBeneficiaryPage(sessionId: string, beneficiaryForm: beneficiaryForm, res: express.Response, client: pg.Client){
  
  console.log(beneficiaryForm.beneficiaries[0])
  console.log(beneficiaryForm.beneficiaries[1])
  res.send('ok');
}

//HELPERS
//function 
function updateBeneficiaries(token: string, beneficiaryData: beneficiaryForm): queryParameters{
  let beneCount = beneficiaryData.beneficiary_count
  for(let index = 0; index < beneCount; ++index){
    let beneficiaries : salesforceSchema.benneficiary ={
      address: beneficiaryData.beneficiaries[index].beneficiary_street,
      beneficiary_type: beneficiaryData.beneficiaries[index].beneficiary_type,
      date_of_birth: new Date(beneficiaryData.beneficiaries[index].beneficiary_dob),
      email: beneficiaryData.beneficiaries[index].beneficiary_email,
      first_name: beneficiaryData.beneficiaries[index].beneficiary_first_name,
      last_name: beneficiaryData.beneficiaries[index].beneficiary_last_name,
      middle_name: '',
      phone: beneficiaryData.beneficiaries[index].beneficiary_phone,
      relationship: beneficiaryData.beneficiaries[index].beneficiary_relationship,
      share_percentage: parseFloat(beneficiaryData.beneficiaries[index].beneficiary_share),
      social_security_number: beneficiaryData.beneficiaries[index].beneficiary_ssn,
      token: token
    }


  }
  
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
    bank_account: '',
    case_management: '',
    credit_card: '',
    investment_amount:0
  }
  return generateQueryString('body', updateWelcomeForm, 'token');
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

function generateQueryString(table : string, upsertApplicant : any , constraint: string = undefined) : queryParameters{
  let substitutes : Array<string> = []
  let fields : Array<string> = []
  let upsertFields : Array<string> = []
  let values : Array<any>  = []
  let count = 1;

  for(let [key, value] of Object.entries(upsertApplicant)){
    substitutes.push(`$${count}`)
    fields.push(key)
    if(key !== constraint){
      upsertFields.push(`${key} = EXCLUDED.${key}`)
    }
    values.push(value)
    count++ 
  };
  let fieldsString = fields.join(',')
  let substitutesString = substitutes.join(',')
  let textString = `INSERT INTO salesforce.${table}(${fieldsString}) VALUES(${substitutesString})`
  console.log(textString)
  
  if(constraint !== undefined)
  {
    let handleConflict : string = upsertFields.join(',');
    let upsertString : string = textString + ` ON CONFLICT(${constraint}) DO UPDATE SET ` + handleConflict;
    console.log(upsertString);
    return {
      text: upsertString,
      values: values
    };  
  }
  return {
    text: textString,
    values: values
  };
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
