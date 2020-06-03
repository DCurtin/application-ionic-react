import React, {useState, useEffect } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput, IonCheckbox } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { userState } from '../pages/Page';

interface SessionApp {
    sessionId : String,
    setSessionId : Function
}

const OwnerInformation: React.FC<SessionApp> = ({sessionId, setSessionId})=> {
    const [formData, setFormData] = useState({first_name__c:'', last_name__c:'', ssn__c: '', email__c: '', dob__c: '', salutation__c: ''});
    const history = useHistory();
    const updateForm = function(e : any){
        setFormData({
        ...formData,
          [e.target.name]: e.target.value
        });
    }

    function ImportForm(data : any){
        let importedForm = {first_name__c: data['first_name__c'], last_name__c: data['last_name__c'], ssn__c: data['ssn__c'], email__c: data['email__c'], dob__c: data['dob__c'], salutation__c: ''}

        console.log('data');
        console.log(data);

        console.log('importedForm');
        console.log(importedForm);

        setFormData(importedForm);
    }

    useEffect(()=>{
        console.log('sessionId ' + sessionId );
        if(sessionId !== '')
        {
          let url = '/getPageFields'
          let body ={
            session:{sessionId: sessionId, page: 'appId'}
          }
          let options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          }
          fetch(url, options).then(function(response: any){
            response.json().then(function(data: any){
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
        let url = '';
        if(sessionId === '')
        {
            url = '/startApplication'
        }else{
            url = '/saveState'
        }

        let body = {
        session:{sessionId: sessionId, page: 'appId'},
        data: formData
        }
        let options = {
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
                        <IonInput class='item-input' name="first_name__c" value={formData.first_name__c} placeholder="First Name" onIonChange={e => updateForm(e!)} clearInput></IonInput>                    </IonCol>
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
                            Marital Status
                        </IonLabel>
                        <IonSelect>
                            <IonSelectOption value="Single">Single</IonSelectOption>
                            <IonSelectOption value="Married">Married</IonSelectOption>
                            <IonSelectOption value="Widowed/Divorced">Widowed/Divorced</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Mother's Maiden Name</IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Occupation</IonLabel>
                        <IonSelect>
                            <IonSelectOption value="Accountant">Accountant
                            </IonSelectOption>
                            <IonSelectOption value="Attorney">Attorney</IonSelectOption>
                            <IonSelectOption value="Financial Advisor">Financial Adviser</IonSelectOption>
                            <IonSelectOption value="Realtor">Realtor</IonSelectOption>
                            <IonSelectOption value="Other">Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Are you Self-Employed?</IonLabel>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Do you have a Health Savings Account?</IonLabel>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Proof of ID
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                      <IonLabel>Proof of Identification</IonLabel>
                        <IonSelect>

                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel> ID Number </IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Issued By
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Issue Date
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Expiration Date</IonLabel>
                        <IonInput>

                        </IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <strong>
                            If you provided a Passport ID, please supply Midland with a copy of the passport. If you provided a Driver's License ID, a copy is not necessary.
                        </strong>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Contact Information
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        PHYSICAL ADDRESS
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <i>
                        If you currently reside outside of the US, please call our office at (866) 839-0429 for help setting up your IRA.
                        </i>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Physical Street Address
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            City
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Physical State
                        </IonLabel>
                        <IonSelect></IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Zip
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonCheckbox></IonCheckbox> &nbsp; My mailing address is different than my physical address
                        <p></p>
                    </IonCol>
                </IonRow>
                {/* TO DO: RENDER MAILING ADDRESS FORM IF CHECKBOX IS CHECKED */}
                <IonRow>
                    <IonCol>
                        PRIMARY CONTACT INFO
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Primary Phone
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Primary Contact Method
                        </IonLabel>
                        <IonSelect>

                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Email</IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Confirm Email</IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <p>SECONDARY CONTACT INFO</p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Alternate Phone</IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Alternate Phone Type</IonLabel>
                        <IonSelect></IonSelect>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default OwnerInformation;