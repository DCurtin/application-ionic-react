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
type joinedInterface = postgresSchema.body & postgresSchema.validated_pages
export function saveFirstStageToSalesforce(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>, applicantForm : applicationInterfaces.applicantIdForm, herokuToken: string): Promise<Partial<postgresSchema.application_session>>{
    let welcomeParamsQuery = {
        text:'SELECT * FROM salesforce.body FULL OUTER JOIN salesforce.validated_pages ON (body.session_id=validated_pages.session_id) WHERE body.session_id = $1',
        values:[sessionId]
    }

    
    return pgClient.query(welcomeParamsQuery).then((appBodyResult:pg.QueryResult<joinedInterface>)=>{
        console.log(appBodyResult)
        let appBody = appBodyResult.rows[0];
        let validatedPages = getValidatedPages(appBody)
        
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
        'IsSelfEmployed__c':applicantForm.is_self_employed ? true: false,
        'HasHSA__c':applicantForm.has_hsa ? true: false,
        'ID_Type__c': applicantForm.id_type,
        'ID_Number__c':applicantForm.id_number,
        'Issued_By__c':applicantForm.id_issued_by,
        'Issue_Date__c':applicantForm.id_issued_date,
        'Expiration_Date__c':applicantForm.id_expiration_date, 
        'Legal_Address__c': applicantForm.legal_street,
        'Legal_City__c':applicantForm.legal_city,
        'Legal_State__c':applicantForm.legal_state,
        'Legal_Zip__c':applicantForm.legal_zip,
        'Home_and_Mailing_Address_Different__c':applicantForm.home_and_mailing_address_different ? true: false,
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
        'Existing_IRA_Transfer__c':appBody.transfer_form ? true: false,
        'Existing_Employer_Plan_Rollover__c':appBody.rollover_form ? true: false,
        'New_IRA_Contribution__c':appBody.cash_contribution_form ? true: false,
        'Initial_Investment_Type__c':appBody.investment_type,
        'Referred_By__c':appBody.referred_by,
        'Disclosures_Viewed__c':appBody.has_read_diclosure ? true: false,
        'HerokuValidatedPages__c':JSON.stringify(validatedPages)
        //still need salesRep, Referallcode if that goes here
        }

        
        return upsertSFOnlineApp(serverConn, insertValues).then((value:postgresSchema.application_session)=>{
            if(value !== null){
                value.session_id=sessionId
            }
            return value;
        })
    })
}
function getValidatedPages(appBody:Partial<joinedInterface>){
    console.log(appBody)
    if(!appBody){
        return {}
    }
    
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
    return validatedPages
}

export function upsertSFOnlineApp(serverConn: Partial<jsforce.Connection>, onlineApp : Partial<Online_Application__c>): Promise<Partial<postgresSchema.application_session>>{   
        return serverConn.sobject("Online_Application__c").upsert(onlineApp, 'HerokuToken__c').then((onlineAppUpsertResult: any)=>{
            console.log('result: ')
            console.log(onlineAppUpsertResult)
            let options :jsforce.ExecuteOptions ={}
            type FoundOnlineApp = {Id?:string}[] & Online_Application__c
            return serverConn.sobject("Online_Application__c").findOne({HerokuToken__c:onlineApp.HerokuToken__c}, ['Id','AccountNew__c','HerokuToken__c']).execute(options,(err, onlineAppQueryResult:FoundOnlineApp)=>{
                if(err){
                    console.log('failed to query upserted app');
                    console.log(err);
                    return null;
                }
                let appSessionParams : Partial<postgresSchema.application_session> = {
                    account_number: onlineAppQueryResult.AccountNew__c,
                    application_id: onlineAppQueryResult.Id,
                    heroku_token: onlineAppQueryResult.HerokuToken__c,
                } 
                return appSessionParams
            })
        }).catch((err)=>{
            console.log(err)
            console.log('failed to upsert to salesforce');
            return null;
        });
}
type singleRowFields = {'validated_pages':postgresSchema.validated_pages,
    'body':postgresSchema.body,
    'applicant':postgresSchema.applicant,
    'contribution':postgresSchema.contribution,
    'fee_arrangement':postgresSchema.fee_arrangement,
    'initial_investment':postgresSchema.initial_investment,
    'interested_party':postgresSchema.interested_party,
    'payment':postgresSchema.payment}

type multiRowTableQueryParams = Array<{tableName: string,table:{text: string, values:Array<any>}}>

type multiRowTableNameToRows = {'transfer':Array<postgresSchema.transfer>,
        'rollover':Array<postgresSchema.rollover>,
        'beneficiary':Array<postgresSchema.beneficiary>,
    }

export function saveCurrentStateOfApplication(sessionId: string, pgClient : pg.Client, serverConn: Partial<jsforce.Connection>){
    return generateOnlineAppJsonFromSingleRowTables(sessionId, pgClient).then((singleRowTableResults)=>{
        return queryMultiRowTables(sessionId, pgClient).then((multiRowResults)=>{
            let onlineApp:Partial<Online_Application__c> = generateOnlineAppJson(singleRowTableResults, multiRowResults);
            return upsertSFOnlineApp(serverConn,onlineApp)
            //return onlineApp
        })
    })
}

function generateOnlineAppJson(singleRowTableResults:singleRowFields, multiRowTableResults: multiRowTableNameToRows){
    let validatedPages = getValidatedPages(singleRowTableResults?.validated_pages);
    let sfOnlineApp:Partial<Online_Application__c> ={
        'HerokuValidatedPages__c':JSON.stringify(validatedPages),
        
        //applicant
        'HerokuToken__c': singleRowTableResults.applicant.heroku_token,
        'IntegrationOwner__c':'0052i000000Mz0CAAS',
        'Salutation__c':singleRowTableResults.applicant?.salutation,
        'First_Name__c': singleRowTableResults.applicant?.first_name,
        'Last_Name__c':singleRowTableResults.applicant?.last_name,
        'SSN__c':singleRowTableResults.applicant?.ssn,
        'DOB__c':singleRowTableResults.applicant?.dob,
        'Marital_Status__c':singleRowTableResults.applicant?.marital_status,
        'Mother_s_Maiden_Name__c':singleRowTableResults.applicant?.mothers_maiden_name,
        'Occupation__c':singleRowTableResults.applicant?.occupation,
        'IsSelfEmployed__c':singleRowTableResults.applicant.is_self_employed ? true: false,
        'HasHSA__c':singleRowTableResults.applicant.has_hsa ? true: false,
        'ID_Type__c': singleRowTableResults.applicant?.id_type,
        'ID_Number__c':singleRowTableResults.applicant?.id_number,
        'Issued_By__c':singleRowTableResults.applicant?.id_issued_by,
        'Issue_Date__c':singleRowTableResults.applicant?.id_issued_date,
        'Expiration_Date__c':singleRowTableResults.applicant?.id_expiration_date,
        'Legal_Address__c': singleRowTableResults.applicant?.legal_street,
        'Legal_City__c':singleRowTableResults.applicant?.legal_city,
        'Legal_State__c':singleRowTableResults.applicant?.legal_state,
        'Legal_Zip__c':singleRowTableResults.applicant?.legal_zip,
        'Home_and_Mailing_Address_Different__c':singleRowTableResults.applicant?.home_and_mailing_address_different ? true: false,
        'Mailing_Address__c': singleRowTableResults.applicant?.mailing_street,
        'Mailing_City__c':singleRowTableResults.applicant?.mailing_city,
        'Mailing_State__c':singleRowTableResults.applicant?.mailing_state,
        'Mailing_Zip__c':singleRowTableResults.applicant?.mailing_zip,
        'Primary_Phone__c':singleRowTableResults.applicant?.primary_phone,
        'Preferred_Contact_Method__c':singleRowTableResults.applicant?.preferred_contact_method,
        'Email__c': singleRowTableResults.applicant?.email,
        'Alternate_Phone__c':singleRowTableResults.applicant?.alternate_phone,
        'Alternate_Phone_Type__c':singleRowTableResults.applicant?.alternate_phone_type,
        
        //body
        'Account_Type__c':singleRowTableResults.body?.account_type, //welcome page fields start here
        'Existing_IRA_Transfer__c':singleRowTableResults.body?.transfer_form ? true: false,
        'Existing_Employer_Plan_Rollover__c':singleRowTableResults.body?.rollover_form ? true: false,
        'New_IRA_Contribution__c':singleRowTableResults.body?.cash_contribution_form ? true: false,
        'Initial_Investment_Type__c':singleRowTableResults.body?.investment_type,
        'Referred_By__c':singleRowTableResults.body?.referred_by,
        'Disclosures_Viewed__c':singleRowTableResults.body?.has_read_diclosure ? true: false,
        
        //contribution
        'New_Contribution_Amount__c':singleRowTableResults.contribution?.new_contribution_amount,
        'Tax_Year__c': singleRowTableResults.contribution?.tax_year,
        'Account_Number__c':singleRowTableResults.contribution?.account_number,
        'Bank_Name__c':singleRowTableResults.contribution?.bank_name,
        'Routing_Number__c':singleRowTableResults.contribution?.routing_number,
        'Account_Name__c':singleRowTableResults.contribution?.name_on_account,
        //'Account_Type__c':singleRowTableResults.contribution.account_type,//may need to get this from body
        
        //fee arangement
        'Fee_Schedule__c':singleRowTableResults.fee_arrangement?.fee_schedule,
        'Payment_Method__c':singleRowTableResults.fee_arrangement?.payment_method,
        'CC_Number__c':singleRowTableResults.fee_arrangement?.cc_number,
        'CC_Exp_Date__c':singleRowTableResults.fee_arrangement?.cc_exp_date,

        //initial investment
        //'Initial_Investment_Type__c':singleRowTableResults.initial_investment.initial_investment_type,//may need to get this from body
        'Initial_Investment_Name__c':singleRowTableResults.initial_investment?.initial_investment_name,
        'Investment_Amount__c': singleRowTableResults.initial_investment?.investment_amount,
        'Investment_Contact_Person__c': singleRowTableResults.initial_investment?.investment_contact_person,
        'Investment_Contact_Person_Phone__c': singleRowTableResults.initial_investment?.investment_contact_person_phone,

        //interested party
        'Statement_Option__c': singleRowTableResults.interested_party?.ira_statement_option,
        'Interested_Party_First_Name__c':singleRowTableResults.interested_party?.first_name,
        'Interested_Party_Last_Name__c':singleRowTableResults.interested_party?.last_name,
        'Interested_Party_Phone__c':singleRowTableResults.interested_party?.phone,
        'Interested_Party_Email__c':singleRowTableResults.interested_party?.email,
        'Interested_Party_Street__c':singleRowTableResults.interested_party?.mailing_street,
        'Interested_Party_City__c':singleRowTableResults.interested_party?.mailing_city,
        'Interested_Party_State__c':singleRowTableResults.interested_party?.mailing_state,
        'Interested_Party_Zip__c':singleRowTableResults.interested_party?.mailing_zip,
        'Interested_Party_Company_Name__c':singleRowTableResults.interested_party?.company_name,
        'Interested_Party_Title__c':singleRowTableResults.interested_party?.title,
        'Interested_Party_Online_Access__c':singleRowTableResults.interested_party?.online_access ? true: false,
        'Interested_Party_IRA_Statement__c':singleRowTableResults.interested_party?.statement_option,

        'Existing_IRA_Transfers__c':multiRowTableResults.transfer?.length ? multiRowTableResults.transfer?.length : 0,
        //transfer1
        'IRA_Account_Number_1__c':multiRowTableResults.transfer[0]?.account_number,
        'IRA_Account_Type_1__c':multiRowTableResults.transfer[0]?.account_type,
        'IRA_Full_or_Partial_Cash_Transfer_1__c':multiRowTableResults.transfer[0]?.full_or_partial_cash_transfer,
        'IRA_Cash_Amount_1__c':multiRowTableResults.transfer[0]?.cash_amount,
        'IRA_Institution_Name_1__c':multiRowTableResults.transfer[0]?.institution_name,
        'TransferType1__c':multiRowTableResults.transfer[0]?.transfer_type,
        'IRA_Street_1__c':multiRowTableResults.transfer[0]?.mailing_street,
        'IRA_City_1__c':multiRowTableResults.transfer[0]?.mailing_city,
        'IRA_State_1__c':multiRowTableResults.transfer[0]?.mailing_state,
        'IRA_Zip_1__c':multiRowTableResults.transfer[0]?.mailing_zip,
        'IRA_Contact_Name_1__c':multiRowTableResults.transfer[0]?.contact_name,
        'IRA_Contact_Phone_Number_1__c':multiRowTableResults.transfer[0]?.contact_phone_number,
        'Delivery_Method__c':multiRowTableResults.transfer[0]?.delivery_method,
        //transfer2
        'IRA_Account_Number_2__c':multiRowTableResults.transfer[1]?.account_number,
        'IRA_Account_Type_2__c':multiRowTableResults.transfer[1]?.account_type,
        'IRA_Full_or_Partial_Cash_Transfer_2__c':multiRowTableResults.transfer[1]?.full_or_partial_cash_transfer,
        'IRA_Cash_Amount_2__c':multiRowTableResults.transfer[1]?.cash_amount,
        'IRA_Institution_Name_2__c':multiRowTableResults.transfer[1]?.institution_name,
        'TransferType2__c':multiRowTableResults.transfer[1]?.transfer_type,
        'IRA_Street_2__c':multiRowTableResults.transfer[1]?.mailing_street,
        'IRA_City_2__c':multiRowTableResults.transfer[1]?.mailing_city,
        'IRA_State_2__c':multiRowTableResults.transfer[1]?.mailing_state,
        'IRA_Zip_2__c':multiRowTableResults.transfer[1]?.mailing_zip,
        'IRA_Contact_Name_2__c':multiRowTableResults.transfer[1]?.contact_name,
        'IRA_Contact_Phone_Number_2__c':multiRowTableResults.transfer[1]?.contact_phone_number,
        'Delivery_Method_2__c':multiRowTableResults.transfer[1]?.delivery_method,

        'Existing_Employer_Plan_Roll_Overs__c':multiRowTableResults.rollover?.length ? multiRowTableResults.rollover?.length : 0,
        //rollover 1
        'Employer_Institution_Name_1__c':multiRowTableResults.rollover[0]?.institution_name,
        'Employer_Rollover_Street_1__c':multiRowTableResults.rollover[0]?.mailing_street,
        'Employer_Rollover_City_1__c':multiRowTableResults.rollover[0]?.mailing_city,
        'Employer_Rollover_State_1__c':multiRowTableResults.rollover[0]?.mailing_state,
        'Employer_Rollover_Zip_1__c':multiRowTableResults.rollover[0]?.mailing_zip,
        'Employer_Account_Type_1__c':multiRowTableResults.rollover[0]?.account_type,
        'Employer_Account_Number_1__c':multiRowTableResults.rollover[0]?.account_number,
        'Employer_Rollover_Type_1__c':multiRowTableResults.rollover[0]?.rollover_type,
        'Employer_Cash_Amount_1__c':multiRowTableResults.rollover[0]?.cash_amount,
        'Employer_Contact_Name_1__c':multiRowTableResults.rollover[0]?.name,
        'Employer_Contact_Phone_1__c':multiRowTableResults.rollover[0]?.phone,
        //rollover 2
        'Employer_Institution_Name_2__c':multiRowTableResults.rollover[1]?.institution_name,
        'Employer_Rollover_Street_2__c':multiRowTableResults.rollover[1]?.mailing_street,
        'Employer_Rollover_City_2__c':multiRowTableResults.rollover[1]?.mailing_city,
        'Employer_Rollover_State_2__c':multiRowTableResults.rollover[1]?.mailing_state,
        'Employer_Rollover_Zip_2__c':multiRowTableResults.rollover[1]?.mailing_zip,
        'Employer_Account_Type_2__c':multiRowTableResults.rollover[1]?.account_type,
        'Employer_Account_Number_2__c':multiRowTableResults.rollover[1]?.account_number,
        'Employer_Rollover_Type_2__c':multiRowTableResults.rollover[1]?.rollover_type,
        'Employer_Cash_Amount_2__c':multiRowTableResults.rollover[1]?.cash_amount,
        'Employer_Contact_Name_2__c':multiRowTableResults.rollover[1]?.name,
        'Employer_Contact_Phone_2__c':multiRowTableResults.rollover[1]?.phone,

        'Beneficiary_Count__c':multiRowTableResults.beneficiary?.length ? multiRowTableResults.beneficiary?.length : 0,
        //'Beneficiary_Provided__c':multiRowTableResults.beneficiary?.length ? true: false,
        //beneficiary 1
        'Beneficiary_First_Name_1__c':multiRowTableResults.beneficiary[0]?.first_name,
        'Beneficiary_Last_Name_1__c':multiRowTableResults.beneficiary[0]?.last_name,
        'Beneficiary_Street_1__c':multiRowTableResults.beneficiary[0]?.mailing_street,
        'Beneficiary_City_1__c':multiRowTableResults.beneficiary[0]?.mailing_city,
        'Beneficiary_State_1__c':multiRowTableResults.beneficiary[0]?.mailing_state,
        'Beneficiary_Zip_1__c':multiRowTableResults.beneficiary[0]?.mailing_zip,
        'Beneficiary_Phone_1__c':multiRowTableResults.beneficiary[0]?.phone,
        'Beneficiary_Email_1__c':multiRowTableResults.beneficiary[0]?.email,
        'Beneficiary_SSN_1__c':multiRowTableResults.beneficiary[0]?.ssn,
        'Beneficiary_DOB_1__c':multiRowTableResults.beneficiary[0]?.dob,
        'Beneficiary_Type_1__c':multiRowTableResults.beneficiary[0]?.type,
        'Beneficiary_Share_1__c':multiRowTableResults.beneficiary[0]?.share_percentage,
        'Beneficiary_Relationship_1__c':multiRowTableResults.beneficiary[0]?.relationship,
        //beneficiary 2
        'Beneficiary_First_Name_2__c':multiRowTableResults.beneficiary[1]?.first_name,
        'Beneficiary_Last_Name_2__c':multiRowTableResults.beneficiary[1]?.last_name,
        'Beneficiary_Street_2__c':multiRowTableResults.beneficiary[1]?.mailing_street,
        'Beneficiary_City_2__c':multiRowTableResults.beneficiary[1]?.mailing_city,
        'Beneficiary_State_2__c':multiRowTableResults.beneficiary[1]?.mailing_state,
        'Beneficiary_Zip_2__c':multiRowTableResults.beneficiary[1]?.mailing_zip,
        'Beneficiary_Phone_2__c':multiRowTableResults.beneficiary[1]?.phone,
        'Beneficiary_Email_2__c':multiRowTableResults.beneficiary[1]?.email,
        'Beneficiary_SSN_2__c':multiRowTableResults.beneficiary[1]?.ssn,
        'Beneficiary_DOB_2__c':multiRowTableResults.beneficiary[1]?.dob,
        'Beneficiary_Type_2__c':multiRowTableResults.beneficiary[1]?.type,
        'Beneficiary_Share_2__c':multiRowTableResults.beneficiary[1]?.share_percentage,
        'Beneficiary_Relationship_2__c':multiRowTableResults.beneficiary[1]?.relationship,
        //beneficiary 3
        'Beneficiary_First_Name_3__c':multiRowTableResults.beneficiary[2]?.first_name,
        'Beneficiary_Last_Name_3__c':multiRowTableResults.beneficiary[2]?.last_name,
        'Beneficiary_Street_3__c':multiRowTableResults.beneficiary[2]?.mailing_street,
        'Beneficiary_City_3__c':multiRowTableResults.beneficiary[2]?.mailing_city,
        'Beneficiary_State_3__c':multiRowTableResults.beneficiary[2]?.mailing_state,
        'Beneficiary_Zip_3__c':multiRowTableResults.beneficiary[2]?.mailing_zip,
        'Beneficiary_Phone_3__c':multiRowTableResults.beneficiary[2]?.phone,
        'Beneficiary_Email_3__c':multiRowTableResults.beneficiary[2]?.email,
        'Beneficiary_SSN_3__c':multiRowTableResults.beneficiary[2]?.ssn,
        'Beneficiary_DOB_3__c':multiRowTableResults.beneficiary[2]?.dob,
        'Beneficiary_Type_3__c':multiRowTableResults.beneficiary[2]?.type,
        'Beneficiary_Share_3__c':multiRowTableResults.beneficiary[2]?.share_percentage,
        'Beneficiary_Relationship_3__c':multiRowTableResults.beneficiary[2]?.relationship,
        //still need salesRep, Referallcode if that goes here
    }
    return sfOnlineApp;
}

export function generateOnlineAppJsonFromSingleRowTables(sessionId: string, pgClient : pg.Client){
    let singleRowTables = [
    'validated_pages',
    'applicant',
    'contribution',
    'fee_arrangement',
    'initial_investment',
    'interested_party',
    'payment']

    let queryString = generateQueryStringForSingleRow(singleRowTables, 'body', 'session_id');

    

    let singleRowQuery ={
        //text:'SELECT * FROM salesforce.body,salesforce.validated_pages,salesforce.applicant WHERE body.session_id=$1 AND applicant.session_id=$1 AND body.session_id=$1',
        text:queryString,
        values:[sessionId]
    }

    return pgClient.query(singleRowQuery).then((result:pg.QueryResult<singleRowFields>)=>{
        console.log(result.rowCount)
        return result.rows[0]
    }).catch(err=>{
        console.log(err)
        return null
    })
}

export function queryMultiRowTables(sessionId: string, pgClient: pg.Client){
    let multiRowTables = [
        'transfer',
        'rollover',
        'beneficiary'
    ]
    let queryStrings = generateQueryStringsForMultiRow(multiRowTables,'session_id', sessionId);
    return queryTables(queryStrings, pgClient)
}

async function queryTables (queryList: multiRowTableQueryParams, pgClient: pg.Client){
    type joinedType = multiRowTableNameToRows & {[name:string]: Array<any>}
    var queriedTables: joinedType = {
        beneficiary: [],
        transfer: [],
        rollover: []
    };
    await Promise.all(queryList.map(async (value)=>{
        let response = await pgClient.query(value.table);
        queriedTables[value.tableName] = response.rows
    }))
    console.log(queriedTables)

    return queriedTables;
}

function generateQueryStringsForMultiRow(multiRowTableList: Array<string>, constraint: string, constraintValue: string): multiRowTableQueryParams{
    let queryStringList: multiRowTableQueryParams = []
    multiRowTableList.forEach((value)=>{
        queryStringList.push({tableName: value,table:{text:`SELECT * FROM salesforce.${value} WHERE ${value}.${constraint}=$1`, values:[constraintValue]}})
    })

    return queryStringList;
}

function generateQueryStringForSingleRow(singleRowTableList:Array<string>, rootTable:string, constraint:string):string{
    let queryFieldList : Array<string> = []
    let selectList :Array<string> =[`to_json(${rootTable}.*) AS ${rootTable}`]
    
    //to_json(a.*) AS table1, to_json(b.*) AS table2
    singleRowTableList.forEach((value)=>{
        queryFieldList.push(`FULL OUTER JOIN salesforce.${value} ON (${rootTable}.${constraint}=${value}.${constraint})`)
        selectList.push(`to_json(${value}.*) AS ${value}`)
        
    })
    let queryString = `SELECT ${selectList.join(',')} FROM salesforce.${rootTable} ${queryFieldList.join(' ')} WHERE salesforce.${rootTable}.${constraint}=$1`
    console.log(queryString)

    return queryString;
}