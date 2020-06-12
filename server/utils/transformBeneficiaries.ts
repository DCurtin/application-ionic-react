import {beneficiaryPlaceHolder, beneficiaryForm, beneficiary} from '../../client/src/helpers/Utils'
import * as salesforceSchema from '../utils/salesforce'
import {addressSchema} from '../utils/helperSchemas'

export function transformBeneClientToServer(flattenedBenes: beneficiaryPlaceHolder): beneficiaryForm{
    let formattedBeneficiaries : beneficiaryForm = {
        beneficiary_count: flattenedBenes.beneficiary_count__c,
        beneficiaries: []
    }
    let index = 0;
    let beneCount = flattenedBenes.beneficiary_count__c;

    for(let index = 0; index < beneCount; ++index)
    {
        formattedBeneficiaries.beneficiaries.push(getBeneficiaryByIndex(index+1, flattenedBenes));
    }
    return formattedBeneficiaries;
}

function getBeneficiaryByIndex(index:number, flattenedBenes: any) : beneficiary{
    let castedBene : beneficiary = {
            beneficiary_street: flattenedBenes[`beneficiary_street_${index}__c`],
            beneficiary_city:flattenedBenes[`beneficiary_city_${index}__c`],
            beneficiary_state:flattenedBenes[`beneficiary_state_${index}__c`],
            beneficiary_zip:flattenedBenes[`beneficiary_zip_${index}__c`],
            beneficiary_type: flattenedBenes[`beneficiary_type_${index}__c`],
            beneficiary_dob: flattenedBenes[`beneficiary_dob_${index}__c`],
            beneficiary_email: flattenedBenes[`beneficiary_email_${index}__c`],
            beneficiary_first_name: flattenedBenes[`beneficiary_first_name_${index}__c`],
            beneficiary_last_name: flattenedBenes[`beneficiary_last_name_${index}__c`],
            beneficiary_phone: flattenedBenes[`beneficiary_phone_${index}__c`],
            beneficiary_relationship: flattenedBenes[`beneficiary_relationship_${index}__c`],
            beneficiary_share: flattenedBenes[`beneficiary_share_${index}__c`],
            beneficiary_ssn: flattenedBenes[`beneficiary_ssn_${index}__c`],
            beneficiary_token: flattenedBenes[`beneficiary_token_${index}__c`]
        }
        return castedBene;
}

export function transformBeneficiariesServerToClient(beneficiaryList : Array<salesforceSchema.beneficiary>) : beneficiaryPlaceHolder{
    let returnData : any = {};
    let count = 0;
    returnData[`beneficiary_count__c`] = beneficiaryList.length,
    beneficiaryList.forEach(element => {
      let address : addressSchema = element.address as addressSchema;
      ++count;
      returnData[`beneficiary_city_${count}__c`] = address.city
      returnData[`beneficiary_dob_${count}__c`] = element.date_of_birth
      returnData[`beneficiary_email_${count}__c`] = element.email
      returnData[`beneficiary_first_name_${count}__c`]= element.first_name
      returnData[`beneficiary_last_name_${count}__c`]= element.last_name
      returnData[`beneficiary_phone_${count}__c`] = element.phone
      returnData[`beneficiary_relationship_${count}__c`] = element.relationship
      returnData[`beneficiary_share_${count}__c`] = element.share_percentage
      returnData[`beneficiary_ssn_${count}__c`] = element.social_security_number
      returnData[`beneficiary_state_${count}__c`] = address.state
      returnData[`beneficiary_street_${count}__c`] = address.address
      returnData[`beneficiary_token_${count}__c`] = element.token
      returnData[`beneficiary_type_${count}__c`] = element.beneficiary_type
      returnData[`beneficiary_zip_${count}__c`] = address.zip
    })
    return returnData;
  }