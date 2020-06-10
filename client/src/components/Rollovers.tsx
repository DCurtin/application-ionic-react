import React, {useState, useEffect} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

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