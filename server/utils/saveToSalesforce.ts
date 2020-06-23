import pg from 'pg'
import jsforce from 'jsforce'
import express from 'express'
import * as salesforceSchema from './salesforce'
import * as applicationInterfaces from '../../client/src/helpers/Utils'
import {runQueryReturnPromise} from './saveStateHandlers'
import {queryParameters} from './helperSchemas';
import { createAppSession } from './appSessionHandler';
const { v4: uuidv4 } = require('uuid');

export function startSFOnlineApp(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>, applicantForm : applicationInterfaces.applicantIdForm, appQueryUpsert : queryParameters, res: express.Response){
    let welcomeParamsQuery = {
        text:'SELECT * FROM salesforce.body WHERE session_id = $1', 
        values:[sessionId]
    }

    pgClient.query(welcomeParamsQuery).then((appBodyResult:pg.QueryResult<salesforceSchema.body>)=>{
        let appBody = appBodyResult.rows[0];
        let herokuToken = uuidv4();
        console.log('found no app')
        let insertValues = {'First_Name__c': applicantForm.first_name, 
        'heroku_token__c':herokuToken, 
        'IntegrationOwner__c':'0052i000000Mz0CAAS',
        'Last_Name__c':applicantForm.last_name, //applicant fields start here
        'Expiration_Date__c':applicantForm.id_expiration_date, 
        'Email__c': applicantForm.email,
        'Legal_Address__c': applicantForm.legal_street,
        'legal_City__c':applicantForm.legal_city,
        'legal_State__c':applicantForm.legal_state,
        'legal_Zip__c':applicantForm.legal_zip,
        'SSN__c':applicantForm.ssn,
        'DOB__c':applicantForm.dob,
        'Account_Type__c':appBody.account_type, //welcome page fields start here
        'Existing_IRA_Transfer__c':appBody.transfer_form,
        'Existing_Employer_Plan_Rollover__c':appBody.rollover_form,
        'New_IRA_Contribution__c':appBody.cash_contribution_form,
        'Initial_Investment_Type__c':appBody.investment_type,
        'Referred_By__c':appBody.referred_by
        //still need salesRep, Referallcode if that goes here
        }
        console.log(insertValues)
        serverConn.sobject("Online_Application__c").create(insertValues).then((result:any)=>{
        console.log(' getting fields')
            serverConn.sobject("Online_Application__c").retrieve(result.id).then((queryResult: any)=>{
            //console.log(queryResult);
            console.log(queryResult['First_Name__c']);
            console.log(queryResult['AccountNew__c']);
            console.log(queryResult['SSN__c'])
            runQueryReturnPromise(appQueryUpsert,pgClient).then((queryUpsertResult:pg.QueryResult)=>{
                createAppSession(queryResult['AccountNew__c'], result.id, sessionId,pgClient, {},res)
                }).catch((err:any)=>{
                console.log('could not upsert app')
                res.status(500).send('failed inserting app')
                });

            })
        }).catch(err=>{
            console.log(err)
            console.log('failed to start session');
            res.status(500).send('failed to start session');
        });
    })
}