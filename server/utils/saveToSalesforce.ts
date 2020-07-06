import pg from 'pg'
import jsforce from 'jsforce'
import * as postgresSchema from './postgresSchema'
import * as applicationInterfaces from '../../client/src/helpers/Utils'

import {Online_Application__c} from './onlineAppSchema'

const { v4: uuidv4 } = require('uuid');

export function startSFOnlineApp(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>, applicantForm : applicationInterfaces.applicantIdForm):Promise<any>{
    let newHerokuToken = uuidv4();
    return saveFirstStageToSalesforce(sessionId, pgClient, serverConn, applicantForm, newHerokuToken)
}

export function saveFirstStageToSalesforce(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>, applicantForm : applicationInterfaces.applicantIdForm, herokuToken: string): Promise<Partial<postgresSchema.application_session>>{
    let welcomeParamsQuery = {
        text:'SELECT * FROM salesforce.body,salesforce.validated_pages WHERE body.session_id=validated_pages.session_id AND body.session_id = $1',
        values:[sessionId]
    }

    type joinedInterface = postgresSchema.body & postgresSchema.validated_pages
    return pgClient.query(welcomeParamsQuery).then((appBodyResult:pg.QueryResult<joinedInterface>)=>{

        let appBody = appBodyResult.rows[0];
        let validatedPages : Partial<postgresSchema.validated_pages> = {
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
        'HerokuValidatedPages__c':JSON.stringify(validatedPages),
        'Id':undefined
        //still need salesRep, Referallcode if that goes here
        }

        
        return upsertSFOnlineApp(sessionId, serverConn, insertValues, herokuToken);

        /*
        if(appSessionParams === null){
                return null
            }
            let appQueryUpsert:queryParameters = insertApplicant(sessionId, herokuToken, applicantForm)
            return runQueryReturnPromise(appQueryUpsert,pgClient).then(()=>{
                return appSessionParams;
            })
         */


        /*return serverConn.sobject("Online_Application__c").upsert(insertValues, 'HerokuToken__c').then((onlineAppUpsertResult: any)=>{
            console.log('asset result: ')
            console.log(onlineAppUpsertResult)
            let options :jsforce.ExecuteOptions ={}
            type FoundOnlineApp = {Id?:string}[] & Online_Application__c
            return serverConn.sobject("Online_Application__c").findOne({HerokuToken__c:herokuToken}, ['Id','AccountNew__c','HerokuToken__c']).execute(options,(err, onlineAppQueryResult:FoundOnlineApp)=>{
                return runQueryReturnPromise(appQueryUpsert,pgClient).then(()=>{
                    let appSessionParams : Partial<postgresSchema.application_session> = {
                        account_number: onlineAppQueryResult.AccountNew__c,
                        application_id: onlineAppQueryResult.Id,
                        heroku_token: onlineAppQueryResult.HerokuToken__c,
                        session_id: sessionId
                    } 
                    return appSessionParams
                    }).catch((err)=>{
                        console.log(err);
                        console.log('could not upsert app')
                        return null;
                    });  
                })
        }).catch((err)=>{
            console.log(err)
            console.log('failed to upser to salesforce');
            return null;
        });*/
    })
}

export function upsertSFOnlineApp(sessionId: string, serverConn: Partial<jsforce.Connection>, onlineApp : Partial<Online_Application__c>, herokuToken: string): Promise<Partial<postgresSchema.application_session>>{   
        return serverConn.sobject("Online_Application__c").upsert(onlineApp, 'HerokuToken__c').then((onlineAppUpsertResult: any)=>{
            console.log('result: ')
            console.log(onlineAppUpsertResult)
            let options :jsforce.ExecuteOptions ={}
            type FoundOnlineApp = {Id?:string}[] & Online_Application__c
            return serverConn.sobject("Online_Application__c").findOne({HerokuToken__c:herokuToken}, ['Id','AccountNew__c','HerokuToken__c']).execute(options,(err, onlineAppQueryResult:FoundOnlineApp)=>{
                if(err){
                    console.log('failed to query upserted app');
                    console.log(err);
                }
                let appSessionParams : Partial<postgresSchema.application_session> = {
                    account_number: onlineAppQueryResult.AccountNew__c,
                    application_id: onlineAppQueryResult.Id,
                    heroku_token: onlineAppQueryResult.HerokuToken__c,
                    session_id: sessionId
                } 
                return appSessionParams
            })
        }).catch((err)=>{
            console.log(err)
            console.log('failed to upsert to salesforce');
            return null;
        });
}

