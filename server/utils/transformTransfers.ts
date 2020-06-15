import {transferForm, transfer} from '../../client/src/helpers/Utils'
import * as salesforceSchema from '../utils/salesforce'
import {addressSchema} from '../utils/helperSchemas'

export function transformTransferClientToServer(transferFlattened: any): transferForm{
    let transferForm : transferForm ={
        account_type: transferFlattened['account_type__c'],
        existing_ira_transfers: transferFlattened['existing_ira_transfers__c'],
        transfers: []
    }
    let transferCount : number = transferForm.existing_ira_transfers;
    console.log('existing '+transferFlattened['existing_ira_transfers__c'])

    for(let index = 1; index < (transferCount + 1); ++index){
        let castedTransfer : transfer ={
            ira_account_number: transferFlattened[`ira_account_number_${index}__c`],
            ira_account_type: transferFlattened[`ira_account_type_${index}__c`],
            ira_cash_amount: transferFlattened[`ira_cash_amount_${index}__c`],
            ira_contact_name: transferFlattened[`ira_contact_name_${index}__c`],
            ira_contact_phone_number: transferFlattened[`ira_contact_phone_number_${index}__c`],
            ira_full_or_partial_cash_transfer: transferFlattened[`ira_full_or_partial_cash_transfer_${index}__c`],
            ira_institution_name: transferFlattened[`ira_institution_name_${index}__c`],
            transfer_type: transferFlattened[`transfer_type_${index}__c`],
            delivery_method: transferFlattened[`delivery_method_${index}__c`],
            transfer_assetname1: transferFlattened[`transfer${index}assetname1__c`],
            transfer_assetname2: transferFlattened[`transfer${index}assetname2__c`],
            transfer_assetname3: transferFlattened[`transfer${index}assetname3__c`],
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


export function transformTransferServerToClient(transferForm: Array<salesforceSchema.transfer>, accountType: string):any{
    let returnData : any = {};
    returnData['account_type__c'] = accountType; //query from applicant or body
    returnData['existing_ira_transfers__c'] =transferForm.length;
    let index = 0;
    transferForm.forEach(transfer =>{
      ++index;
      let transferAddress :addressSchema = transfer.address as addressSchema
      returnData[`ira_account_number_${index}__c`] = transfer.account_number;
      returnData[`ira_account_type_${index}__c`] = transfer.account_type;
      returnData[`ira_cash_amount_${index}__c`] = transfer.amount;
      returnData[`ira_contact_name_${index}__c`] = transfer.contact_name
      returnData[`ira_contact_phone_number_${index}__c`] = transfer.contact_phone_number
      returnData[`ira_full_or_partial_cash_transfer_${index}__c`] = transfer.full_or_partial
      returnData[`ira_institution_name_${index}__c`] = transfer.institution_name
      returnData[`transfer_type_${index}__c`] = transfer.transfer_type
      returnData[`transfer${index}assetname1__c`] = transfer.asset_name_1
      returnData[`transfer${index}assetname2__c`] = transfer.asset_name_2
      returnData[`transfer${index}assetname3__c`] = transfer.asset_name_3
      returnData[`ira_street_${index}__c`] = transferAddress.address
      returnData[`ira_city_${index}__c`] = transferAddress.city
      returnData[`ira_state_${index}__c`] = transferAddress.state
      returnData[`ira_zip_${index}__c`] = transferAddress.zip
      returnData[`delivery_method_${index}__c`] = transfer.delivery_method
    })
  
    return returnData;
  }