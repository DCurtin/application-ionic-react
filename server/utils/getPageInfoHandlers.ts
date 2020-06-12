import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantIdForm, beneficiary, beneficiaryPlaceHolder, feeArrangementForm, accountNotificationsForm, transferForm} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema} from './helperSchemas'
import {transformBeneficiariesServerToClient} from '../utils/transformBeneficiaries'
import {transformTransferServerToClient} from '../utils/transformTransfers'
import express from 'express';
import pg from 'pg';

export function handleWelcomePageRequest(sessionId: string, res: express.Response, client: pg.Client)
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
    }).catch(err=>{
      res.status(500).send('failed getting body data');
    })
}

export function handleApplicationIdPage(sessionId: string, res: express.Response, client: pg.Client){
    let applicantQuery = {
        text : 'SELECT * FROM salesforce.applicant WHERE token = $1',
        values : [sessionId]
      }
      client.query(applicantQuery).then( function(applicantResult:pg.QueryResult ){
        let applicantInfo : salesforceSchema.applicant = applicantResult.rows[0]
        if(applicantInfo === undefined){
          res.json({data:applicantInfo});
          return;
        }
        let identification : identificationSchema = <identificationSchema>applicantInfo?.identification;
        let legalAddress : addressSchema = <addressSchema>applicantInfo?.legal_address;
        let mailingAddress: addressSchema = <addressSchema>applicantInfo?.mailing_address;
  
        let data : applicantIdForm = applicantInfo as applicantIdForm
        data.confirm_email = data.email;
        
        data.mailing_street = mailingAddress.address
        data.mailing_city = mailingAddress.city
        data.mailing_state = mailingAddress.state
        data.mailing_zip = mailingAddress.zip

        data.legal_street = legalAddress.address
        data.legal_city = legalAddress.city
        data.legal_state = legalAddress.state
        data.legal_zip = legalAddress.zip

        data.id_number = identification.idNumber
        data.id_type = identification.idType
        data.issue_date = identification.issueDate
        data.expiration_date = identification.expirationDate

        res.json({'data': data})
      }).catch(err=>{
        res.status(500).send('failed getting apllicant data');
      })
}

export function handleBeneficiaryPage(sessionId: string, res: express.Response, client: pg.Client){
  let beneQuery = {
    text: 'SELECT * FROM salesforce.beneficiary WHERE token = $1',
    values: [sessionId]
  }

  client.query(beneQuery).then( function( result : pg.QueryResult){
  let beneficiaryList : Array<salesforceSchema.beneficiary> = result.rows;
  let returnData : beneficiaryPlaceHolder = transformBeneficiariesServerToClient(beneficiaryList)
  res.json({data:returnData});
  }).catch(err=>{
    res.status(500).send('failed getting bene data');
  })
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
    if(feeArrangementData === undefined)
    {
      res.send('no rows');
    }

    client.query(bodyQuery).then( function(bodyResult:pg.QueryResult){
    let investMentType : string = bodyResult.rows[0]?.investment_type

    let feeArrangementForm : feeArrangementForm ={
      cc_exp_date__c: feeArrangementData.expiration_date,
      fee_schedule__c: feeArrangementData.fee_agreement,
      cc_number__c: feeArrangementData.credit_number,
      payment_method__c: feeArrangementData.payment_method,
      initial_investment_type__c: investMentType
    }
    res.json({data:feeArrangementForm});
    })
  }).catch(err=>{
    res.status(500).send('failed getting bene data');
  })
}

export function handleAccountNotificationPage(sessionId:string, res: express.Response, client: pg.Client){
  let interestedPartyQuery = {
    text: 'SELECT * FROM salesforce.interested_party WHERE token = $1',
    values: [sessionId]
  }

  client.query(interestedPartyQuery).then(function(result : pg.QueryResult){
    let interestedPartyInfo : salesforceSchema.interested_party = result.rows[0];
    let ipAddress : addressSchema = interestedPartyInfo.address as addressSchema
    let accountNotificationsForm : accountNotificationsForm = {
      interested_party_access_level__c: interestedPartyInfo.access_level,
      statement_option__c: interestedPartyInfo.statement_option,
      interested_party_street__c: ipAddress.address,
      interested_party_city__c: ipAddress.city,
      interested_party_state__c: ipAddress.state,
      interested_party_zip__c: ipAddress.zip,
      interested_party_company_name__c: interestedPartyInfo.company_name,
      interested_party_email__c: interestedPartyInfo.email,
      interested_party_email_notifications__c: interestedPartyInfo.email_notifications,
      interested_party_phone__c: interestedPartyInfo.phone,
      interested_party_first_name__c: interestedPartyInfo.first_name,
      interested_party_last_name__c: interestedPartyInfo.last_name,
      interested_party_ira_statement__c: interestedPartyInfo.ira_statement,
      interested_party_online_access__c: interestedPartyInfo.online_access,
      interested_party_title__c: interestedPartyInfo.title
    }
    res.json({data:accountNotificationsForm});
  }).catch(err=>{
    res.status(500).send('failed getting interested party data');
  })
}

export function handleTransferPage(sessionId:string, res: express.Response, client: pg.Client){
  let transferQuery = {
    text: 'SELECT * FROM salesforce.transfer WHERE token = $1',
    values: [sessionId]
  }

  let bodyQuery = {
    text: 'SELECT account_type FROM salesforce.body WHERE token = $1',
    values: [sessionId]
  }

  client.query(bodyQuery).then(function(bodyResult : pg.QueryResult){
    let accountType = bodyResult.rows[0].account_type

    client.query(transferQuery).then(function(result: pg.QueryResult){
      let transferInfo : Array<salesforceSchema.transfer> = result.rows
      let returnData = transformTransferServerToClient(transferInfo, accountType)
      res.json({data:returnData})
    })
  }).catch(err=>{
    res.status(500).send('failed getting transfer data');
  })
    
}
