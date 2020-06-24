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
        let insertValues = {'heroku_token__c':herokuToken, 
        'IntegrationOwner__c':'0052i000000Mz0CAAS',
        'Salutation__c':applicantForm.salutation,//applicant fields start here
        'First_Name__c': applicantForm.first_name,
        'Last_Name__c':applicantForm.last_name, 
        'SSN__c':applicantForm.ssn,
        'DOB__c':applicantForm.dob,
        'Marital_Status__c':applicantForm.marital_status,
        'Mother_s_Maiden_Name__c':applicantForm.mothers_maiden_name,
        'Occupation__c':applicantForm.occupation,
        'IsSelfEmployed__c':applicantForm.is_self_employed,
        'HasHSA__c':applicantForm.has_hsa,
        'ID_Type__c': applicantForm.id_type,
        'ID_Number__c':applicantForm.id_number,
        'Issued_By__c':applicantForm.id_issued_by,
        'Issue_Date__c':applicantForm.id_issued_date,
        'Expiration_Date__c':applicantForm.id_expiration_date, 
        'Legal_Address__c': applicantForm.legal_street,
        'Legal_City__c':applicantForm.legal_city,
        'Legal_State__c':applicantForm.legal_state,
        'Legal_Zip__c':applicantForm.legal_zip,
        'Mailin_Address__c': applicantForm.mailing_street,
        'Mailin_City__c':applicantForm.mailing_city,
        'Mailin_State__c':applicantForm.mailing_state,
        'Mailin_Zip__c':applicantForm.mailing_zip,
        'Primary_Phone__c':applicantForm.primary_phone,
        'Preferred_Contact_Method__c':applicantForm.preferred_contact_method,
        'Email__c': applicantForm.email,
        'Alternate_Phone__c':applicantForm.alternate_phone,
        'Alternate_Phone_Type__c':applicantForm.alternate_phone_type,
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