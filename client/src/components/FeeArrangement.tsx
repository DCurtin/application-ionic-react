import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {SessionApp, feeArrangementForm, showErrorToast, reValidateOnUnmmount} from '../helpers/Utils';
import { IonContent, IonRow, IonCol, IonGrid, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput, IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {getFeeArrangementPage, saveFeeArangementPage} from '../helpers/CalloutHelpers';

const FeeArrangement: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast, setShowSpinner}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, setValue, formState} = useForm({
        mode: 'onChange'
    });

    const [formData, setFormData] = useState<feeArrangementForm>({
        initial_investment_type: '',
        fee_schedule: '',
        payment_method:'',
        cc_number: '', 
        cc_exp_date: ''
    });

    useEffect(()=>{
        if(sessionId !== '')
        {
            setShowSpinner(true);
            getFeeArrangementPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    setShowSpinner(false);
                    return;
                }
                ImportForm(data);
                setShowSpinner(false);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let importedForm : feeArrangementForm = data
        setFormData(importedForm);
        for (var fieldName in data) {
            setValue(fieldName, data[fieldName])
        }
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveFeeArangementPage(sessionId, formData);
      })
    },[formData])

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        console.log(`${e.target.name} is ${e.target.value}`)
        setFormData(previousState =>({
            ...previousState,
              [e.target.name]: newValue
            }));
    }

    const validateFields = (e:any) => {
        saveFeeArangementPage(sessionId, formData);
        updateMenuSections('is_fee_arrangement_page_valid', true);
        setShowErrorToast(false);   
    }

    useEffect(() => {
        showErrorToast(errors, setShowErrorToast);
        return () => reValidateOnUnmmount(errors, updateMenuSections, 'is_fee_arrangement_page_valid');
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
                        <p>
                        When you choose to work with Midland Trust, you can rest assured you are receiving an exceptional value. Our commitment is to provide the absolute best service at the best possible price. Our fees are flat and up-front, so you never have to worry about any hidden fees.
                        </p>
                        {formData.initial_investment_type !== 'Futures/Forex' &&  
                        (<p>
                            Below, you will choose the fee agreement that works best for you: <br/>
                            Option 1 “Asset Based” - Fee based on the number of assets in your account
                            Option 2 “Value Based” - Fee based on the total value of your account
                        </p>)}
                        <p>

                            Please review our Fee Schedule and determine which option is best suited for your account. On an annual basis, your Midland administrative fees will be billed in the month that your account was opened. You will be billed for any non-recurring requests, such as new purchases, wire transfers, and overnight mail when it is processed.                    
                        </p>
                        <p>
                            Deducting your account remains the easiest way to pay your fees. Our clients typically transfer in enough cash to cover Midland’s fees for as long as they plan to hold their investment.
                        </p>
                        <a target="_blank" href="https://www.midlandtrust.com/wp-content/uploads/2018/05/Fee-Schedule.pdf" >Click here to view our Fee Schedule</a>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Fee Payment Election
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Select fee agreement
                        </IonLabel>
                        <IonItem className={showError('fee_schedule')}>
                            <Controller name='fee_schedule' control={control} as={
                                <IonSelect interface='action-sheet' value={formData.fee_schedule} name='fee_schedule'>
                                    <IonSelectOption value='Asset Based ($295)'>
                                    Option 1 - Asset Based
                                    </IonSelectOption>
                                    <IonSelectOption value='Value Based'>Option 2 - Value Based</IonSelectOption>
                                </IonSelect>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value;
                              }} rules={{required: true}}  /> 
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Payment Method for Annual Asset Administration
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <IonItem className={showError('payment_method')}>
                                <Controller name='payment_method' control={control} as={
                                    <IonSelect interface='action-sheet' value={formData.payment_method} name='payment_method'>
                                        <IonSelectOption value='Account'>Deduct My Account</IonSelectOption>
                                        <IonSelectOption value='Credit Card'>Credit Card</IonSelectOption>
                                    </IonSelect>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonLabel>
                    </IonCol>
                </IonRow>
                {formData.payment_method == 'Credit Card' &&  <React.Fragment>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Credit Card Number
                            </IonLabel>
                            <IonItem className={showError('cc_number')}>
                                <Controller name='cc_number' control={control} as={
                                    <IonInput type='number' name='cc_number' value={formData.cc_number}/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel> Expiration Date</IonLabel>
                            <IonItem className={showError('cc_exp_date')}>
                                <Controller name='cc_exp_date' control={control} as={
                                    <IonInput type='date' value={formData.cc_exp_date} name='cc_exp_date'/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}} />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    </React.Fragment>}
            </IonGrid>
            </form>
        </IonContent>
    )
}

export default FeeArrangement;