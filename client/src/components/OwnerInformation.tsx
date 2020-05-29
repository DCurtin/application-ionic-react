import React, {useState, useEffect, Component} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { userState } from '../pages/Page'

interface SessionApp {
    sessionId : String,
    setSessionId : Function
}

const OwnerInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
        //const sessionId = props?.location?.state?.sessionId;
        const [formData, setFormData] = useState({first_name__c:'', last_name__c:'', ssn__c: '', email__c: '', dob__c: '', salutation__c: ''});
        const history = useHistory();
        const updateForm = function(e : any){
            setFormData({
            ...formData,
              [e.target.name]: e.target.value
            });
        }
    
        function ImportForm(data : any){
            var importedForm = {first_name__c: data['first_name__c'], last_name__c: data['last_name__c'], ssn__c: data['ssn__c'], email__c: data['email__c'], dob__c: data['dob__c'], salutation__c: data['salutation__c']}
            setFormData(importedForm);
        }
    
        useEffect(()=>{
            console.log('sessionId ' + sessionId );
            if(sessionId !== '')
            {
               //query fields
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
                  //setFormData(data[0]);
                  ImportForm(data[0]);
                  console.log(data[0])
                  console.log(formData)
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
                    response.json().then(function(data: any){
                      setSessionId(data.sessionId);
                    })
                  });
          })
        },[formData])

    return (
        <IonContent className="ion-padding">
            <IonGrid>
                <IonRow className="well">
                    <IonCol>
                    Please complete your personal information below. Fields outlined in red are required. Others are optional.
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Identity
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Salutation *
                        </IonLabel>
                        <IonSelect name="salutation__c" value={formData.salutation__c} onIonChange={e => updateForm(e!)}>
                            <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                            <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                            <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                            <IonSelectOption value="Dr.">Dr.</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            First Name *
                        </IonLabel>
                        <IonInput class='item-input' name="first_name__c" value={formData.first_name__c} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Last Name *
                        </IonLabel>
                        <IonInput class='item-input' name="last_name__c" value={formData.last_name__c} placeholder="Last Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Social Security Number *
                        </IonLabel>
                        <IonInput class='item-input' name="ssn__c" value={formData.ssn__c} placeholder="Social" onIonChange={e => updateForm(e!)} required clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Date of Birth *
                        </IonLabel>
                        <IonInput type='date' class='item-input' name="dob__c" value={formData.dob__c} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Email *
                        </IonLabel>
                        <IonInput class='item-input' name="email__c" value={formData.email__c} placeholder="Email" onIonChange={e => updateForm(e!)} required clearInput></IonInput>
                    </IonCol>
                </IonRow>

            </IonGrid>
        </IonContent>
    )
}

export default OwnerInformation;