import {saveWelcomeParameters, requestBody, welcomePageParameters, saveApplicationId, applicantId} from '../../client/src/helpers/Utils'
import * as salesforceSchema from './salesforce'
import {addressSchema, identificationSchema} from './helperSchemas'
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
    })
}

export function handleApplicationIdPage(sessionId: string, res: express.Response, client: pg.Client)
{
    let bodyQuery = {
        text : 'SELECT * FROM salesforce.applicant WHERE token = $1',
        values : [sessionId]
      }
      client.query(bodyQuery).then( function(result:pg.QueryResult ){
        let row : salesforceSchema.applicant = result.rows[0]
        if(row === undefined){
          console.log('now row')
          res.json({data:row});
          return;
        }
        console.log(result.rows[0]);
        console.log(row);
        let identification : identificationSchema = <identificationSchema>row?.identification;
        let legalAddress : addressSchema = <addressSchema>row?.legal_address;
        let mailingAddress: addressSchema = <addressSchema>row?.mailing_address;
  
        let data : applicantId = {
          isSelfEmployed: row.is_self_employed,
          hasHSA: row.has_hsa,
          homeAndMailingAddressDifferent: row.home_and_mailing_address_different,
          firstName:row.first_name,
          lastName:row.last_name, 
          ssn: row.social_security_number, 
          email: row.email, 
          confirmEmail: row.email,
          dob: row.date_of_birth === null ? '' : row.date_of_birth.toISOString().split('T')[0],
          salutation: row.salutation,
          maritalStatus: row.marital_status,
          mothersMaidenName: row.mothers_maiden_name,
          occupation: row.occupation,
          idType: identification === null ? '' : identification.idType, 
          idNumber: identification === null ? '' : identification.idNumber,
          issuedBy: identification === null ? '' : identification.issuedBy, 
          issueDate: identification === null ? '' : identification.issueDate === null ? '' : identification.issueDate.split('T')[0],
          expirationDate: identification === null ? '' : identification.expirationDate === null ? '' : identification.expirationDate.split('T')[0],
          legalAddress: legalAddress === null ? ''  : legalAddress.address,
          legalCity: legalAddress === null ? ''  : legalAddress.city,
          legalState: legalAddress === null ? ''  : legalAddress.state,
          legalZip: legalAddress === null ? ''  : legalAddress.zip,
          mailingAddress: mailingAddress === null ? ''  : mailingAddress.address,
          mailingCity: mailingAddress === null ? ''  : mailingAddress.city,
          mailingState: mailingAddress === null ? ''  : mailingAddress.state,
          mailingZip: mailingAddress === null ? ''  : mailingAddress.zip,
          primaryPhone: row.phone,
          preferredContactMethod: row.preferred_contact_method,
          alternatePhone: row.alternate_phone,
          alternatePhoneType: row.alternate_phone_type
      };  
        console.log(data);
        ////console.log(result)
        //data.firstName = row.first_name;
        //data.lastName = row.last_name;
        ////data.dob = row.date_of_birth;
        res.json({'data': data})
      })
}