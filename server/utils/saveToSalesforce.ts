import pg from 'pg'
import jsforce from 'jsforce'
import express from 'express'
import * as applicationInterfaces from '../../client/src/helpers/Utils'
import {runQueryReturnPromise} from './saveStateHandlers'
import {queryParameters} from './helperSchemas';
import { createAppSession } from './appSessionHandler';
const { v4: uuidv4 } = require('uuid');

export function startSFOnlineApp(sessionId: string, pgClient : pg.Client, serverConn: jsforce.Connection, applicantForm : applicationInterfaces.applicantIdForm, appQueryUpsert : queryParameters, res: express.Response){
    let welcomeParamsQuery = 'SELECT * FROM '
    
    let herokuToken = uuidv4();
        console.log('found no app')
        serverConn.sobject("Online_Application__c").create({'First_Name__c': applicantForm.first_name, 
        'Last_Name__c':applicantForm.last_name, 
        'heroku_token__c':herokuToken, 
        'IntegrationOwner__c':'0052i000000Mz0CAAS', 
        'Expiration_Date__c':'2025-10-10', 
        'Account_Type__c':'Traditional IRA', 
        'Email__c': applicantForm.email,
        'Legal_Address__c': applicantForm.legal_street,
        'legal_City__c':applicantForm.legal_city,
        'legal_State__c':applicantForm.legal_state,
        'legal_Zip__c':applicantForm.legal_zip,
        'SSN__c':applicantForm.ssn,
        'DOB__c':applicantForm.dob
        }).then((result:any)=>{
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
          console.log('failed to start session');
          res.status(500).send('failed to start session');
        });
}