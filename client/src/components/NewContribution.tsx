import React, {useState, useEffect} from 'react';
import { SessionApp, contributionForm } from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonLabel, IonItemDivider, IonText, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import moment from 'moment'; 
import { useHistory } from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import {getContributionPage, saveContributionPage} from '../helpers/CalloutHelpers'

const NewContribution: React.FC<SessionApp> = ({sessionId, formRef, setShowErrorToast, updateMenuSections}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, setValue, getValues, formState} = useForm({
        mode: 'onChange'
    });

    const [formData, setFormData] = useState<contributionForm>({
        new_contribution_amount: 0, 
        tax_year: '',
        name_on_account: '', 
        bank_account_type: '', 
        routing_number: '', 
        account_number: '', 
        bank_name: '', 
        account_type: 'Traditional IRA'
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const validateRoutingNumber = (e:CustomEvent) => {
        let routingNumberInput = e.detail.value;
        updateForm(e);
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

    useEffect(()=>{
        if(sessionId !== '')
        {
            getContributionPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    function ImportForm(data : any){
        let importedForm : contributionForm = data;
        setFormData(importedForm);
        for (var fieldName in data) {
            setValue(fieldName, data[fieldName])
        }
    }
    
    useEffect(()=>{
      return history.listen(()=>{
          saveContributionPage(sessionId, formData);
      })
    },[formData])

    const validateFields = (e: any) => {
        saveContributionPage(sessionId, formData);
        updateMenuSections('is_new_contribution_page_valid', true);
        setShowErrorToast(false);
    }

    useEffect(() => {
        showErrorToast();
        return function onUnmount() {
            if (Object.keys(errors).length > 0) {
                updateMenuSections('is_new_contribution_page_valid', false);
            }
        }
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
                            <IonItem className={showError('new_contribution_amount')}>
                                <Controller control={control} name='new_contribution_amount' as={
                                    <IonInput type='number' name='new_contribution_amount' value={formData.new_contribution_amount}/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonCol>
                        {showTaxYearInput(formData.account_type) && (
                            <IonCol>
                                <IonLabel>
                                    Tax Year
                                </IonLabel>
                                <IonItem className={showError('tax_year')}>
                                    <Controller name='tax_year' control={control} as={
                                        <IonSelect interface='action-sheet' value={formData.tax_year} name='tax_year'>
                                            <IonSelectOption value='Current Year'>Current Year</IonSelectOption>
                                            <IonSelectOption value='Last Year'>
                                                Last Year
                                            </IonSelectOption>
                                        </IonSelect>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                      }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                        )}
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                Name on Account
                            </IonLabel>
                            <IonItem className={showError('name_on_account')}>
                                <Controller name='name_on_account' control={control} as={
                                    <IonInput value={formData.name_on_account} name='name_on_account'/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}} />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonLabel>
                                Bank Account Type
                            </IonLabel>
                            <IonItem className={showError('bank_account_type')}>
                                <Controller name='bank_account_type' control={control} as={
                                    <IonSelect interface='action-sheet' value={formData.bank_account_type} name='bank_account_type'>
                                        <IonSelectOption value='Checkings'>Checkings</IonSelectOption>
                                        <IonSelectOption value='Savings'>Savings </IonSelectOption>
                                    </IonSelect>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                Bank ABA/Routing Number
                            </IonLabel>
                            <IonItem className={showError('routing_number')}>
                                <Controller name='routing_number' control={control} as={
                                    <IonInput type='number' name='routing_number' value={formData.routing_number}/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonLabel>
                                Account Number
                            </IonLabel>
                            <IonItem className={showError('account_number')}>
                                <Controller name='account_number' control={control} as={
                                    <IonInput value={formData.account_number} name='account_number'/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}} />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='6'>
                            <IonLabel>Bank Name</IonLabel>
                            <IonItem className={showError('bank_name')}>
                                <Controller name='bank_name' control={control} as={
                                    <IonInput value={formData.bank_name} name='bank_name' />
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}} />
                            </IonItem>
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
            </form>
        </IonContent>
    );
}
export default NewContribution;