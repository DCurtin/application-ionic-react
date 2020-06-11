import React, {useState, useEffect} from 'react';
import {SessionApp} from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonButton } from '@ionic/react';

const PaymentInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
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
                    <IonButton color="primary">Submit & Proceed</IonButton>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}

export default PaymentInformation;