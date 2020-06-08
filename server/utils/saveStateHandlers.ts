import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantId} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema, queryParameters} from './helperSchemas'
import express from 'express';
import pg from 'pg';

export function saveApplicationIdPage(sessionId: string, appIdPacket : applicantId, res: express.Response, client: pg.Client){
    let appQueryInsert : queryParameters = updateAppId(appIdPacket, sessionId);
    client.query(appQueryInsert).then(result=>{
      res.send('ok')
    })
}

//HELPERS
function updateAppId(appIdPacket : applicantId, token : string): queryParameters{
    let addresses: {'mailing': addressSchema, 'legal': addressSchema} = generateAddress(appIdPacket);
    let identification: identificationSchema = generateIdentification(appIdPacket);
    let upsertApplicant : salesforceSchema.applicant ={
      alternate_phone: appIdPacket.alternatePhone,
      alternate_phone_type: appIdPacket.alternatePhoneType,
      date_of_birth: appIdPacket.dob === '' ? null : new Date(appIdPacket.dob),
      email: appIdPacket.email,
      first_name: appIdPacket.firstName,
      last_name: appIdPacket.lastName,
      has_hsa: appIdPacket.hasHSA,
      home_and_mailing_address_different: appIdPacket.homeAndMailingAddressDifferent,
      identification: identification,
      is_self_employed: appIdPacket.isSelfEmployed,
      legal_address: addresses.legal,
      mailing_address: addresses.mailing,
      marital_status: appIdPacket.maritalStatus,
      middle_name: '',
      mothers_maiden_name: appIdPacket.mothersMaidenName,
      occupation: appIdPacket.occupation,
      phone: appIdPacket.primaryPhone,
      preferred_contact_method: appIdPacket.preferredContactMethod,
      salutation: appIdPacket.salutation,
      social_security_number: appIdPacket.ssn,
      statement: appIdPacket.salutation,
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
  
  
function generateAddress(appIdPacket: applicantId): {'mailing': addressSchema, 'legal': addressSchema}{
  let resultAddress : {'mailing': addressSchema, 'legal': addressSchema} ={
    mailing :{address: appIdPacket.mailingAddress,
      city: appIdPacket.mailingCity,
      state: appIdPacket.mailingState,
      zip: appIdPacket.mailingZip
    },
    legal:{
      address: appIdPacket.legalAddress,
      city: appIdPacket.legalCity,
      state: appIdPacket.legalState,
      zip: appIdPacket.legalZip
    }
  }
  return resultAddress;
}

function generateIdentification(appIdPacket: applicantId): identificationSchema{
  let resultId: identificationSchema ={
    expirationDate: appIdPacket.expirationDate,
    idNumber: appIdPacket.idNumber,
    idType: appIdPacket.idType,
    issueDate: appIdPacket.issueDate,
    issuedBy: appIdPacket.issuedBy
  }

  return resultId;
}