import { IonContent, IonPage, IonList, IonItem, IonButton, IonListHeader, IonLabel, IonCard, IonInput} from '@ionic/react';
import React, {useState, useEffect, Component} from 'react';
import { useHistory } from 'react-router-dom';

interface AppPage {
    header?: string;
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
  }
  
  interface userState{
    prevPage?: AppPage,
    currentPage: AppPage,
    nextPage?: AppPage
  }

interface SessionApp {
    sessionId : String,
    currentState: userState
}

const ApplicationBene: React.FC<SessionApp> = ({sessionId, currentState}) => {
    //const sessionId = props?.location?.state?.sessionId;
    console.log('sessionId ' + sessionId);
    const [formData, setFormData] = useState({firstName:'', lastName:'', social: '', email: '', dateOfBirth: ''});
    console.log('Stringify: ' + JSON.stringify(formData));
    const accountTypes = ['IRA', 'Roth'];
    const [accountType, setAccountType] = useState(accountTypes[0]);
    const history = useHistory();
    
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
        <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>
              Provide Beneficiaries
            </IonLabel>
          </IonListHeader>
          <IonItem>
            <IonCard>
                <IonLabel>Beneficiary</IonLabel>
                <IonInput class='item-input' name="firstName" value={formData.firstName} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="lastName" value={formData.lastName} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput class='item-input' name="social" value={formData.social} placeholder="Social" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='email' class='item-input' name="email" value={formData.email} placeholder="Email" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                <IonInput type='date' class='item-input' name="dateOfBirth" value={formData.dateOfBirth} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
            </IonCard>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{nextState(formData, history, currentState.nextPage?.url)}}>Next</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{prevState(history, currentState.prevPage?.url)}}>Prev</IonButton>
          </IonItem>
          <IonItem>
              <IonButton onClick={()=>{saveAndReturn(formData, history)}}>Save And Return</IonButton>
          </IonItem>
          </IonList>
        </IonContent>)
}


function nextState(formData: any, history: any, url?:string){
    // {'formData':JSON.stringify(formData)}
    //save data to postGres
    //get session id
    console.log(formData);
    history.push(url);
}


function prevState(history: any, url?:string){
    history.replace(url);
}

function saveAndReturn(formData: any, history: any){
    //history.push('/AppId', {'AccountType':accountType});
}

export default ApplicationBene;