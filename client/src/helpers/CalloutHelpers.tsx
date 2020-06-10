import {requestBody, applicantId, saveApplicationId, FormData, beneficiaryPlaceHolder, saveBeneficiary} from './Utils'

export function getAppPage(sessionId: string) {
       //query fields
        let url = '/getPageFields'
        let body : requestBody ={
            session:{sessionId: sessionId, page: 'appId'},
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


export function saveAppPage(sessionId: string, formData: applicantId){
    let url = '/saveState'
    let body : saveApplicationId= {
    session: {sessionId: sessionId, page: 'appId'},
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

export function getBenePage(sessionId: string){
    let url = '/getPageFields'
        let body : requestBody ={
            session:{sessionId: sessionId, page: 'beneficiary'},
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

export function saveBenePage(sessionId: string, formData: FormData)
{
    let beneData : beneficiaryPlaceHolder = formData as beneficiaryPlaceHolder
    let url = '/saveState'
    //temporarily setting this as requestBody until we can more strongly type formData
    let body : saveBeneficiary= {
        session: {sessionId: sessionId, page: 'beneficiary'},
        data: beneData
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