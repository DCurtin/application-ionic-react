import React, {useState, useEffect} from 'react';
import { SessionApp, initialInvestmentTypes, initialInvestmentForm , initialInvestmentConditionalParameters} from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput, IonCheckbox } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {getInitialInvestmentPage, saveInitialInvestmentPage} from '../helpers/CalloutHelpers'

const InitialInvestment : React.FC<SessionApp> = ({sessionId, setShowErrorToast, updateMenuSections, formRef, setShowSpinner}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, setValue, getValues, formState}  = useForm({
        mode: 'onChange'
    });

    let investmentTypesArr = initialInvestmentTypes.filter(investmentType => (investmentType !== `I'm Not Sure`));

    const [formData, setFormData] = useState<Partial<initialInvestmentForm>>({
        initial_investment_type : 'Futures/Forex'
    });
    const [isAfterGettingData, setIsAfterGettingData] = useState(false);

    const [conditionalParameters, setconditionalParameters] = useState<initialInvestmentConditionalParameters>();

    useEffect(()=>{
        if(sessionId !== '')
        {
            getInitialInvestmentPage(sessionId).then(data =>{
                if(data.formData === undefined || data.parameters === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let conditionalParameters : initialInvestmentConditionalParameters = data.parameters;
        let formData : initialInvestmentForm = data.formData;
        setFormData(formData);
        setconditionalParameters(conditionalParameters);
        setIsAfterGettingData(true);
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveInitialInvestmentPage(sessionId, formData);
      })
    },[formData])

    useEffect(() => {
        if (isAfterGettingData) {
            let data : any = {...formData};
            for (var fieldName in data) {
                setValue(fieldName, data[fieldName]);
            }
        }
    }, [isAfterGettingData])

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

        if (conditionalParameters?.ira_full_or_partial_cash_transfer_1 == 'All Available Cash' || conditionalParameters?.ira_full_or_partial_cash_transfer_2 == 'All Available Cash' || conditionalParameters?.transfer_type_1 == 'In-Kind Transfer' || conditionalParameters?.transfer_type_2 == 'In-Kind Transfer'){
            showMinCashBalanceCheckbox = true;
        }

        if (conditionalParameters?.existing_ira_transfer && !conditionalParameters?.existing_employer_plan_rollover && !conditionalParameters?.new_ira_contribution) {
            showMinCashBalanceCheckbox = true;
        }
        
        return showMinCashBalanceCheckbox;
    }

    const showNotEnoughProjectedCashWarning = ( investmentAmount ?: number, formData?:initialInvestmentConditionalParameters) => {
        let showNotEnoughProjectedCashWarning = false; 

        if(formData === undefined || investmentAmount === undefined){
            return showNotEnoughProjectedCashWarning;
        }
        let transfer1Amount = formData.ira_cash_amount_1 ? +formData.ira_cash_amount_1 : 0;
        let transfer2Amount = formData.ira_cash_amount_2 ? +formData.ira_cash_amount_2 : 0; 
        let rollover1Amount = formData.employer_cash_amount_1 ? +formData.employer_cash_amount_1 : 0; 
        let rollover2Amount = formData.employer_cash_amount_2 ? +formData.employer_cash_amount_2 : 0; 
        let contributionAmount = formData.new_contribution_amount ? +formData.new_contribution_amount : 0; 
        
        let projectedAvailableCash = transfer1Amount + transfer2Amount + rollover1Amount + rollover2Amount + contributionAmount;

        if (!showMinCashBalanceCheckbox(formData) && (projectedAvailableCash < (investmentAmount + 250))) {
            showNotEnoughProjectedCashWarning = true; 
        }
        
        return showNotEnoughProjectedCashWarning;
    }

    const validateFields = (e: any) => {
        if (showNotEnoughProjectedCashWarning(formData.investment_amount, conditionalParameters)) {
            setShowErrorToast(true); 
            return;
        }
        saveInitialInvestmentPage(sessionId, formData);
        updateMenuSections('is_investment_details_page_valid', true);
        setShowErrorToast(false);
    }

    useEffect(() => {
        showErrorToast();
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
        }
        return className;
    };

    const showErrorToast = () => {
        let errorsArr = Object.keys(errors);
        if (errorsArr.length > 0) {
            setShowErrorToast(true);
        }
    }

    return (
        <IonContent className='ion-padding'>
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
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
                        <IonItem className={showError('initial_investment_type')}>
                            <Controller name='initial_investment_type' control={control} as={
                                <IonSelect value={formData.initial_investment_type} name='initial_investment_type' interface='action-sheet'>
                                    {investmentTypesArr.map((investmentType, index) => (
                                        <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value;
                              }} rules={{required:true}}/>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                            <IonLabel>{displayEntityNameLabel(formData.initial_investment_type)}</IonLabel>
                            <IonItem className={showError('initial_investment_name')}>
                                <Controller name='initial_investment_name' control={control} as={
                                    <IonInput name='initial_investment_name' value={formData.initial_investment_name}/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required:true}}/>
                            </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Contact Person
                        </IonLabel>
                        <IonItem className={showError('investment_contact_person')}>
                            <Controller name='investment_contact_person' control={control} as={
                                <IonInput name='investment_contact_person' value={formData.investment_contact_person}/>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value;
                              }} rules={{required:true}} />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Contact Phone
                        </IonLabel>
                        <IonItem className={showError('investment_contact_person_phone')}>
                            <Controller name='investment_contact_person_phone' control={control} as={
                                <IonInput type='number' name='investment_contact_person_phone' value={formData.investment_contact_person_phone} placeholder='(555)555-5555' />
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value;
                              }} rules={{required:true}} />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Investment Amount</IonLabel>
                        <IonItem className={showError('investment_amount')}>
                            <Controller name='investment_amount' control={control} as={
                                <IonInput type='number' value={formData.investment_amount} name='investment_amount'/>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required:true}} />
                        </IonItem>
                    </IonCol>
                </IonRow>
                {showMinCashBalanceCheckbox(formData) && (
                    <IonRow>
                        <IonCol>
                            <Controller name='hasReadMinCashBal' control={control} as={
                                <IonCheckbox onIonChange={updateForm} className={showError('hasReadMinCashBal')} name='hasReadMinCashBal'></IonCheckbox> 
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.checked;
                              }} rules={{required:true, validate: (value) => {
                                  return (value === true);
                              } }}/>
                                &nbsp; 
                            <IonText className='ion-padding-left'>
                                Midland has a minimum cash balance requirement of $250 which cannot be included in the investment amount. *   
                            </IonText>
                        </IonCol>
                    </IonRow>
                )}
                {showNotEnoughProjectedCashWarning(formData.investment_amount, conditionalParameters) &&
                (
                    <IonRow className='well'>
                        <IonCol>
                        <p> Your indicated investment amount is less than your projected available cash.  Please alter your investment amount or revisit your transfer, rollover, or contribution request on the left-hand side. Most clients transfer over enough excess cash to cover at least 3 years of administrative fees or 10% of the account value.</p> 
                        </IonCol>
                    </IonRow>
                )}
            </IonGrid>
            </form>
        </IonContent>
    )
}

export default InitialInvestment; 