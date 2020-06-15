import React, {useState, useEffect} from 'react';
import { SessionApp, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonButton, IonItem, IonLabel, IonInput } from '@ionic/react';
import {chargeCreditCard} from '../helpers/CalloutHelpers'

const PaymentInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        //creditCardNumber: '4007000000027',
        //expirationDateString: '10/25'
        creditCardNumber: '',
        expirationDateString: ''
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            console.log(prevState);
            return {...prevState, [e.target.name]:newValue}});
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
                        <IonInput value={formData.creditCardNumber} onIonChange={updateForm}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Expiration Date: </IonLabel>
                        <IonInput value={formData.expirationDateString} onIonChange={updateForm}></IonInput>
                    </IonItem>
                </IonRow>
                <IonRow>
                    <IonButton color="primary" onClick={() => chargeCreditCard(formData)}>Submit & Proceed</IonButton>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}

export default PaymentInformation;