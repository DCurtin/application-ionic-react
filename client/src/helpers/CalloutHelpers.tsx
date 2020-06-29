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
            return data;
        }).catch(function(error: any) {
            console.log('error: ' + error);
        })
    })
}

export function downloadPenSignDocs(sessionId: string)
{
    //http://ccoenraets.github.io/es6-tutorial-data/promisify/
    return new Promise((resolve, reject) => {
        console.log('docusign return');
        var xhr = new XMLHttpRequest();
        
        xhr.open('GET', '/getPenSignDocs?sessionId=' + sessionId, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function () {
            if (this.status === 200) {
                console.log('status 200');
                var blob = new Blob([xhr.response], {type: "application/pdf"});
                var objectUrl = URL.createObjectURL(blob);
                
                /*let a = document.createElement('a');
                a.href = objectUrl;
                a.download = 'Midland_Application_Documents.pdf';
                a.click();*/
                //window.URL.revokeObjectURL(objectUrl);
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

export function saveTransferPage(sessionId: string, formData: FormData){
    return makeSaveStateCallout(sessionId, 'transfer', formData)
}

export function getTransferPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'transfer')
}

export function saveContributionPage(sessionId: string, formData: FormData){
    return makeSaveStateCallout(sessionId, 'contribution', formData)
}

export function getContributionPage(sessionId: string){
    return makeGetPageInfoCallout(sessionId, 'contribution')
}

export function saveRolloverPage(sessionId: string, formData: FormData){
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
            return response.json().then(function(data: any){
                return data.data;
            })
        })
}

export function updateValidationTable(page: string, isValid: boolean, sessionId: string){
    let validated_page :any = {}
    validated_page[page] = isValid
    let body: requestBody ={
      session: {
        page: 'root',
        sessionId: sessionId
      },
      data: validated_page
    }
    let options = {
      method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    fetch('/validatePage', options).then(function(response:any){
      response?.json().then((data: any)=>{//this is probably not necessary
      })
    })

  }