import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantId, beneficiary, beneficiaryPlaceHolder, feeArrangementForm} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema} from './helperSchemas'
import express from 'express';
import pg from 'pg';

export function handleWelcomePageRequest(sessionId: string, res: express.Response, client: pg.Client)
{
    let objectQuery = {
        text : 'SELECT * FROM salesforce.body WHERE token = $1',
        values : [sessionId]
      }
      client.query(objectQuery).then( function(result:any){
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
    }).catch(err=>{
      res.status(500).send('failed getting body data');
    })
}

export function handleApplicationIdPage(sessionId: string, res: express.Response, client: pg.Client){
    let objectQuery = {
        text : 'SELECT * FROM salesforce.applicant WHERE token = $1',
        values : [sessionId]
      }
      client.query(objectQuery).then( function(result:pg.QueryResult ){
        let row : salesforceSchema.applicant = result.rows[0]
        if(row === undefined){
          console.log('now row')
          res.json({data:row});
          return;
        }
        console.log(result.rows[0]);
        console.log(row);
        let identification : identificationSchema = <identificationSchema>row?.identification;
        let legalAddress : addressSchema = <addressSchema>row?.legal_address;
        let mailingAddress: addressSchema = <addressSchema>row?.mailing_address;
  
        let data : applicantId = {
          isSelfEmployed: row.is_self_employed,
          hasHSA: row.has_hsa,
          homeAndMailingAddressDifferent: row.home_and_mailing_address_different,
          firstName:row.first_name,
          lastName:row.last_name, 
          ssn: row.social_security_number, 
          email: row.email, 
          confirmEmail: row.email,
          dob: row.date_of_birth === null ? '' : row.date_of_birth.toISOString().split('T')[0],
          salutation: row.salutation,
          maritalStatus: row.marital_status,
          mothersMaidenName: row.mothers_maiden_name,
          occupation: row.occupation,
          idType: identification === null ? '' : identification.idType, 
          idNumber: identification === null ? '' : identification.idNumber,
          issuedBy: identification === null ? '' : identification.issuedBy, 
          issueDate: identification === null ? '' : identification.issueDate === null ? '' : identification.issueDate.split('T')[0],
          expirationDate: identification === null ? '' : identification.expirationDate === null ? '' : identification.expirationDate.split('T')[0],
          legalAddress: legalAddress === null ? ''  : legalAddress.address,
          legalCity: legalAddress === null ? ''  : legalAddress.city,
          legalState: legalAddress === null ? ''  : legalAddress.state,
          legalZip: legalAddress === null ? ''  : legalAddress.zip,
          mailingAddress: mailingAddress === null ? ''  : mailingAddress.address,
          mailingCity: mailingAddress === null ? ''  : mailingAddress.city,
          mailingState: mailingAddress === null ? ''  : mailingAddress.state,
          mailingZip: mailingAddress === null ? ''  : mailingAddress.zip,
          primaryPhone: row.phone,
          preferredContactMethod: row.preferred_contact_method,
          alternatePhone: row.alternate_phone,
          alternatePhoneType: row.alternate_phone_type
      };  
        console.log(data);
        ////console.log(result)
        //data.firstName = row.first_name;
        //data.lastName = row.last_name;
        ////data.dob = row.date_of_birth;
        res.json({'data': data})
      }).catch(err=>{
        res.status(500).send('failed getting apllicant data');
      })
}

export function handleBeneficiaryPage(sessionId: string, res: express.Response, client: pg.Client){
  let objectQuery = {
    text: 'SELECT * FROM salesforce.beneficiary WHERE token = $1',
    values: [sessionId]
  }

  client.query(objectQuery).then( function( result : pg.QueryResult){
    console.log(result)
  let beneficiaryList : Array<salesforceSchema.beneficiary> = result.rows;
  let returnData : beneficiaryPlaceHolder = transformBeneficiaries(beneficiaryList)
  console.log(returnData)
  res.json({data:returnData});
  }).catch(err=>{
    res.status(500).send('failed getting bene data');
  })
}

function transformBeneficiaries(beneficiaryList : Array<salesforceSchema.beneficiary>) : beneficiaryPlaceHolder{
  let returnData : any = {};
  let count = 0;
  returnData[`beneficiary_count__c`] = beneficiaryList.length,
  beneficiaryList.forEach(element => {
    let address : addressSchema = element.address as addressSchema;
    console.log(element)
    ++count;
    returnData[`beneficiary_city_${count}__c`] = address.city
    returnData[`beneficiary_dob_${count}__c`] = element.date_of_birth
    returnData[`beneficiary_email_${count}__c`] = element.email
    returnData[`beneficiary_first_name_${count}__c`]= element.first_name
    returnData[`beneficiary_last_name_${count}__c`]= element.last_name
    returnData[`beneficiary_phone_${count}__c`] = element.phone
    returnData[`beneficiary_relationship_${count}__c`] = element.relationship
    returnData[`beneficiary_share_${count}__c`] = element.share_percentage
    returnData[`beneficiary_ssn_${count}__c`] = element.social_security_number
    returnData[`beneficiary_state_${count}__c`] = address.state
    returnData[`beneficiary_street_${count}__c`] = address.address
    returnData[`beneficiary_token_${count}__c`] = element.token
    returnData[`beneficiary_type_${count}__c`] = element.beneficiary_type
    returnData[`beneficiary_zip_${count}__c`] = address.zip
  })
  //console.log(returnData);

  return returnData;
}

export function handleFeeArrangementPage(sessionId:string, res: express.Response, client: pg.Client){
  let feeArrangementQuery = {
    text: 'SELECT * FROM salesforce.fee_arrangement WHERE token = $1',
    values: [sessionId]
  }

  let bodyQuery = {
    text: 'SELECT investment_type FROM salesforce.body WHERE token = $1',
    values: [sessionId]
  }

  client.query(feeArrangementQuery).then( function( feeArrangementResult : pg.QueryResult){
    let feeArrangementData : salesforceSchema.fee_arrangement = feeArrangementResult.rows[0];
    
    client.query(bodyQuery).then( function(bodyResult:pg.QueryResult){
    let investMentType : string = bodyResult.rows[0].investment_type

    let feeArrangementForm : feeArrangementForm ={
      cc_exp_date__c: feeArrangementData.expiration_date,
      fee_schedule__c: feeArrangementData.fee_agreement,
      cc_number__c: feeArrangementData.credit_number,
      payment_method__c: feeArrangementData.payment_method,
      initial_investment_type__c: investMentType
    }
    console.log(feeArrangementForm)
    res.json({data:feeArrangementForm});
    })
  }).catch(err=>{
    res.status(500).send('failed getting bene data');
  })
}