import {beneficiaryPlaceHolder, beneficiaryForm, beneficiary} from '../../client/src/helpers/Utils'

export function transformBeneficiaries(flattenedBenes: beneficiaryPlaceHolder): beneficiaryForm{
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