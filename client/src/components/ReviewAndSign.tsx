import React from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonCol, IonRow, IonButton } from '@ionic/react';

const ReviewAndSign : React.FC<SessionApp> = ({sessionId, setSessionId}) => {

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    <span>
                         <b>Congratulations! You have completed the application interview process.</b>
                        <br/>
                        <br/>
                        To begin the e-signature process, click the “Proceed to E-Signature” button below. You will be redirected to Docusign, our electronic signature system partner.Before signing, you will be asked a series of questions to verify your identity.

                        <br/>
                        <br/>
                        When you have completed the signing process through DocuSign, keep your browser open as you will be redirected back to this site to download forms that must be pen signed.
                    </span>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton>Proceed to E-Signature</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default ReviewAndSign; 