import { IonContent, IonPage, IonList, IonItem, IonButton, IonListHeader, IonLabel, IonSelect, IonSelectOption, IonInput, IonCard } from '@ionic/react';
import React, {useState, useEffect, Component} from 'react';
import { useHistory } from 'react-router-dom';
import { userState } from '../pages/Page'
import { constructOutline } from 'ionicons/icons';

interface SessionApp {
    sessionId : String,
    setSessionId : Function,
    currentState: userState
}

const ApplicationIdentity: React.FC<SessionApp> = ({sessionId, setSessionId, currentState}) => {
    //const sessionId = props?.location?.state?.sessionId;
    console.log('sessionId ' + sessionId);
    const [formData, setFormData] = useState({First_Name__c:'', Last_Name__c:'', SSN__c: '', Email__c: '', DOB__c: ''});
    const history = useHistory();
    const updateForm = function(e : any){
        setFormData({
        ...formData,
          [e.target.name]: e.target.value
        });
    }

    useEffect(()=>{
        if(sessionId !== '')
        {
           //query fields
          console.log('sessionId in useEffect ' + sessionId);
          var url = '/getPageFields'
          var body ={
            session:{sessionId: sessionId, page: 'appId'}
          }
          var options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          }
          fetch(url, options).then(function(response: any){
            response.json().then(function(data: any){
              console.log(data);
              setFormData(data);
            })
          })
        }
       
        return function cleanup() {
            var url = '';
            if(sessionId === '')
            {
              url = '/startApplication'
            }else{
              url = '/saveState'
            }

            console.log('saving data appId data')
            console.log(formData)
              var body = {
              var body = {
                session:{sessionId: sessionId, page: 'appId'},
                data: formData
              }
              var options = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
              }
              fetch(url, options).then(function(response: any){
                console.log('cleaning up');
                console.log(response);
                response.json().then(function(data: any){
                  console.log(data);
                  setSessionId(data.sessionId);
                })
              });
          }
    },[sessionId])
    
    return (
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Please provide ID information
            </IonLabel>
          </IonListHeader>

          <IonItem>
          <IonCard>
                <IonLabel>User Info</IonLabel>
                <IonInput class='item-input' name="First_Name__c" value={formData.First_Name__c} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="Last_Name__c" value={formData.Last_Name__c} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="SSN__c" value={formData.SSN__c} placeholder="Social" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='email' class='item-input' name="Email__c" value={formData.Email__c} placeholder="Email" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='date' class='item-input' name="DOB__c" value={formData.DOB__c} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
            </IonCard>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{nextState(formData, history, setSessionId, sessionId, currentState.nextPage?.url)}}>Next</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{prevState(history, currentState.prevPage?.url)}}>Prev</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{saveAndReturn(formData, history, sessionId)}}>Save And Return</IonButton>
          </IonItem>
          </IonList>
        </IonContent>)
}

function nextState(formData:any, history: any, setSessionId: Function, sessionId: String, nextUrl?:String){
    // {'formData':JSON.stringify(formData)}
    //save data to postGres
    //get session id
    //enage loading here
    /*var url;
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
      })*/
      history.push(nextUrl);
    }

function prevState(history: any, prevUrl?:String){
    history.push(prevUrl);
}

function saveAndReturn(formData: any, history: any, sessionId: String){
    //history.push('/AppId', {'AccountType':accountType});
    console.log('saving data appId data')
            var url = '/saveApplication'
            var body = {
              session:{sessionId: sessionId, page: 'appId'},
              data: formData
            }
            var options = {
              method : 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(body)
            }
            fetch(url, options).then(function(response: any){
                  console.log('cleaning up');
            });
}

export default ApplicationIdentity;
