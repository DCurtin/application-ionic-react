import {rolloverForm, rollover} from '../../client/src/helpers/Utils'
import * as postgresSchema from './postgresSchema'

export function transformRolloverClientToServer(rolloverFlattened: any): rolloverForm{
    let rolloverForm : rolloverForm ={
        account_type: rolloverFlattened['account_type'],
        existing_employer_plan_roll_overs: rolloverFlattened['existing_employer_plan_roll_overs'],
        rollovers: []
    }

    let rolloverCount : number = rolloverFlattened.existing_employer_plan_roll_overs;

    for( let index = 1; index <= rolloverCount; ++index){

        let rollover: rollover = {
            account_number: rolloverFlattened[`account_number__${index}`],
            account_type: rolloverFlattened[`account_type__${index}`],
            cash_amount: rolloverFlattened[`cash_amount__${index}`],
            name: rolloverFlattened[`name__${index}`],
            phone: rolloverFlattened[`phone__${index}`],
            institution_name: rolloverFlattened[`institution_name__${index}`],
            mailing_city: rolloverFlattened[`mailing_city__${index}`],
            mailing_state: rolloverFlattened[`mailing_state__${index}`],
            mailing_street: rolloverFlattened[`mailing_street__${index}`],
            mailing_zip: rolloverFlattened[`mailing_zip__${index}`],
            rollover_type: rolloverFlattened[`rollover_type__${index}`],
            index: index
        }
        rolloverForm.rollovers.push(rollover);
    }

    return rolloverForm;
}

export function transformRolloverServerToClient(rolloverInfoList: Array<postgresSchema.rollover>, account_type:string){
    let rolloverFlattened : any = {
        account_type: account_type,
        existing_employer_plan_roll_overs: rolloverInfoList.length
    }
    let index = 0;
    rolloverInfoList.forEach(element=>{
        ++index;
        rolloverFlattened[`cash_amount__${index}`] = element.cash_amount
        rolloverFlattened[`index__${index}`] = element.index
        rolloverFlattened[`institution_name__${index}`] = element.institution_name
        rolloverFlattened[`mailing_city__${index}`] = element.mailing_city
        rolloverFlattened[`mailing_state__${index}`] = element.mailing_state
        rolloverFlattened[`mailing_street__${index}`] = element.mailing_street
        rolloverFlattened[`mailing_zip__${index}`] = element.mailing_zip
        rolloverFlattened[`name__${index}`] = element.name
        rolloverFlattened[`phone__${index}`] = element.phone
        rolloverFlattened[`rollover_type__${index}`] = element.rollover_type
        rolloverFlattened[`account_number__${index}`] = element.account_number
        rolloverFlattened[`account_type__${index}`] = element.account_type
    })

    return rolloverFlattened
}