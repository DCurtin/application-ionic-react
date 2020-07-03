import {transferForm, transfer} from '../../client/src/helpers/Utils'
import * as postgresSchema from './postgresSchema'

export function transformTransferClientToServer(transferFlattened: any): transferForm{
    let transferForm : transferForm ={
        account_type: transferFlattened['account_type'],
        existing_transfers: transferFlattened['existing_transfers'],
        transfers: []
    }
    let transferCount : number = transferForm.existing_transfers;

    for(let index = 1; index <= transferCount; ++index){
        let castedTransfer : transfer ={
            account_number: transferFlattened[`account_number__${index}`],
            account_type: transferFlattened[`account_type__${index}`],
            cash_amount: transferFlattened[`cash_amount__${index}`],
            contact_name: transferFlattened[`contact_name__${index}`],
            contact_phone_number: transferFlattened[`contact_phone_number__${index}`],
            full_or_partial_cash_transfer: transferFlattened[`full_or_partial_cash_transfer__${index}`],
            institution_name: transferFlattened[`institution_name__${index}`],
            transfer_type: transferFlattened[`transfer_type__${index}`],
            delivery_method: transferFlattened[`delivery_method__${index}`],
            asset_name_1: transferFlattened[`asset_name_1__${index}`],
            asset_name_2: transferFlattened[`asset_name_2__${index}`],
            asset_name_3: transferFlattened[`asset_name_3__${index}`],
            mailing_street: transferFlattened[`mailing_street__${index}`],
            mailing_city: transferFlattened[`mailing_city__${index}`],
            mailing_state: transferFlattened[`mailing_state__${index}`],
            mailing_zip: transferFlattened[`mailing_zip__${index}`],
            index: index
        }
        transferForm.transfers.push(castedTransfer);
    }

    return transferForm;
}


export function transformTransferServerToClient(transferForm: Array<postgresSchema.transfer>, accountType: string):any{
    let returnData : any = {};
    returnData['account_type'] = accountType; //query from applicant or body
    returnData['existing_transfers'] =transferForm.length;
    let index = 0;
    transferForm.forEach(transfer =>{
      ++index;
      returnData[`account_number__${index}`] = transfer.account_number;
      returnData[`account_type__${index}`] = transfer.account_type;
      returnData[`cash_amount__${index}`] = transfer.cash_amount;
      returnData[`contact_name__${index}`] = transfer.contact_name
      returnData[`contact_phone_number__${index}`] = transfer.contact_phone_number
      returnData[`full_or_partial_cash_transfer__${index}`] = transfer.full_or_partial_cash_transfer
      returnData[`institution_name__${index}`] = transfer.institution_name
      returnData[`transfer_type__${index}`] = transfer.transfer_type
      returnData[`asset_name_1__${index}`] = transfer.asset_name_1
      returnData[`asset_name_2__${index}`] = transfer.asset_name_2
      returnData[`asset_name_3__${index}`] = transfer.asset_name_3
      returnData[`mailing_street__${index}`] = transfer.mailing_street
      returnData[`mailing_city__${index}`] = transfer.mailing_city
      returnData[`mailing_state__${index}`] = transfer.mailing_state
      returnData[`mailing_zip__${index}`] = transfer.mailing_zip
      returnData[`delivery_method__${index}`] = transfer.delivery_method
    })
  
    return returnData;
  }