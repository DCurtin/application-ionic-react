import React, {useState, useEffect} from 'react';
import { SessionApp, initialInvestmentTypes } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput, IonCheckbox } from '@ionic/react';
import { fingerPrint } from 'ionicons/icons';

const InitialInvestment : React.FC<SessionApp> = ({sessionId, setSessionId}) => {   
    let investmentTypesArr = initialInvestmentTypes.filter(investmentType => (investmentType !== `I'm Not Sure`));

    const [formData, setFormData] = useState({
        initial_investment_type__c : 'Futures/Forex',
        initial_investment_name__c: '',
        investment_contact_person__c: '',
        investment_contact_person_phone__c: null, 
        investment_amount__c: '', 
        ira_full_or_partial_cash_transfer_1__c: '', 
        ira_full_or_partial_cash_transfer_2__c: '',
        transfertype1__c: '', 
        transfertype2__c:'', 
        existing_ira_transfer__c: false,
        existing_employer_plan_rollover__c: false, 
        new_ira_contribution__c: false,
        ira_cash_amount_1__c: '',
        ira_cash_amount_2__c: '', 
        employer_cash_amount_1__c: '', 
        employer_cash_amount_2__c: '',
        new_contribution_amount__c: ''
    });
    
    useEffect(() => {
        // TO DO: Grab initial investment type fields from saved application 
    })

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const displayEntityNameLabel = (investmentType:string) => {
        let entityNameLabel = 'Entity Name';
        if (investmentType.includes('Note')){
            entityNameLabel = 'Borrower Name';
        } else if (investmentType === 'Real Estate'){
            entityNameLabel = 'Property Address';
        } else if (investmentType === 'Futures/Forex'){
            entityNameLabel = 'Trading Company Name';
        } else if (investmentType === 'Precious Metals') {
            entityNameLabel = 'Dealer Name';
        }
        return entityNameLabel;
    }

    const showMinCashBalanceCheckbox = (formData:any) => {
        let showMinCashBalanceCheckbox = false; 
        if (formData.initial_investment_type__c == 'Futures/Forex'){
            showMinCashBalanceCheckbox = true;
        }

        if (formData.ira_full_or_partial_cash_transfer_1__c == 'All Available Cash' || formData.ira_full_or_partial_cash_transfer_2__c == 'All Available Cash' || formData.transfertype1__c == 'In-Kind Transfer' || formData.transfertype2__c == 'In-Kind Transfer'){
            showMinCashBalanceCheckbox = true;
        }

        if (formData.existing_ira_transfer__c && !formData.existing_employer_plan_rollover__c && !formData.new_ira_contribution__c) {
            showMinCashBalanceCheckbox = true;
        }
        
        return showMinCashBalanceCheckbox;
    }

    const showNotEnoughProjectedCashWarning = (formData:any) => {
        let showNotEnoughProjectedCashWarning = false; 
        let transfer1Amount = formData.ira_cash_amount_1__c ? +formData.ira_cash_amount_1__c : 0;
        let transfer2Amount = formData.ira_cash_amount_2__c ? +formData.ira_cash_amount_2__c : 0; 
        let rollover1Amount = formData.employer_cash_amount_1__c ? +formData.employer_cash_amount_1__c : 0; 
        let rollover2Amount = formData.employer_cash_amount_2__c ? +formData.employer_cash_amount_2__c : 0; 
        let contributionAmount = formData.new_contribution_amount__c ? +formData.new_contribution_amount__c : 0; 
        
        let projectedAvailableCash = transfer1Amount + transfer2Amount + rollover1Amount + rollover2Amount + contributionAmount;

        if (!showMinCashBalanceCheckbox(formData) && (projectedAvailableCash < (formData.investment_amount__c + 250))) {
            showNotEnoughProjectedCashWarning = true; 
        }
        
        return showNotEnoughProjectedCashWarning;
    }
    

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    Already have an investment in mind for your new account? Tell us about your transaction. If you don’t know all of the details, no problem! Our client services team will reach out to you to further discuss this transaction before anything is processed.
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <IonText color='primary'>
                        <b>
                            Investment Details    
                        </b>
                    </IonText>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            What type of asset?
                        </IonLabel>
                        <IonSelect value={formData.initial_investment_type__c} name='initial_investment_type__c' onIonChange={updateForm}>
                            {investmentTypesArr.map((investmentType, index) => (
                                <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                            <IonLabel>{displayEntityNameLabel(formData.initial_investment_type__c)}</IonLabel>
                            <IonInput name='initial_investment_name__c' value={formData.initial_investment_name__c}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Contact Person
                        </IonLabel>
                        <IonInput name='investment_contact_person__c' value={formData.investment_contact_person__c} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Contact Phone
                        </IonLabel>
                        <IonInput name='investment_contact_person_phone__c' value={formData.investment_contact_person_phone__c} onIonChange={updateForm} placeholder='(555)555-5555'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Investment Amount</IonLabel>
                        <IonInput value={formData.investment_amount__c} name='investment_amount__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                {showMinCashBalanceCheckbox(formData) && (
                    <IonRow>
                        <IonCol>
                            <IonCheckbox></IonCheckbox> 
                            <IonText slot='start'>
                                Midland has a minimum cash balance requirement of $250 which cannot be included in the investment amount. *   
                            </IonText>
                        </IonCol>
                    </IonRow>
                )}
                {showNotEnoughProjectedCashWarning(formData) &&
                (
                    <IonRow className='well'>
                        <IonCol>
                        <p> Your indicated investment amount is less than your projected available cash.  Please alter your investment amount or revisit your transfer, rollover, or contribution request on the left-hand side. Most clients transfer over enough excess cash to cover at least 3 years of administrative fees or 10% of the account value.</p> 
                        </IonCol>
                    </IonRow>
                )}
            </IonGrid>
        </IonContent>
    )
}

export default InitialInvestment; 