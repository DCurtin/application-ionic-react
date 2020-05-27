import { IonContent, IonPage, IonList, IonItem, IonButton, IonListHeader, IonLabel, IonSelect, IonSelectOption, IonInput, IonCard } from '@ionic/react';
import React, {useState, useEffect, Component} from 'react';
import { useHistory } from 'react-router-dom';

interface SessionApp {
    sessionId : String,
    setSessionId : Function
}

const ApplicationIdentity: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    //const sessionId = props?.location?.state?.sessionId;
    console.log('sessionId ' + sessionId);
    const [formData, setFormData] = useState({First_Name__c:'', Last_Name__c:'', SSN__c: '', Email__c: '', DOB__c: ''});
    const history = useHistory();
    //const [sessionId, setSessionId] = useState(props?.location?.state?.sessionId)
    const updateForm = function(e : any){
        setFormData({
        ...formData,
          [e.target.name]: e.target.value
        });
    }

    useEffect(()=>{
        if(sessionId === undefined)
        {
            return;
        }
        //query fields
        console.log('sessionId in useEffect ' + sessionId);

        return function cleanup() {
            var url = 'https://ionic-reach-test-midland.herokuapp.com/appHome/googleplex'
            var options ={
                method : 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
              fetch(url, options).then(function(response: any){
                  console.log('cleaning up');
              });
            }
    },[sessionId])
    
    return (
        <IonPage>
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Please provide ID information
            </IonLabel>
          </IonListHeader>

          <IonItem>
          <IonCard>
                <IonLabel>Beneficiary</IonLabel>
                <IonInput class='item-input' name="First_Name__c" value={formData.First_Name__c} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="Last_Name__c" value={formData.Last_Name__c} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="SSN__c" value={formData.SSN__c} placeholder="Social" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='email' class='item-input' name="Email__c" value={formData.Email__c} placeholder="Email" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='date' class='item-input' name="DOB__c" value={formData.DOB__c} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
            </IonCard>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{nextState(formData, history, setSessionId, sessionId)}}>Next</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{prevState(history)}}>Prev</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{saveAndReturn(formData, history)}}>Save And Return</IonButton>
          </IonItem>
          </IonList>
        </IonContent>
    </IonPage>)
}

function nextState(formData:any, history: any, setSessionId: Function, sessionId: String){
    // {'formData':JSON.stringify(formData)}
    //save data to postGres
    //get session id
    //enage loading here
    var url;
    var body = {'formData': formData,
                'page': 'AppId',
                'sessionId': sessionId}
    var options ={
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        'body': JSON.stringify(body)
      }

    if(sessionId === undefined){
        url = '/startApplication'
    }else{
        url = '/saveState'
    }

    fetch(url, options).then(function(response :any){

        if(!response.ok){
            console.log('failed to save state');
        }
        if(sessionId === undefined){
            setSessionId(response.body.sessionId);
        }
        history.push('/AppBene', {'sessionId': sessionId});
    })
}

function prevState(history: any){
    history.goBack();
}

function saveAndReturn(formData: any, history: any){
    //history.push('/AppId', {'AccountType':accountType});
}

export default ApplicationIdentity;
