import {requestBody, applicantIdForm, FormData, feeArrangementForm, accountNotificationsForm} from './Utils'
import { FromTo } from 'moment';

export function saveAppPage(sessionId: string, formData: applicantIdForm){
    return makeSaveStateCallout(sessionId, 'appId', formData)
}

export function getAppPage(sessionId: string) {
    return makeGetPageInfoCallout(sessionId, 'appId');
}

export function saveBenePage(sessionId: string, formData: FormData)
{
    return makeSaveStateCallout(sessionId, 'beneficiary', formData)
}

export function getBenePage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'beneficiary')
}

export function saveFeeArangementPage(sessionId: string, formData: feeArrangementForm){
    return makeSaveStateCallout(sessionId, 'feeArrangement', formData)
}

export function getFeeArrangementPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'feeArrangement')
}

export function saveAccountNotificationsPage(sessionId: string, formData: accountNotificationsForm){
    return makeSaveStateCallout(sessionId, 'accountNotification', formData)
}

export function getAccountNotificationsPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'accountNotification')
}

export function chargeCreditCard(formData: FormData, sessionId: string)
{
    let url = '/chargeCreditCard'
    let body = {
        sessionId: sessionId,
        creditCardNumber : formData.creditCardNumber,
        expirationDateString : formData.expirationDateString
    }
    let options = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)     
    }
    return fetch(url, options).then(function(response: any){
        return response.json().then(function(data: any){
            console.log('status from server ' + data.Status)
            return data;
        }).catch(function(error: any) {
            console.log('error: ' + error);
        })
    })
}

export function getESignUrl(sessionId: string)
{
    let url = '/getESignUrl'
    let body = {
        sessionId : sessionId
    }
    let options = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)     
    }
    return fetch(url, options).then(function(response: any){
        return response.json().then(function(data: any){
            console.log('eSignUrl from server ' + data.eSignUrl)
            return data;
        }).catch(function(error: any) {
            console.log('error: ' + error);
        })
    })
}

export function saveTransferPage(sessionId: string, formData: FormData){
    return makeSaveStateCallout(sessionId, 'transfer', formData)
}

export function getTransferPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'transfer')
}

export function saveContributionPage(sessionId: string, formData: FormData){
    console.log(formData);
    return makeSaveStateCallout(sessionId, 'contribution', formData)
}

export function getContributionPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'contribution')
}

export function saveRolloverPage(sessionId: string, formData: FormData){
    console.log(formData);
    return makeSaveStateCallout(sessionId, 'rollover', formData)
}

export function getRolloverPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'rollover')
}

export function getInitialInvestmentPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'initial_investment');
}

export function saveInitialInvestmentPage(sessionId: string, formData: FormData){
    return makeSaveStateCallout(sessionId, 'initial_investment', formData)
}

function makeSaveStateCallout(sessionId: string, page: string, formData: FormData){
    let url = '/saveState'
    let body : requestBody= {
    session: {sessionId: sessionId, page: page},
    data: formData
    }
    let options = {
    method : 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
    }
    return fetch(url, options).then(function(response: any){
        return response.json().then(function(data: any){
        })
    });
}

function makeGetPageInfoCallout(sessionId: string, page: string)
{
    let url = '/getPageFields'
        let body : requestBody ={
            session:{sessionId: sessionId, page: page},
            data: undefined
        }
       let options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }
        return fetch(url, options).then(function(response: any){
            console.log('before json parse')
            return response.json().then(function(data: any){
                console.log('after json parse')
                return data.data;
            })
        })
}