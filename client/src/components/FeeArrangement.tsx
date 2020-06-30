import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {SessionApp, feeArrangementForm} from '../helpers/Utils';
import { IonContent, IonRow, IonCol, IonGrid, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {getFeeArrangementPage, saveFeeArangementPage} from '../helpers/CalloutHelpers'
import { fingerPrint } from 'ionicons/icons';

const FeeArrangement: React.FC<SessionApp> = ({sessionId, setSessionId, updateMenuSections, formRef}) => {
    const history = useHistory();
    const {register, handleSubmit, watch, errors} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
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
            getFeeArrangementPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let importedForm : feeArrangementForm = data
        setFormData(importedForm);
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveFeeArangementPage(sessionId, formData);
      })
    },[formData])

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const validateFields = (e:any) => {
        saveFeeArangementPage(sessionId, formData);
        updateMenuSections('is_fee_arrangement_page_valid', true)

    }
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
                        <IonSelect interface='action-sheet' value={formData.fee_schedule} name='fee_schedule' onIonChange={updateForm}>
                            <IonSelectOption value='Asset Based ($295)'>
                            Option 1 - Asset Based
                            </IonSelectOption>
                            <IonSelectOption value='Value Based'>Option 2 - Value Based</IonSelectOption>
                        </IonSelect>
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
                            <IonSelect interface='action-sheet' value={formData.payment_method} name='payment_method' onIonChange={updateForm}>
                                <IonSelectOption value='Account'>Deduct My Account</IonSelectOption>
                                <IonSelectOption value='Credit Card'>Credit Card</IonSelectOption>
                            </IonSelect>
                        </IonLabel>
                    </IonCol>
                </IonRow>
                {formData.payment_method == 'Credit Card' && (
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                Credit Card Number
                            </IonLabel>
                            <IonInput name='cc_number' value={formData.cc_number} onIonChange={updateForm}></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonLabel> Expiration Date</IonLabel>
                            <IonInput type='date' value={formData.cc_exp_date} name='cc_exp_date' onIonChange={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                )}
            </IonGrid>
            </form>
        </IonContent>
    )
}

export default FeeArrangement;