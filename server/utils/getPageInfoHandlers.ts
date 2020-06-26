import {welcomePageParameters, applicantIdForm, feeArrangementForm, accountNotificationsForm} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {transformBeneficiariesServerToClient} from '../utils/transformBeneficiaries'
import {transformTransferServerToClient} from '../utils/transformTransfers'
import {transformRolloverServerToClient} from '../utils/transformRollovers'
import express from 'express';
import pg from 'pg';

export function handleWelcomePageRequest(sessionId: string, res: express.Response, client: pg.Client)
{
    let bodyQuery = {
        text : 'SELECT * FROM salesforce.body WHERE token = $1',
        values : [sessionId]
      }
      client.query(bodyQuery).then( function(result: pg.QueryResult<salesforceSchema.body>){
      //get data from database
      //load into response
      let welcomePage : Partial<welcomePageParameters> = {};
      let rows = result.rows[0];
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
      console.log(err)
      res.status(500).send('failed getting body data');
    })
}

export function handleApplicationIdPage(sessionId: string, res: express.Response, client: pg.Client){
    let applicantQuery = {
        text : 'SELECT * FROM salesforce.applicant WHERE token = $1',
        values : [sessionId]
      }
      console.log(sessionId);
      client.query(applicantQuery).then( function(applicantResult:pg.QueryResult ){
        let applicantInfo : salesforceSchema.applicant = applicantResult.rows[0]
        if(applicantInfo === undefined){
          console.log('hello does it hit here? ');
          res.json({data:applicantInfo});
          return;
        }
 
        let data : applicantIdForm = applicantInfo as applicantIdForm ; 
        console.log(data);      
        res.json({'data': data})
      }).catch(err=>{
        console.log(err);
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

export function handleContributionPage(sessionId: string, res: express.Response, client: pg.Client){
  let contributionQuery = {
    text: 'SELECT * FROM salesforce.contribution WHERE token = $1',
    values: [sessionId]
  }

  client.query(contributionQuery).then(function(result: pg.QueryResult){
    let contributionInfo : salesforceSchema.contribution = result.rows[0];
    res.json({data : contributionInfo});
  })
}

export function handleRolloverPage(sessionId: string, res: express.Response, client: pg.Client){
  let rolloverQuery = {
    text: 'SELECT * FROM salesforce.rollover WHERE token = $1',
    values: [sessionId]
  }

  client.query(rolloverQuery).then(function(result: pg.QueryResult){
    let rolloverInfo : Array<salesforceSchema.rollover> = result.rows;
    let returnData = transformRolloverServerToClient(rolloverInfo, 'Traditional IRA')
    res.json({data : returnData});
  })
}