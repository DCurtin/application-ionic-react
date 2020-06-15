import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantIdForm, beneficiary, feeArrangementForm, accountNotificationsForm, transferForm} from '../../client/src/helpers/Utils'
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
 
        let data : applicantIdForm = applicantInfo as applicantIdForm        
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
  let returnData = transformBeneficiariesServerToClient(beneficiaryList)
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
      return
    }

    client.query(bodyQuery).then( function(bodyResult:pg.QueryResult){
    let investMentType : string = bodyResult.rows[0]?.investment_type

    let feeArrangementForm : feeArrangementForm = {...feeArrangementData, initial_investment_type: investMentType};
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
    let accountNotificationsForm : accountNotificationsForm = interestedPartyInfo;
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
