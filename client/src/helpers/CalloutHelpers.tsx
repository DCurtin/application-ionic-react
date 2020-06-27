import {requestBody, applicantIdForm, FormData, feeArrangementForm, accountNotificationsForm} from './Utils'

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

//Salesforce related calls

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
            if (response.status == 200) {
                return data;
            }
            else {
                throw Error(data.StatusDetails);
            }         
        }).catch(function(error: any) {
            throw Error(error.message);
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
            console.log('eSignUrl from server ' + data.eSignUrl);
            return data;
        }).catch(function(error: any) {
            console.log('error: ' + error);
        })
    })
}

export function handleDocusignReturn(sessionId: string, eSignResult: string)
{
    let url = '/handleDocusignReturn'
    let body = {
        sessionId: sessionId,
        eSignResult: eSignResult
    }
    let options = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)     
    }
    return fetch(url, options).then(function(response: any){
        return response.json().then(function(data: any){
            return data;
        }).catch(function(error: any) {
            console.log('error in handleDocusignReturn in callout helpers');
            console.log('error: ' + error);
        })
    })
}

export function downloadPenSignDocs(sessionId: string, eSignResult: string)
{
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        
        xhr.open('GET', '/getPenSignDocs?sessionId=' + sessionId + '&eSignResult=' + eSignResult, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function () {
            if (this.status === 200) {
                var blob = new Blob([xhr.response], {type: "application/pdf"});
                var objectUrl = URL.createObjectURL(blob);
                resolve(objectUrl);
            }
            if (this.status !== 200) {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    })
}