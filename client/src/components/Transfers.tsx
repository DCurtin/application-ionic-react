import React, {useState, useEffect} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

const Transfers : React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        existing_ira_transfers__c: 0,
        ira_account_number_1__c: '',
        ira_institution_name_1__c: '',
        ira_contact_name_1__c: '',
        ira_contact_phone_number_1__c: '', 
        ira_street_1__c: '',
        ira_city_1__c: '',
        ira_state_1__c: '',
        ira_zip_1__c: '',
        transfertype1__c: '',
        transfer1assetname1__c: '',
        transfer1assetname2__c: '',
        transfer1assetname3__c : '',
        ira_account_type_1__c: '',
        ira_full_or_partial_cash_transfer_1__c: '',
        ira_cash_amount_1__c: '',
        delivery_method__c: '',
        ira_account_number_2__c: '',
        ira_institution_name_2__c: '',
        ira_contact_name_2__c: '',
        ira_contact_phone_number_2__c:'',
        ira_street_2__c:'',
        ira_city_2__c: '',
        ira_state_2__c : '',
        ira_zip_2__c: '',
        transfertype2__c : '',
        ira_account_type_2__c: '',
        transfer2assetname1__c: '',
        transfer2assetname2__c: '',
        transfer2assetname3__c: '',
        ira_full_or_partial_cash_transfer_2__c: '',
        ira_cash_amount_2__c: '',
        delivery_method_2__c:''

    })

    const updateForm = (e:any) => {
        setFormData(prevState => ({...prevState, [e.target.name]:e.target.value}));
    }

    const addTransfer = () => {
        setFormData(prevState => {
            let currentCount = prevState.existing_ira_transfers__c;
            let newCount = currentCount < 2 ? currentCount + 1: currentCount; 
            return {
            ...prevState, 
            existing_ira_transfers__c: newCount
            }; 
        })
    }

    const displayTransferForm = (transferCount: number) => {
        if (transferCount > 0) {
            let formRows = [];
            for (let i = 1; i < transferCount + 1; i++) {
                formRows.push(
                    <React.Fragment key={i}>
                        <IonItemDivider>
                            <strong>
                                <IonText color='primary'>
                                    Transfer {i}
                                </IonText>
                            </strong>
                        </IonItemDivider>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                   Account Number 
                                </IonLabel>
                                <IonInput value={formData[`ira_account_number_${i}__c`]} name={`ira_account_number_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Institution Name
                                </IonLabel>
                                <IonInput value={formData[`ira_institution_name_${i}__c`]} name={`ira_institution_name_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonInput value={formData[`ira_contact_name_${i}__c`]} name={`ira_contact_name_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Contact Phone Number
                                </IonLabel>
                                <IonInput value={formData[`ira_contact_phone_number_${i}__c`]} name={`ira_contact_phone_number_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonInput value={formData[`ira_street_${i}__c`]} name={`ira_street_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel> City</IonLabel>
                                <IonInput value={formData[`ira_city_${i}__c`]} name={`ira_city_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel> State </IonLabel>
                                <IonSelect value={formData[`ira_state_${i}__c`]} name={`ira_state_${i}__c`} onIonChange={updateForm}>
                                {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonInput value={formData[`ira_zip_${i}__c`]} name={`ira_zip_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                    </React.Fragment>
                )
            }
            return formRows;
        }
    }

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    <b>Using this page, you can request an IRA-to-IRA Transfer.</b> Please provide the information below regarding the account you would like to transfer. To help expedite your request, please note the following:
	                <ul data-type="circle">
                        <li>Provide as much information as possible. Incomplete/inaccurate information will result in transfer delays</li>
                        <li>IRA-to-IRA trustee transfers are non-reportable for tax purposes. The funds will go directly from your current IRA to your Midland Trust</li>
                        <li> At the end of this application process, you will sign Midland’s Transfer Form and Midland will initiate the transfer request for you within 24 hours if your current custodian accepts DocuSign</li>
                        <li>IRA transfers typically take 1-2 weeks to complete, depending on your current IRA company</li>
                    </ul>
                    </IonCol>
                </IonRow>
                    {displayTransferForm(formData.existing_ira_transfers__c)}
                
                <IonRow>
                    <IonCol>
                        <IonButton onClick={addTransfer}>
                            <IonIcon icon={addOutline} slot='start'></IonIcon>
                            Add Transfer
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>            
        </IonContent>
    )
}

export default Transfers; 