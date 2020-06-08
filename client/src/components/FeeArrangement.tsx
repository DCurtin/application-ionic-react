import React, {useState, useEffect} from 'react';
import {SessionApp} from '../helpers/Utils';
import { IonContent, IonRow, IonCol, IonGrid, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';

const FeeArrangement: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    useEffect(() => {
        // TO DO : 
    })
    const [formData, setFormData] = useState({
        initial_investment_type__c: '',
        fee_schedule__c: '',
        payment_method__c:'',
        cc_number__c: '', 
        cc_exp_date__c: ''
    });

    const updateForm = (e:any) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }
    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                        <p>
                        When you choose to work with Midland Trust, you can rest assured you are receiving an exceptional value. Our commitment is to provide the absolute best service at the best possible price. Our fees are flat and up-front, so you never have to worry about any hidden fees.
                        </p>
                        {formData.initial_investment_type__c !== 'Futures/Forex' &&  
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
                        <IonSelect value={formData.fee_schedule__c} name='fee_schedule__c' onIonChange={updateForm}>
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
                            <IonSelect value={formData.payment_method__c} name='payment_method__c' onIonChange={updateForm}>
                                <IonSelectOption value='Account'>Deduct My Account</IonSelectOption>
                                <IonSelectOption value='Credit Card'>Credit Card</IonSelectOption>
                            </IonSelect>
                        </IonLabel>
                    </IonCol>
                </IonRow>
                {formData.payment_method__c == 'Credit Card' && (
                    <IonRow>
                        <IonCol>
                            <IonLabel>
                                Credit Card Number
                            </IonLabel>
                            <IonInput name='cc_number__c' value={formData.cc_number__c} onIonChange={updateForm}></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonLabel> Expiration Date</IonLabel>
                            <IonInput type='date' value={formData.cc_exp_date__c} name='cc_exp_date__c' onIonChange={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                )}
            </IonGrid>
        </IonContent>
    )
}

export default FeeArrangement;