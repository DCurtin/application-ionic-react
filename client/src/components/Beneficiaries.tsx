import React, {useState, useEffect} from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import {SessionApp, states} from '../helpers/Utils';
import { addOutline } from 'ionicons/icons';

interface FormData {
    [key:string] : any
}

const Beneficiaries: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    useEffect( () => {
        // GRAB DATA ON MOUNT
        //SAVE DATA ON DISMOUNT
    })

    const [formData, setFormData] = useState<FormData>({
        beneficiary_count__c: 0, 
        beneficiary_first_name_1__c: '',
        beneficiary_last_name_1__c:'',
        beneficiary_ssn_1__c:'',
        beneficiary_dob_1__c:'',
        beneficiary_type_1__c: '',
        beneficiary_relationship_1__c:'',
        beneficiary_share_1__c:'',
        beneficiary_street_1__c: '',
        beneficiary_city_1__c:'', 
        beneficiary_state_1__c:'',
        beneficiary_zip_1__c: '',
        beneficiary_phone_1__c: '',
        beneficiary_email_1__c: '',
        beneficiary_first_name_2__c: '',
        beneficiary_last_name_2__c: '', 
        beneficiary_ssn_2__c: '',
        beneficiary_dob_2__c: '',
        beneficiary_type_2__c: '',
        beneficiary_relationship_2__c:'',
        beneficiary_share_2__c: '',
        beneficiary_street_2__c: '',
        beneficiary_city_2__c:'', 
        beneficiary_state_2__c:'',
        beneficiary_zip_2__c: '',
        beneficiary_phone_2__c: '',
        beneficiary_email_2__c: '',
        beneficiary_first_name_3__c: '',
        beneficiary_last_name_3__c: '', 
        beneficiary_ssn_3__c: '', 
        beneficiary_dob_3__c: '',
        beneficiary_type_3__c: '',
        beneficiary_relationship_3__c:'',
        beneficiary_share_3__c: '',
        beneficiary_street_3__c: '',
        beneficiary_city_3__c:'', 
        beneficiary_state_3__c:'',
        beneficiary_zip_3__c: '',
        beneficiary_phone_3__c: '',
        beneficiary_email_3__c: '',
        beneficiary_first_name_4__c: '',
        beneficiary_last_name_4__c: '',
        beneficiary_ssn_4__c:'',
        beneficiary_dob_4__c:'',
        beneficiary_type_4__c:'',
        beneficiary_relationship_4__c:'',
        beneficiary_share_4__c:'',
        beneficiary_street_4__c: '',
        beneficiary_city_4__c:'', 
        beneficiary_state_4__c:'',
        beneficiary_zip_4__c: '',
        beneficiary_phone_4__c: '',
        beneficiary_email_4__c: '',
    })

    const addBeneficiary = () => {
        let currentCount = formData.beneficiary_count__c;
        let newCount = currentCount < 4 ? currentCount +1 : currentCount;  
        setFormData({...formData, beneficiary_count__c : newCount});
    }

    const updateForm = (e:any) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }
 
    const displayBeneficiaryForm = (beneficiaryCount: number) => {
        if (beneficiaryCount > 0) {
            let formRows = [];
            for (let i = 0; i < beneficiaryCount; i++){
                let beneficiaryNumber = i +1;
              formRows.push(
              <React.Fragment key={beneficiaryNumber}>
                  <IonItemDivider>
                    <strong>
                        <IonText color='primary'>
                            Beneficiary {beneficiaryNumber}
                        </IonText>
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            First Name
                        </IonLabel>
                        <IonInput name={`beneficiary_first_name_${beneficiaryNumber}__c`} value={formData[`beneficiary_first_name_${beneficiaryNumber}__c`]} onIonChange={updateForm}>
                        </IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Last Name</IonLabel>
                        <IonInput name={`beneficiary_last_name_${beneficiaryNumber}__c`} value={formData[`beneficiary_last_name_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Social Security Number</IonLabel>
                        <IonInput name={`beneficiary_ssn_${beneficiaryNumber}__c`} value={formData[`beneficiary_ssn_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Date of Birth</IonLabel>
                        <IonInput type='date' name={`beneficiary_dob_${beneficiaryNumber}__c`} value={formData[`beneficiary_dob_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel> Type </IonLabel>
                        <IonSelect name={`beneficiary_type_${beneficiaryNumber}__c`} value={formData[`beneficiary_type_${beneficiaryNumber}__c`]} onIonChange={updateForm}>
                            <IonSelectOption value='Primary'>Primary</IonSelectOption>
                            <IonSelectOption value='Contingent'>Contingent</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Relationship
                        </IonLabel>
                        <IonSelect name={`beneficiary_relationship_${beneficiaryNumber}__c`} value={formData[`beneficiary_relationship_${beneficiaryNumber}__c`]}   onIonChange={updateForm}>
                            <IonSelectOption value='Spouse'>Spouse</IonSelectOption>
                            <IonSelectOption value='Parent'>Parent</IonSelectOption>
                            <IonSelectOption value='Child'>Child</IonSelectOption>
                            <IonSelectOption value='Sibling'>Sibling</IonSelectOption>
                            <IonSelectOption value='Other Family'>Other Family</IonSelectOption>
                            <IonSelectOption value='Other'>Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Share %</IonLabel>
                        <IonInput type='number' name={`beneficiary_share_${beneficiaryNumber}__c`} value={formData[`beneficiary_share_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol className='well'>
                       Calculated Share Percentage 
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Beneficiary Street</IonLabel>
                        <IonInput name={`beneficiary_street_${beneficiaryNumber}__c`} value={formData[`beneficiary_street_${beneficiaryNumber}__c`]}onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Beneficiary City</IonLabel>
                        <IonInput name={`beneficiary_city_${beneficiaryNumber}__c`} value={formData[`beneficiary_city_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Beneficiary State</IonLabel>
                        <IonSelect name={`beneficiary_state_${beneficiaryNumber}__c`} value={formData[`beneficiary_state_${beneficiaryNumber}__c`]} onIonChange={updateForm}>
                            {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Beneficiary Zip</IonLabel>
                        <IonInput  name={`beneficiary_zip_${beneficiaryNumber}__c`} value={formData[`beneficiary_zip_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Phone
                        </IonLabel>
                        <IonInput  name={`beneficiary_phone_${beneficiaryNumber}__c`} value={formData[`beneficiary_phone_${beneficiaryNumber}__c`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Email
                        </IonLabel>
                        <IonInput type='email' onIonChange={updateForm}  name={`beneficiary_email_${beneficiaryNumber}__c`} value={formData[`beneficiary_email_${beneficiaryNumber}__c`]}></IonInput>
                    </IonCol>
                </IonRow>
              </React.Fragment>)
            }
            return formRows; 
        }
    }

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                        <p>
                            Naming beneficiaries in this online application is optional, but highly recommended. If you skip this step, we will provide you with a beneficiary form at a later date.
                        </p>
                        <p>
                            Naming a beneficiary allows your IRA assets to go to whomever you choose. Primary beneficiaries are the first set of individuals/entities that you wish to leave your retirement assets to. If you are married and leave the retirement account to your spouse, he/she inherits the account as if it were his/her own. Secondary beneficiaries receive the assets if your primary beneficiaries die before you or refuse to accept the inheritance.
                        </p>
                        <p>
                            If you elect not to designate a beneficiary, your assets may pass to your estate - subjecting them to the probate process, estate expenses, and creditor claims, causing delays for your beneficiary to receive these assets.
                        </p>
                    </IonCol>
                </IonRow>
                {displayBeneficiaryForm(formData.beneficiary_count__c)}
                <IonRow>
                    <IonCol>
                        <IonButton onClick={addBeneficiary}> <IonIcon icon={addOutline} slot='start'></IonIcon> Add Beneficiary </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}
export default Beneficiaries; 