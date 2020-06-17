import React, {useState, useEffect} from 'react';
import { SessionApp, initialInvestmentTypes, initialInvestmentForm , initialInvestmentConditionalParameters} from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput, IonCheckbox } from '@ionic/react';

const InitialInvestment : React.FC<SessionApp> = ({sessionId, setSessionId}) => {   
    let investmentTypesArr = initialInvestmentTypes.filter(investmentType => (investmentType !== `I'm Not Sure`));

    const [formData, setFormData] = useState<Partial<initialInvestmentForm>>({
        initial_investment_type : 'Futures/Forex'
    });
    
    const [conditionalParameters, setconditionalParameters] = useState<initialInvestmentConditionalParameters>();
    useEffect(() => {
        // TO DO: Grab initial investment type fields from saved application 
    })

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const displayEntityNameLabel = (investmentType?:string) => {
        let entityNameLabel = 'Entity Name';
        if(investmentType === undefined){
            return entityNameLabel;
        }

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
        if (formData.initial_investment_type == 'Futures/Forex'){
            showMinCashBalanceCheckbox = true;
        }

        if (conditionalParameters?.ira_full_or_partial_cash_transfer_1 == 'All Available Cash' || conditionalParameters?.ira_full_or_partial_cash_transfer_2 == 'All Available Cash' || conditionalParameters?.transfertype1 == 'In-Kind Transfer' || conditionalParameters?.transfertype2 == 'In-Kind Transfer'){
            showMinCashBalanceCheckbox = true;
        }

        if (conditionalParameters?.existing_ira_transfer && !conditionalParameters?.existing_employer_plan_rollover && !conditionalParameters?.new_ira_contribution) {
            showMinCashBalanceCheckbox = true;
        }
        
        return showMinCashBalanceCheckbox;
    }

    const showNotEnoughProjectedCashWarning = (formData:initialInvestmentConditionalParameters) => {
        let showNotEnoughProjectedCashWarning = false; 
        let transfer1Amount = formData.ira_cash_amount_1 ? +formData.ira_cash_amount_1 : 0;
        let transfer2Amount = formData.ira_cash_amount_2 ? +formData.ira_cash_amount_2 : 0; 
        let rollover1Amount = formData.employer_cash_amount_1 ? +formData.employer_cash_amount_1 : 0; 
        let rollover2Amount = formData.employer_cash_amount_2 ? +formData.employer_cash_amount_2 : 0; 
        let contributionAmount = formData.new_contribution_amount ? +formData.new_contribution_amount : 0; 
        
        let projectedAvailableCash = transfer1Amount + transfer2Amount + rollover1Amount + rollover2Amount + contributionAmount;

        if (!showMinCashBalanceCheckbox(formData) && (projectedAvailableCash < (formData.investment_amount + 250))) {
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
                        <IonSelect value={formData.initial_investment_type} name='initial_investment_type' onIonChange={updateForm}>
                            {investmentTypesArr.map((investmentType, index) => (
                                <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                            <IonLabel>{displayEntityNameLabel(formData.initial_investment_type)}</IonLabel>
                            <IonInput name='initial_investment_name' value={formData.initial_investment_name}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Contact Person
                        </IonLabel>
                        <IonInput name='investment_contact_person' value={formData.investment_contact_person} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Contact Phone
                        </IonLabel>
                        <IonInput name='investment_contact_person_phone' value={formData.investment_contact_person_phone} onIonChange={updateForm} placeholder='(555)555-5555'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Investment Amount</IonLabel>
                        <IonInput value={formData.investment_amount} name='investment_amount' onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                {showMinCashBalanceCheckbox(formData) && (
                    <IonRow>
                        <IonCol>
                            <IonCheckbox></IonCheckbox> &nbsp; 
                            <IonText className='ion-padding-left'>
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