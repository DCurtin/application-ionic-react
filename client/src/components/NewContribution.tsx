import React, {useState} from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonItemDivider, IonText, IonInput, IonSelect, IonSelectOption } from '@ionic/react';

const NewContribution: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState({
        new_contribution_amount__c: '', 
        tax_year__c: '',
        account_name__c: '', 
        bank_account_type__c: '', 
        routing_number__c: '', 
        account_number__c: '', 
        bank_name__c: ''
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        console.log(formData);
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                        <b>Using this page, you can make a new contribution to your account.</b> Please complete the information below including the amount of your contribution and what bank account you would like the contribution debited from. Your request will be reviewed and processed within 1-2 business days of the account being opened. Please keep in mind that there will be a five business day hold on the funds before they can be released into your account. This contribution will be considered for the tax year in which it was received.
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <IonText color='primary'>
                        <b>
                          New Contribution  
                        </b>
                    </IonText>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Amount
                        </IonLabel>
                        <IonInput name='new_contribution_amount__c' value={formData.new_contribution_amount__c} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Tax Year
                        </IonLabel>
                        <IonSelect value={formData.tax_year__c} name='tax_year__c' onIonChange={updateForm}>

                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Name on Account
                        </IonLabel>
                        <IonInput value={formData.account_name__c} name='account_name__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Bank Account Type
                        </IonLabel>
                        <IonSelect value={formData.bank_account_type__c} name='bank_account_type__c' onIonChange={updateForm}>
                            <IonSelectOption value='Checkings'>Checkings</IonSelectOption>
                            <IonSelectOption value='Savings'>Savings </IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}
export default NewContribution;