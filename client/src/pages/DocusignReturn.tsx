import React, {useEffect, useState} from 'react';
import { FormData } from '../helpers/Utils';
import { IonPage, IonHeader, IonThumbnail, IonImg, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonLoading } from '@ionic/react';
import {handleDocusignReturn, downloadPenSignDocs} from '../helpers/CalloutHelpers'
import { useParams, useLocation } from 'react-router';

const DocusignReturn: React.FC = () => {
    const {sessionId} = useParams<{ sessionId: string, event: string}>();
    const [downloadUrl, setDownloadUrl] = useState(''); 

    const [formData, setFormData] = useState<FormData>({
        docusignAttempts: '',
        docusignUrl: '', 
        accountType: '',
        showSpinner: false,
        docusignResult: ''
    });

    let queryStringParams = new URLSearchParams(useLocation().search);
    let docusignEvent = (queryStringParams.get('event') || '{}');

    useEffect(() => {    
        setFormData(prevState => {return {...prevState, showSpinner: true, docusignResult: docusignEvent}});
        handleDocusignReturn(sessionId, formData.docusignResult).then((response : any) => {
            setFormData(prevState => {return {...prevState, docusignAttempts: response.docusignAttempts, docusignUrl: response.docusignUrl, accountType: response.accountType}});
            console.log('docusign ' + docusignEvent);
            if (docusignEvent === 'signing_complete') {
                downloadPenSignDocs(sessionId, docusignEvent).then((response : any) => {
                    setDownloadUrl(response);
                    setFormData(prevState => {return {...prevState, showSpinner:false}});
                })  
            }
        })    
    },[])

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
                {formData.accountType === '' && 
                    <h3 color='primary'>
                        LOADING SIGNATURE DOCUMENTS...
                    </h3>
                }
                {formData.docusignResult === 'signing_complete' && formData.docusignAttempts === 0 &&
                    <>
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
                    </>
                }
                <IonLoading isOpen={formData.showSpinner} message={'Loading Signature Document...'} spinner="lines"></IonLoading>
                {downloadUrl !== '' &&
                    <IonRow>
                        <IonCol>
                            <a className="btn btn-primary" href={downloadUrl} download = 'Midland_Application_Documents.pdf'>
                                <IonButton>Download My Signature Document</IonButton>
                            </a>
                        </IonCol>    
                    </IonRow>
                }
            </IonContent>
        </IonPage>
    )
}

export default DocusignReturn; 