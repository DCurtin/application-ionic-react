import {beneficiaryForm, beneficiary} from '../../client/src/helpers/Utils'
import * as salesforceSchema from '../utils/salesforce'
import {addressSchema} from '../utils/helperSchemas'

export function transformBeneClientToServer(flattenedBenes: any): beneficiaryForm{
    let formattedBeneficiaries : beneficiaryForm = {
        beneficiary_count: flattenedBenes.beneficiary_count,
        beneficiaries: []
    }
    let index = 0;
    let beneCount = flattenedBenes.beneficiary_count;

    for(let index = 0; index < beneCount; ++index)
    {
        formattedBeneficiaries.beneficiaries.push(getBeneficiaryByIndex(index+1, flattenedBenes));
    }
    return formattedBeneficiaries;
}

function getBeneficiaryByIndex(index:number, flattenedBenes: any) : beneficiary{
    let castedBene : beneficiary = {
            mailing_street: flattenedBenes[`mailing_street__${index}`],
            mailing_city:flattenedBenes[`mailing_city__${index}`],
            mailing_state:flattenedBenes[`mailing_state__${index}`],
            mailing_zip:flattenedBenes[`mailing_zip__${index}`],
            type: flattenedBenes[`type__${index}`],
            dob: flattenedBenes[`dob__${index}`],
            email: flattenedBenes[`email__${index}`],
            first_name: flattenedBenes[`first_name__${index}`],
            last_name: flattenedBenes[`last_name__${index}`],
            phone: flattenedBenes[`phone__${index}`],
            relationship: flattenedBenes[`relationship__${index}`],
            share_percentage: flattenedBenes[`share__${index}`],
            ssn: flattenedBenes[`ssn__${index}`],
            token: flattenedBenes[`token__${index}`]
        }
        return castedBene;
}

export function transformBeneficiariesServerToClient(beneficiaryList : Array<salesforceSchema.beneficiary>) : any{
    let returnData : any = {};
    let count = 0;
    returnData[`beneficiary_count`] = beneficiaryList.length,
    beneficiaryList.forEach(element => {
      ++count;
      returnData[`dob__${count}`] = element.dob
      returnData[`email__${count}`] = element.email
      returnData[`first_name__${count}`]= element.first_name
      returnData[`last_name__${count}`]= element.last_name
      returnData[`phone__${count}`] = element.phone
      returnData[`relationship__${count}`] = element.relationship
      returnData[`share__${count}`] = element.share_percentage
      returnData[`ssn_${count}`] = element.ssn
      returnData[`mailing_street__${count}`] = element.mailing_street
      returnData[`mailing_city__${count}`] = element.mailing_city
      returnData[`mailing_state__${count}`] = element.mailing_state
      returnData[`mailing_zip__${count}`] = element.mailing_zip
      returnData[`beneficiary__token_${count}`] = element.token
      returnData[`beneficiary__type_${count}`] = element.type
    })
    return returnData;
  }