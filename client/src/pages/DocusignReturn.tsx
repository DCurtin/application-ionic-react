import React, {useState, useEffect} from 'react';
import { IonPage, IonHeader, IonThumbnail, IonImg, IonToolbar, IonTitle, IonContent, IonButton, IonSpinner } from '@ionic/react';

const DocusignReturn: React.FC = () => {
    const [signatureCardUrl, setSignatureCardUrl] = useState(''); 
    const [showLoadingUrlSpinner, setShowLoadingUrlSpinner] = useState(true); 

    useEffect(() => {
        setTimeout(() => { setShowLoadingUrlSpinner(false)}, 2000);
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
                {
                    showLoadingUrlSpinner ? (<IonSpinner />) : (
                        <div>
                            <a href={signatureCardUrl}>
                                <IonButton>
                                    Download My Signature Document
                                </IonButton>
                            </a>
                        </div>
                    )
                }
                
            </IonContent>
        </IonPage>
    )
}

export default DocusignReturn; 