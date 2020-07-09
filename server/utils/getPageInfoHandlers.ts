import {welcomePageParameters, applicantIdForm, feeArrangementForm, accountNotificationsForm, initialInvestmentConditionalParameters, rollover, transfer, contributionForm} from '../../client/src/helpers/Utils'
import * as postgresSchema from './postgresSchema'
import {transformBeneficiariesServerToClient} from '../utils/transformBeneficiaries'
import {transformTransferServerToClient} from '../utils/transformTransfers'
import {transformRolloverServerToClient} from '../utils/transformRollovers'
import {generateOnlineAppJsonFromSingleRowTables} from './saveToSalesforce'
import express from 'express';
import pg from 'pg';

export function handleWelcomePageRequest(sessionId: string, res: express.Response, client: pg.Client)
{
    let bodyQuery = {
        text : 'SELECT * FROM salesforce.body WHERE session_id = $1',
        values : [sessionId]
      }
      client.query(bodyQuery).then( function(result:pg.QueryResult){
      //get data from database
      //load into response
      let welcomePage : Partial<welcomePageParameters> = {};
      let row :postgresSchema.body = result.rows[0];
      welcomePage.account_type = row.account_type;
      welcomePage.transfer_form = row.transfer_form;
      welcomePage.rollover_form = row.rollover_form;
      welcomePage.cash_contribution_form = row.cash_contribution_form;
      welcomePage.investment_type = row.investment_type;
      welcomePage.sales_rep = row.sales_rep;
      welcomePage.referred_by = row.referred_by;
      welcomePage.referral_code = row.referral_code;
      res.json({data: welcomePage});
    }).catch(err=>{
      console.log(err)
      res.status(500).send('failed getting body data');
    })
}

export function handleApplicationIdPage(sessionId: string, res: express.Response, client: pg.Client){
    let applicantQuery = {
        text : 'SELECT * FROM salesforce.applicant WHERE session_id = $1',
        values : [sessionId]
      }
      client.query(applicantQuery).then( function(applicantResult:pg.QueryResult ){
        let applicantInfo : postgresSchema.applicant = applicantResult.rows[0]
        if(applicantInfo === undefined){
          res.json({data:applicantInfo});
          return;
        }
 
        let data : applicantIdForm = applicantInfo as applicantIdForm ; 
        res.json({'data': data})
      }).catch(err=>{
        console.log(err);
        res.status(500).send('failed getting apllicant data');
      })
}

export function handleBeneficiaryPage(sessionId: string, res: express.Response, client: pg.Client){
  //generateOnlineAppJsonFromSingleRowTables(sessionId, client); WIP this is just for testing purposes
  let beneQuery = {
    text: 'SELECT * FROM salesforce.beneficiary WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(beneQuery).then( function( result : pg.QueryResult){
  let beneficiaryList : Array<postgresSchema.beneficiary> = result.rows;
  let returnData = transformBeneficiariesServerToClient(beneficiaryList)
  res.json({data:returnData});
  }).catch(err=>{
    res.status(500).send('failed getting bene data');
  })
}

export function handleFeeArrangementPage(sessionId:string, res: express.Response, client: pg.Client){
  
  
  let feeArrangementQuery = {
    text: 'SELECT * FROM salesforce.fee_arrangement WHERE session_id = $1',
    values: [sessionId]
  }

  let bodyQuery = {
    text: 'SELECT investment_type FROM salesforce.body WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(feeArrangementQuery).then( function( feeArrangementResult : pg.QueryResult){
    let feeArrangementData : postgresSchema.fee_arrangement = feeArrangementResult.rows[0];
    if(feeArrangementData === undefined)
    {
      res.status(500).send('no rows')
      return
    }

    client.query(bodyQuery).then( function(bodyResult:pg.QueryResult){
      let investMentType : string = bodyResult.rows[0]?.investment_type

      let feeArrangementForm : feeArrangementForm = {...feeArrangementData, initial_investment_type: investMentType};
      console.log(feeArrangementForm)
      res.json({data:feeArrangementForm});
      }).catch(err=>{
        res.status(500).send('failed getting body data');
      })
  }).catch(err=>{
    res.status(500).send('failed getting fee arangement data');
  })
}

export function handleAccountNotificationPage(sessionId:string, res: express.Response, client: pg.Client){
  let interestedPartyQuery = {
    text: 'SELECT * FROM salesforce.interested_party WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(interestedPartyQuery).then(function(result : pg.QueryResult){
    let interestedPartyInfo : postgresSchema.interested_party = result.rows[0];
    let accountNotificationsForm : accountNotificationsForm = interestedPartyInfo;
    res.json({data:accountNotificationsForm});
  }).catch(err=>{
    res.status(500).send('failed getting interested party data');
  })
}

export function getAllCustodians(res: express.Response, client: pg.Client, sessionId: string) {
  if (sessionId && sessionId !== '') {
    let custodiansQuery = {
      text: 'SELECT * FROM salesforce.custodians'
    }
  
    client.query(custodiansQuery).then(function(result: pg.QueryResult) {
      let custodiansInfo : Array<postgresSchema.custodians> = result.rows;
      res.json({data: custodiansInfo})
  
    }).catch(err => {
      res.status(500).send('failed getting custodians data');
    })
  } else {
    res.status(500).send('failed getting custodians data');
  }

}

export function handleTransferPage(sessionId:string, res: express.Response, client: pg.Client){
  let transferQuery = {
    text: 'SELECT * FROM salesforce.transfer WHERE session_id = $1',
    values: [sessionId]
  }

  let bodyQuery = {
    text: 'SELECT account_type FROM salesforce.body WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(bodyQuery).then(function(bodyResult : pg.QueryResult){
    let accountType = bodyResult.rows[0].account_type;

    client.query(transferQuery).then(function(result: pg.QueryResult){
      let transferInfo : Array<postgresSchema.transfer> = result.rows
      let returnData = transformTransferServerToClient(transferInfo, accountType)
      res.json({data:returnData})
    })
  }).catch(err=>{
    res.status(500).send('failed getting transfer data');
  })
    
}

export function handleContributionPage(sessionId: string, res: express.Response, client: pg.Client){
  let contributionQuery = {
    text: 'SELECT * FROM salesforce.contribution WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(contributionQuery).then(function(result: pg.QueryResult){
    let contributionInfo : postgresSchema.contribution = result.rows[0];
    res.json({data : contributionInfo});
  })
}

export function handleRolloverPage(sessionId: string, res: express.Response, client: pg.Client){
  let rolloverQuery = {
    text: 'SELECT * FROM salesforce.rollover WHERE session_id = $1',
    values: [sessionId]
  }

  client.query(rolloverQuery).then(function(result: pg.QueryResult){
    let rolloverInfo : Array<postgresSchema.rollover> = result.rows;
    let returnData = transformRolloverServerToClient(rolloverInfo, 'Traditional IRA')
    res.json({data : returnData});
  })
}

export function handleInitialInvestmentPage(sessionId: string, res: express.Response, client: pg.Client){
  let initialInvestmentQuery = {
    text: 'SELECT * FROM salesforce.initial_investment WHERE session_id = $1',
    values: [sessionId]
  }
  let rolloverQuery = {
    text: 'SELECT * FROM salesforce.rollover WHERE session_id = $1',
    values: [sessionId]
  }
  let transferQuery = {
    text: 'SELECT * FROM salesforce.transfer WHERE session_id = $1 AND transfer_type= $2',
    values: [sessionId, 'cash Transfer']
  }
  let contributionQuery = {
    text: 'SELECT * FROM salesforce.contribution WHERE session_id = $1',
    values: [sessionId]
  }

  
  //need to get other info

  client.query(initialInvestmentQuery).then(function(result: pg.QueryResult){
    if(result.rowCount == 0){
      res.json({data : {formData: undefined, parameters : undefined}})
    }

    client.query(rolloverQuery).then((rolloverResult:pg.QueryResult)=>{
      client.query(transferQuery).then((transferResult:pg.QueryResult)=>{
        client.query(contributionQuery).then((contributionResult:pg.QueryResult)=>{
          let initialInvestmentInfo : postgresSchema.initial_investment = result.rows[0];
          res.json({data : {formData: initialInvestmentInfo, parameters : gatherInitialInvestmentParameters(rolloverResult, transferResult, contributionResult) }});
        })
      })
    })
  })
}

function gatherInitialInvestmentParameters(rolloverResult:pg.QueryResult, transferResult:pg.QueryResult, contributionResult:pg.QueryResult){
  let initialInvestmentParams : Partial<initialInvestmentConditionalParameters> = {}
  if(rolloverResult.rowCount > 0){
    let rollovers : Array<rollover> = rolloverResult.rows;
    initialInvestmentParams.existing_employer_plan_rollover = true;
    initialInvestmentParams.employer_cash_amount_1 = rollovers[0].cash_amount;
    initialInvestmentParams.employer_cash_amount_2 = rollovers[1]?.cash_amount;
  }

  if(transferResult.rowCount > 0){
    let transfers : Array<transfer> = transferResult.rows
    initialInvestmentParams.existing_ira_transfer = true
    initialInvestmentParams.ira_full_or_partial_cash_transfer_1 = transfers[0].full_or_partial_cash_transfer
    initialInvestmentParams.ira_full_or_partial_cash_transfer_2 = transfers[1]?.full_or_partial_cash_transfer
    
    initialInvestmentParams.transfer_type_1 = transfers[0].transfer_type;
    initialInvestmentParams.transfer_type_2 = transfers[1]?.transfer_type;
    
    initialInvestmentParams.ira_cash_amount_1 = transfers[0].cash_amount;
    initialInvestmentParams.ira_cash_amount_2 = transfers[1]?.cash_amount;
  }

  if(contributionResult.rowCount > 0)
  {
    let contribution : contributionForm = contributionResult.rows[0]
    initialInvestmentParams.new_ira_contribution = true;
    initialInvestmentParams.new_contribution_amount = contribution.new_contribution_amount
  }

  return initialInvestmentParams
}