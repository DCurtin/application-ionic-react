import {rolloverForm, rollover} from '../../client/src/helpers/Utils'
import * as salesforceSchema from '../utils/salesforce'

export function transformRolloverClientToServer(rolloverFlattened: any): rolloverForm{
    let rolloverForm : rolloverForm ={
        account_type: rolloverFlattened['account_type'],
        existing_employer_plan_roll_overs: rolloverFlattened['existing_employer_plan_roll_overs'],
        rollovers: []
    }

    let rolloverCount : number = rolloverFlattened.existing_employer_plan_roll_overs;

    for( let index = 1; index <= ()){
        
    }
}