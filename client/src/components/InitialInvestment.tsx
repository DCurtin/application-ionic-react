import React, {useState, useEffect} from 'react';
import { SesssionAppExtended, initialInvestmentTypes, initialInvestmentForm , initialInvestmentConditionalParameters, showErrorToast, reValidateOnUnmmount} from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput, IonCheckbox } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {getInitialInvestmentPage, saveInitialInvestmentPage, saveWelcomePage} from '../helpers/CalloutHelpers';
import { Console } from 'console';

const InitialInvestment : React.FC<SesssionAppExtended> = ({sessionId, setShowErrorToast, setShowSpinner, updateMenuSections, formRef, welcomePageFields, setWelcomePageFields}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, setValue, formState}  = useForm({
        mode: 'onChange'
    });

    let investmentTypesArr = initialInvestmentTypes.filter(investmentType => (investmentType !== `I'm Not Sure`));

    const [formData, setFormData] = useState<Partial<initialInvestmentForm>>({initial_investment_name:''});
    const [isAfterGettingData, setIsAfterGettingData] = useState(false);

    const [conditionalParameters, setconditionalParameters] = useState<initialInvestmentConditionalParameters>();

    useEffect(()=>{
        if(sessionId !== '')
        {
            setShowSpinner(true);
            getInitialInvestmentPage(sessionId).then((data:any)=>{
                if(data.parameters){
                    ImportParamters(data);
                }
                if(data.formData){
                   ImportForm(data)
                }
            }).finally(()=>{
                setShowSpinner(false)
            })
        }
    },[sessionId])

    function ImportParamters(data: any){
        let conditionalParameters : initialInvestmentConditionalParameters = data.parameters;
        setconditionalParameters(conditionalParameters);
    }
    
    function ImportForm(data : any){
        let formData : initialInvestmentForm = data.formData;
        setFormData(formData);
        setIsAfterGettingData(true);
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveInitialInvestmentPage(sessionId, formData).then(()=>{
            saveWelcomePage(sessionId,welcomePageFields);
        })
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

    const showMinCashBalanceCheckbox = (initial_investment_type:string) => {
        let showMinCashBalanceCheckbox = false; 
        if (initial_investment_type == 'Futures/Forex'){
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

    const showNotEnoughProjectedCashWarning = ( investmentAmountArg ?: number, formParameters?:initialInvestmentConditionalParameters) => {
        let showNotEnoughProjectedCashWarning = false; 
        let investmentAmount = investmentAmountArg ? +investmentAmountArg : 0
        if(formParameters === undefined){
            return showNotEnoughProjectedCashWarning;
        }
        let transfer1Amount = formParameters.ira_cash_amount_1 ? +formParameters.ira_cash_amount_1 : 0;
        let transfer2Amount = formParameters.ira_cash_amount_2 ? +formParameters.ira_cash_amount_2 : 0; 
        let rollover1Amount = formParameters.employer_cash_amount_1 ? +formParameters.employer_cash_amount_1 : 0; 
        let rollover2Amount = formParameters.employer_cash_amount_2 ? +formParameters.employer_cash_amount_2 : 0; 
        let contributionAmount = formParameters.new_contribution_amount ? +formParameters.new_contribution_amount : 0; 
        
        let projectedAvailableCash = transfer1Amount + transfer2Amount + rollover1Amount + rollover2Amount + contributionAmount;
        if ((!showMinCashBalanceCheckbox(welcomePageFields.investment_type)) && (projectedAvailableCash < (+250 + +investmentAmount)) ) {
            showNotEnoughProjectedCashWarning = true; 
        }
        
        return showNotEnoughProjectedCashWarning;
    }

    const validateFields = (e: any) => {
        if (showNotEnoughProjectedCashWarning(formData.investment_amount, conditionalParameters)) {
            setShowErrorToast(true); 
            return;
        }
        saveInitialInvestmentPage(sessionId, formData).then(()=>{
            saveWelcomePage(sessionId,welcomePageFields);
        })
        updateMenuSections('is_investment_details_page_valid', true);
        setShowErrorToast(false);
    }

    useEffect(() => {
        showErrorToast(errors, setShowErrorToast);
        return () => reValidateOnUnmmount(errors, updateMenuSections, 'is_investment_details_page_valid');
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
        }
        return className;
    };

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
                        <IonItem className={showError('investment_type')}>
                            <Controller name='investment_type' control={control} as={
                                <IonSelect value={welcomePageFields.investment_type} name='investment_type' interface='action-sheet'>
                                    {investmentTypesArr.map((investmentType, index) => (
                                        <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                setWelcomePageFields({ ...welcomePageFields,investment_type: selected.target.value})
                                console.log(welcomePageFields)
                                //updateForm(selected);
                                return selected.detail.value;
                              }} rules={{required:true}} defaultValue={welcomePageFields.investment_type}/>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                            <IonLabel>{displayEntityNameLabel(welcomePageFields.investment_type)}</IonLabel>
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
                {showMinCashBalanceCheckbox(welcomePageFields.investment_type) && (
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