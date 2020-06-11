import React, {useState, useEffect} from 'react';
import { SessionApp, initialInvestmentTypes } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';

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

    const showMinCashBalanceCheckbox = (investmentAmount:string) => {
        const initialInvestmentAmount = +investmentAmount;

    return (<div>{initialInvestmentAmount}</div>)
    }

    const showNotEnoughProjectedCashWarning = (investmentAmount:string) => {
        const initialInvestmentAmount = + investmentAmount; 
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
                {showMinCashBalanceCheckbox(formData.investment_amount__c)}
            </IonGrid>
        </IonContent>
    )
}

export default InitialInvestment; 