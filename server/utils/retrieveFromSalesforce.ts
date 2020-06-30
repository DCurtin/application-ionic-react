import pg from 'pg'
import express from 'express'
import jsforce from 'jsforce'
import * as salesforceSchema from './salesforce'
import * as saveStateHandlers from './saveStateHandlers'
import {createAppSession} from './appSessionHandler';
const { v4: uuidv4 } = require('uuid');

interface resume{
    last_name:string,
    last_4_ssn:string,
    date_of_birth:string,
    email:string
}
interface resumeRequest{
    appExternalId: string
    data: resume
}

export function resumeApplication(pgClient: pg.Client, userInstances: any, serverConn:Partial<jsforce.Connection>, authParams: resumeRequest, res: express.Response){
    let options :jsforce.ExecuteOptions ={}//empty options at the time was necessary to run serverCon findOne
    let herokuToken = authParams.appExternalId
  
    interface salesforceResumeResponse{
      attributes:{
        type:string,
        url:string
      }
      Id:string,
      AccountNew__c:string,
      Last_Name__c:string,
      Email__c:string,
      SSN__c:string,
      DOB__c:string,
      heroku_token__c:string
    }
    serverConn.sobject('Online_Application__C').findOne({HerokuToken__c:herokuToken}, ['Id','AccountNew__c','Last_Name__c','Email__c', 'SSN__c', 'DOB__c', 'HerokuToken__c']).execute(options,(err, record : any)=>{
      let salesforceOnlineApp:salesforceResumeResponse= record
  
      console.log(salesforceOnlineApp)
      let lastFourSocial = salesforceOnlineApp.SSN__c?.match(/\d{4}/)
      if(lastFourSocial === null || lastFourSocial === undefined){
        console.group('failed, application likely does not have ssn')
        res.status(500).send('failed to authenticate');  
      }
  
      let dateOfBirthsMatch = authParams.data.date_of_birth === salesforceOnlineApp.DOB__c;
      let emailsMatch = authParams.data.email.toLowerCase() === salesforceOnlineApp.Email__c.toLowerCase()
      let lastNamesMatch = authParams.data.last_name.toLowerCase() === salesforceOnlineApp.Last_Name__c.toLowerCase()
      let lastFourSocialMatch = authParams.data.last_4_ssn === lastFourSocial[0]
  
      if(dateOfBirthsMatch && emailsMatch && lastNamesMatch && lastFourSocialMatch)
      {
        serverConn.sobject("Online_Application__c").retrieve(record.Id).then((onlineAppresult:any)=>{
        let sessionId : string = uuidv4();
        let bodyInfo : Partial<salesforceSchema.body> ={
          has_read_diclosure: onlineAppresult.Disclosures_Viewed__c,
          account_type: onlineAppresult.Account_Type__c,
          transfer_form: onlineAppresult.Existing_IRA_Transfer__c,
          rollover_form: onlineAppresult.Existing_Employer_Plan_Rollover__c,
          cash_contribution_form: onlineAppresult.New_IRA_Contribution__c,
          investment_type: onlineAppresult.Initial_Investment_Type__c,
          referred_by: onlineAppresult.Referred_By__c,
          session_id: sessionId
        }
        let bodyParams = saveStateHandlers.generateQueryString('body',bodyInfo,'session_id')
        let ownerInfo : Partial<salesforceSchema.applicant> ={
          application_id: onlineAppresult.Id,
          account_number: onlineAppresult.AccountNew__c,
          salutation: onlineAppresult.Salutation__c,
          first_name: onlineAppresult.First_Name__c,
          last_name: onlineAppresult.Last_Name__c,
          ssn: onlineAppresult.SSN__c,
          dob: onlineAppresult.DOB__c,
          marital_status: onlineAppresult.Marital_Status__c,
          mothers_maiden_name: onlineAppresult.Mother_s_Maiden_Name__c,
          occupation: onlineAppresult.Occupation__c,
          is_self_employed: onlineAppresult.IsSelfEmployed__c,
          has_hsa: onlineAppresult.HasHSA__c,
          id_type: onlineAppresult.ID_Type__c,
          id_number: onlineAppresult.ID_Number__c,
          id_issued_by: onlineAppresult.Issued_By__c,
          id_issued_date: onlineAppresult.Issue_Date__c,
          id_expiration_date: onlineAppresult.Expiration_Date__c,
          legal_street: onlineAppresult.Legal_Address__c,
          legal_city: onlineAppresult.Legal_City__c,
          legal_state: onlineAppresult.Legal_State__c,
          legal_zip: onlineAppresult.Legal_Zip__c,
          home_and_mailing_address_different:onlineAppresult.Home_and_Mailing_Address_Different__c,
          mailing_street: onlineAppresult.Mailing_Address__c,
          mailing_city: onlineAppresult.Mailing_City__c,
          mailing_state: onlineAppresult.Mailing_State__c,
          mailing_zip: onlineAppresult.Mailing_Zip__c,
          primary_phone: onlineAppresult.Primary_Phone__c,
          preferred_contact_method: onlineAppresult.Preferred_Contact_Method__c,
          email: onlineAppresult.Email__c,
          alternate_phone: onlineAppresult.Alternate_Phone__c,
          alternate_phone_type: onlineAppresult.Alternate_Phone_Type__c,
          heroku_token: onlineAppresult.HerokuToken__c,
          session_id:sessionId
        }
        let applicantQueryParams = saveStateHandlers.generateQueryString('applicant', ownerInfo, 'session_id')
  
        let validatedPages : salesforceSchema.validated_pages = {
          is_welcome_page_valid: false,
          ...JSON.parse(onlineAppresult.HerokuValidatedPages__c),
          session_id:sessionId}
        let validatedPagesQueryParams = saveStateHandlers.generateQueryString('validated_pages', validatedPages, 'session_id')
        
        saveStateHandlers.runQueryReturnPromise(applicantQueryParams, pgClient).then((result:pg.QueryResult)=>{
          saveStateHandlers.runQueryReturnPromise(bodyParams, pgClient).then((bodyResult: pg.QueryResult)=>{
            saveStateHandlers.runQueryReturnPromise(validatedPagesQueryParams, pgClient).then((validatedPagesResult: pg.QueryResult)=>{
              createAppSession(salesforceOnlineApp.AccountNew__c, salesforceOnlineApp.Id, sessionId, pgClient, userInstances, res)
            }).catch(err=>{
              console.log(err)
              console.group('failed validation query')
              res.status(500).send('failed to authenticate');
            })
          }).catch((err)=>{
            console.log(err)
            console.group('failed body query')
            res.status(500).send('failed to authenticate');
          })
        }).catch(err=>{
          console.log(err)
          console.group('failed applicant quey')
          res.status(500).send('failed to authenticate');
        })
    })
    return
    }
      console.group('fail')
      res.status(500).send('failed to authenticate');
    })
  }