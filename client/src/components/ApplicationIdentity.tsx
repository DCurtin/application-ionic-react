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
    const [formData, setFormData] = useState({first_name__c:'', last_name__c:'', ssn__c: '', email__c: '', dob__c: ''});
    const history = useHistory();
    const updateForm = function(e : any){
        setFormData({
        ...formData,
          [e.target.name]: e.target.value
        });
    }

    function ImportForm(data : any){
        console.log(data);
        console.log(data.first_name__c);
        console.log(data['first_name__c']);
        var importedForm = {first_name__c: data['first_name__c'], last_name__c: data['last_name__c'], ssn__c: data['ssn__c'], email__c: data['email__c'], dob__c: data['dob__c']}
        console.log('importedForm');
        console.log(importedForm);
        setFormData(importedForm);
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
              console.log(data[0]);
              //setFormData(data[0]);
              ImportForm(data[0]);
            })
          })
        }
       
        return function cleanup() {
            console.log('cleaning up sess id')
          }
    },[sessionId])

    useEffect(()=>{
      return history.listen(()=>{
        var url = '';
            if(sessionId === '')
            {
              url = '/startApplication'
              //setSessionId('test12345');
              //return;
            }else{
                url = '/saveState'
                //setSessionId('test12345');
                //return;
            }

            console.log('saving data appId data')
            console.log(formData)
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
      })
    },[formData])

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
                <IonInput class='item-input' name="first_name__c" value={formData.first_name__c} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="last_name__c" value={formData.last_name__c} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="ssn__c" value={formData.ssn__c} placeholder="Social" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='email' class='item-input' name="email__c" value={formData.email__c} placeholder="Email" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='date' class='item-input' name="dob__c" value={formData.dob__c} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
            </IonCard>
          </IonItem>
          </IonList>
        </IonContent>)
}

function nextState(formData:any, history: any, setSessionId: Function, sessionId: String, nextUrl?:String){
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
