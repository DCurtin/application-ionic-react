import React, {useEffect} from 'react';
import { IonPage, IonHeader, IonThumbnail, IonImg, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import {getPenSignDocs} from '../helpers/CalloutHelpers'
import { useParams, useLocation } from 'react-router';

const DocusignReturn: React.FC = () => {
    const {sessionId} = useParams<{ sessionId: string, event: string}>();

    let queryStringParams = new URLSearchParams(useLocation().search);
    
    useEffect(()=>{
        console.log('sessionId on client: ' + sessionId);
        console.log('event on client: ' + queryStringParams.get('event'));
        
        getPenSignDocs(sessionId).then(function(response: any) {
            console.log('pen sign docs successful on client');
        })   
    })

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonThumbnail slot="start">
                        <IonImg src="../../assets/icon/midlandCrestForDarkBg.png"/>
                    </IonThumbnail>
                    <IonTitle>
                        Docusign Return
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'>
                <h3 color='primary'>
                    ONLINE APPLICATION: IMPORTANT FINAL STEPS
                </h3>
                <p>
                    <br/>
                        <b>E-SIGNATURE COMPLETE:</b> Thank you for completing the electronic signing of your new account documents! Midland’s new account team will review your application and reach out to you within 1 business day.
                </p>
                <p>
                    <b>PEN SIGNATURE PACKET PENDING:</b> There are <u>certain documents</u> that require to be <u>pen signed and returned to us</u> by fax, scan or mail. These documents include your account signature card as well as any applicable transfer forms, power of attorney, etc. Please click the button below to download and print the applicable documents for your account.
                </p>
                
                
            </IonContent>
        </IonPage>
    )
}

export default DocusignReturn; 