import React, {useState, useEffect} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { stat } from 'fs';

const Rollovers : React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        existing_employer_plan_roll_overs__c: 0
    });

    const addRollover = () => {
        setFormData(prevState => {
            let currentCount = prevState.existing_employer_plan_roll_overs__c;
            let newCount = currentCount < 2 ? currentCount + 1 : currentCount;
            return {
                ...prevState,
                existing_employer_plan_roll_overs__c: newCount
            };
        })
    }

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            console.log(prevState);
            return {...prevState, [e.target.name]:newValue}});
    }

    const displayRolloverForm = (rolloverCount: number) => {
        if (rolloverCount > 0)
        {
            let formRows = [];
            for (let i = 1; i<rolloverCount + 1; i++){
                formRows.push(
                    <React.Fragment key={i}>
                        <IonItemDivider>
                            <strong>
                                <IonText color='primary'>
                                    Employer Plan {i}
                                </IonText>
                            </strong>
                        </IonItemDivider>
                        <IonRow>
                            <IonCol>
                                <IonLabel> Institution Name</IonLabel>
                                <IonInput name={`employer_institution_name_${i}__c`} value={formData[`employer_institution_name_${i}__c`]} onIonChange={updateForm} placeholder='Institution Name'></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel> Cash Amount (approximate value allowed)</IonLabel>
                                <IonInput name={`employer_cash_amount_${i}__c`} value={formData[`employer_cash_amount_${i}__c`]} onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonInput name={`employer_contact_name_${i}__c`} value={formData[`employer_contact_name_${i}__c`]} onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Contact Phone Number
                                </IonLabel>
                                <IonInput pattern='/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/' name={`employer_contact_phone_${i}__c`} value={formData[`employer_contact_phone_${i}__c`]} placeholder='(555)555-5555'></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Street
                                </IonLabel>
                                <IonInput name={`employer_rollover_street_${i}__c`} value={formData[`employer_rollover_street_${i}__c`]} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    City
                                </IonLabel>
                                <IonInput name={`employer_rollover_city_${i}__c`} value={formData[`employer_rollover_city_${i}__c`]} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    State
                                </IonLabel>
                                <IonSelect value={formData[`employer_rollover_state_${i}__c`]} name={`employer_rollover_state_${i}__c`} onIonChange={updateForm}>
                                    {states.map((state,index) => (
                                        <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonInput value={formData[`employer_rollover_zip_${i}__c
                                `]} name={`employer_rollover_zip_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    
                                </IonLabel>
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
                        <b>
                        Using this page, you can tell us about your pending employer plan rollover. 
                        </b> &nbsp;
                        The plan administrator of your employer plan account will not allow Midland to initiate the rollover. You, as the plan participant, will be required to contact the plan administrator of your current employer plan to request this rollover. Typically, it’s as easy as calling the phone number on your most recent statement. At the end of this application, we will provide you with "Rollover Instructions" for you to provide to your plan administrator to help expedite the request.

                        As an option you are welcome to provide Midland with your account information to deduct your contribution below, but if mailing a check to our office, please send to the address below and mark the year in which you wish the contribution to be applied to.
                    </IonCol>
                </IonRow>
                {displayRolloverForm(formData.existing_employer_plan_roll_overs__c)}
                <IonRow>
                    <IonCol>
                    <IonButton onClick={addRollover}>
                        <IonIcon icon={addOutline} slot='start'></IonIcon>
                             Add Rollover
                    </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default Rollovers;