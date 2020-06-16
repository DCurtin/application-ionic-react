import React, {useState, useEffect} from 'react';
import { SessionApp, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonButton, IonItem, IonLabel, IonInput } from '@ionic/react';
import {chargeCreditCard} from '../helpers/CalloutHelpers'

const PaymentInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        creditCardNumber: '',
        expirationDateString: '',
        creditCardStatus: ''
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            console.log(prevState);
            return {...prevState, [e.target.name]:newValue}});
    }

    const processCreditCard = (formData: any) => {
        console.log('starting credit card call');
        chargeCreditCard(formData,sessionId).then(function(response: any) {
            console.log('response before setFormData ' + response.Status);
            setFormData(response.Status);
            console.log('formData.creditCardStatus ' + formData.creditCardStatus);
        })
    }
    
    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                        <p>
                        Midland charges your credit card for today's non-refundable fee(s) listed below. Future annual fees will be charged to the same card unless notified otherwise.
                        </p>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                        <IonText color='primary'>
                            $50 Setup Fee
                        </IonText>
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonItem>
                        <IonLabel>Credit Card Number: </IonLabel>
                        <IonInput name='creditCardNumber' value={formData.creditCardNumber} onIonChange={updateForm}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Expiration Date: </IonLabel>
                        <IonInput name='expirationDateString' value={formData.expirationDateString} onIonChange={updateForm} placeholder='10/2025'></IonInput>
                    </IonItem>
                </IonRow>
                <IonRow>
                    <IonButton color="primary" onClick={() => processCreditCard(formData)}>Submit & Proceed</IonButton>
                </IonRow>
                {formData.creditCardStatus === 'Completed' &&
                    <IonRow>
                        Success!
                    </IonRow>
                }
            </IonGrid>
        </IonContent>
    );
}

export default PaymentInformation;