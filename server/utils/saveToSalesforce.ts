import pg from 'pg'
import jsforce from 'jsforce'
import express from 'express'
import * as salesforceSchema from './postgresSchema'
import * as applicationInterfaces from '../../client/src/helpers/Utils'
import {runQueryReturnPromise, insertApplicant} from './saveStateHandlers'
import {queryParameters} from './helperSchemas';
import { createAppSession } from './appSessionHandler';

import {Online_Application__c} from './onlineAppSchema'

const { v4: uuidv4 } = require('uuid');

export function startSFOnlineApp(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>, applicantForm : applicationInterfaces.applicantIdForm, herokuToken: string, res: express.Response){
    herokuToken === undefined ? uuidv4() : herokuToken;
    console.log('found no app')

    let welcomeParamsQuery = {
        text:'SELECT * FROM salesforce.body,salesforce.validated_pages WHERE body.session_id=validated_pages.session_id AND body.session_id = $1',
        values:[sessionId]
    }

    type joinedInterface = salesforceSchema.body & salesforceSchema.validated_pages
    pgClient.query(welcomeParamsQuery).then((appBodyResult:pg.QueryResult<joinedInterface>)=>{

        let appBody = appBodyResult.rows[0];
        let validatedPages : Partial<salesforceSchema.validated_pages> = {
            is_welcome_page_valid : appBody.is_welcome_page_valid,
            is_disclosure_page_valid: appBody.is_disclosure_page_valid,
            is_owner_info_page_valid: appBody.is_owner_info_page_valid,
            is_beneficiaries_page_valid: appBody.is_beneficiaries_page_valid,
            is_fee_arrangement_page_valid: appBody.is_fee_arrangement_page_valid,
            is_account_notifications_page_valid: appBody.is_account_notifications_page_valid,
            is_transfer_ira_page_valid: appBody.is_transfer_ira_page_valid,
            is_rollover_plan_page_valid: appBody.is_rollover_plan_page_valid,
            is_investment_details_page_valid: appBody.is_investment_details_page_valid,
            is_payment_information_page_valid: appBody.is_payment_information_page_valid,
            is_new_contribution_page_valid: appBody.is_new_contribution_page_valid,
            is_review_and_sign_page_valid: appBody.is_review_and_sign_page_valid
        }

       
        
        let insertValues : Partial<Online_Application__c> = {'HerokuToken__c':herokuToken, 
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
        'Home_and_Mailing_Address_Different__c':applicantForm.home_and_mailing_address_different,
        'Mailing_Address__c': applicantForm.mailing_street,
        'Mailing_City__c':applicantForm.mailing_city,
        'Mailing_State__c':applicantForm.mailing_state,
        'Mailing_Zip__c':applicantForm.mailing_zip,
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
        'Referred_By__c':appBody.referred_by,
        'Disclosures_Viewed__c':appBody.has_read_diclosure,
        'HerokuValidatedPages__c':JSON.stringify(validatedPages)
        //still need salesRep, Referallcode if that goes here
        }

        let appQueryUpsert:queryParameters = insertApplicant(sessionId, herokuToken, applicantForm)

        serverConn.sobject("Online_Application__c").upsert(insertValues, 'HerokuToken__c').then((result:any)=>{
            serverConn.sobject("Online_Application__c").retrieve(result.id).then((queryResult: any)=>{
            runQueryReturnPromise(appQueryUpsert,pgClient).then((queryUpsertResult:pg.QueryResult)=>{
                createAppSession(queryResult['AccountNew__c'], result.id, sessionId,pgClient, {},res)
                }).catch((err:any)=>{
                console.log(err);
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
