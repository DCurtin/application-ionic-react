import {transferForm, transfer} from '../../client/src/helpers/Utils'
import * as salesforceSchema from '../utils/salesforce'
import {addressSchema} from '../utils/helperSchemas'

export function transformTransferClientToServer(transferFlattened: any): transferForm{
    let transferForm : transferForm ={
        account_type: transferFlattened['account_type__c'],
        deliveryMethodField: transferFlattened['deliveryMethodField'],
        existing_ira_transfers: transferFlattened['existing_ira_transfers__c'],
        transfers: []
    }
    let beneCount : number = transferForm.existing_ira_transfers;

    for(let index = 0; index < beneCount; ++index){
        ++index;
        let castedTransfer : transfer ={
            ira_account_number: transferFlattened[`ira_account_number_${index}__c`],
            ira_account_type: transferFlattened[`ira_account_type_${index}__c`],
            ira_cash_amount: transferFlattened[`ira_cash_amount_${index}__c`],
            ira_contact_name: transferFlattened[`ira_contact_name_${index}__c`],
            ira_contact_phone_number: transferFlattened[`ira_contact_phone_number_${index}__c`],
            ira_full_or_partial_cash_transfer: transferFlattened[`ira_full_or_partial_cash_transfer_${index}__c`],
            ira_institution_name: transferFlattened[`ira_institution_name_${index}__c`],
            transfertype: transferFlattened[`transfertype_${index}__c`],
            transfer_assetname1: transferFlattened[`transfer${index}assetname1`],
            transfer_assetname2: transferFlattened[`transfer${index}assetname2`],
            transfer_assetname3: transferFlattened[`transfer${index}assetname3`],
            ira_street: transferFlattened[`ira_street_${index}__c`],
            ira_city: transferFlattened[`ira_city_${index}__c`],
            ira_state: transferFlattened[`ira_state_${index}__c`],
            ira_zip: transferFlattened[`ira_zip_${index}__c`],
            index: index
        }
        transferForm.transfers.push(castedTransfer);
    }

    return transferForm;
}