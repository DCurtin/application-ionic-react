import React, {useState} from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonItemDivider, IonText, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import moment from 'moment'; 

const NewContribution: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState({
        new_contribution_amount__c: '', 
        tax_year__c: '',
        account_name__c: '', 
        bank_account_type__c: '', 
        routing_number__c: '', 
        account_number__c: '', 
        bank_name__c: '', 
        account_type__c: 'Traditional IRA'
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const validateRoutingNumber = (e:CustomEvent) => {
        let routingNumberInput = e.detail.value;
    }

    const showTaxYearInput = (accountType:string) => {
        let showTaxYearInput = false; 
        let jan = moment().date(1);
        jan.month(0);
        
        //TO DO: After 2020 Tax Deadline, update to Apr 15
        let jul = moment().date(15);
        jul.month(6);

        if (moment().isBetween(jan, jul) && accountType !== 'SEP IRA'){
            showTaxYearInput = true; 
        }
        return showTaxYearInput; 
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
                    <IonCol size='6'>
                        <IonLabel>
                            Amount
                        </IonLabel>
                        <IonInput name='new_contribution_amount__c' value={formData.new_contribution_amount__c} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    {showTaxYearInput(formData.account_type__c) && (
                        <IonCol>
                            <IonLabel>
                                Tax Year
                            </IonLabel>
                            <IonSelect value={formData.tax_year__c} name='tax_year__c' onIonChange={updateForm}>
                                <IonSelectOption value='Current Year'>Current Year</IonSelectOption>
                                <IonSelectOption value='Last Year'>
                                    Last Year
                                </IonSelectOption>
                            </IonSelect>
                        </IonCol>
                    )}
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
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Bank ABA/Routing Number
                        </IonLabel>
                        <IonInput name='routing_number__c' value={formData.routing_number__c} onIonChange={validateRoutingNumber}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Account Number
                        </IonLabel>
                        <IonInput value={formData.account_number__c} onIonChange={updateForm} name='account_number__c'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Bank Name</IonLabel>
                        <IonInput value={formData.bank_name__c} onIonChange={updateForm} name='bank_name__c'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow className='well ion-margin-top'>
                    <IonCol>
                    <p>Providing Midland with your account information is optional.</p>
                    <p>If you prefer to mail a check for your contribution, please send to the address below, mark the year in which you wish the contribution to be applied to, and make the check payable to Midland Trust Company FBO your name as it appears on your application.</p>
                    <p>Midland IRA, Inc. 
                    <br/>P.O. Box 07520
                    <br/>Fort Myers, FL 33919</p>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}
export default NewContribution;