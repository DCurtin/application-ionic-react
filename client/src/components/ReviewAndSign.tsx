import React, {useState, useEffect} from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonCol, IonRow, IonButton, IonLoading } from '@ionic/react';
import {getESignUrl} from '../helpers/CalloutHelpers';
import axios from 'axios'; 


const ReviewAndSign : React.FC<SessionApp> = ({sessionId, setSessionId}) => {
        const [docusignSignAttempts, setDocusignSignAttempts] = useState(0);
        const [docusignUrl, setDocusignUrl] = useState(''); 
        useEffect(() => {
            getESignUrl(sessionId).then((data) =>
            {
                let url = data.eSignUrl;
                setDocusignUrl(url);
            }
            ).catch(() =>
            {
                setDocusignUrl('/docusignReturn')
            })
        },[sessionId])

        useEffect(() => {
            axios.get('/getPenSignDoc').then((res) => {

            })
        },[])

        return (
        <IonContent className='ion-padding'>
            <IonGrid>
                {docusignSignAttempts < 2 && (
                    <React.Fragment>
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
                        <IonLoading isOpen={docusignUrl === ''} message={'Loading Signing Information...'} spinner="lines"></IonLoading>
                        {docusignUrl !== '' &&
                            <IonRow>
                                <IonCol>
                                    <a className="btn btn-primary" href={docusignUrl}>
                                        <IonButton>Proceed to E-Signature</IonButton>
                                    </a>
                                </IonCol>    
                            </IonRow>
                        }
                    </React.Fragment>
                )}
                {docusignSignAttempts >= 2 && (
                    <React.Fragment>
                        <IonRow className='well'>
                            <IonCol>
                                <span>
                                    <b>Whoops!  Midland was unable to verify your identity.</b>
                                <br/>
                                <br/>

                                As a financial institution, Midland is required to verify your identity.  During the application process, you were unable to answer some (or all) of the identity verification questions.

                                Because you were unable to answer the identity verification questions, you will need to print your application by <a href="">clicking here</a>.
                                <br/>
                                Be sure to physically sign your application where needed and return to Midland with a copy of a valid government issued photo ID as well.  The application, ID, and IRA statement (if transferring funds from another custodian) can all be uploaded securely at
                                <br/>
                                <a href="https://www.midlandira.com/secure-upload/">https://www.midlandira.com/secure-upload/</a>
                                <br/>
                                <br/>
                                You may also fax your application to 239-466-5496 or mail it to:
                                <br/>PO Box 07520
                                <br/>  Fort Myers, FL 33919.
                                <br/><br/>
                                Thank you for your interest in opening an account with Midland.  Once received, Midland's new account team will review your application and a knowledgeable dedicated representative will reach out to you.  We look forward to a lasting relationship. Feel free to contact Midland at 866-839-0429 if you need anything at all.
                                <br/>
                            </span>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <a className="btn btn-primary" href={docusignUrl}>
                                    <IonButton>
                                    Download My Signature Document
                                    </IonButton>
                                </a>
                            </IonCol>
                        </IonRow>
                    </React.Fragment>
                )}
            </IonGrid>
        </IonContent>
    )
}

export default ReviewAndSign; 