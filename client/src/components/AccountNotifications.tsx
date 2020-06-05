import React from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';

const AccountNotifications: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    return(
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow>
                    <IonCol className='well'>
                    <p><b>MIDLAND360 is the Midland Premier Online Access System:</b> Midland provides every account holder with 24/7 secure, online access to your account(s). You will find this system provides a truly 360 degree view of your account including account balances, pending/posted transactions, account statements, ability to submit bill pay and other transactions, and much more! Within 1 business day of receiving this application, you will receive an email with instructions on how to access your account online. <a href="https://www.midlandira.com/midland360" target="_blank">Click here for more detailed information about MIDLAND360</a></p>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default AccountNotifications; 