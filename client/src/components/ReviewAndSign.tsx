import React, {useState, useEffect} from 'react';
import { SessionApp } from '../helpers/Utils';
import { IonContent, IonGrid, IonCol, IonRow, IonButton, IonLoading } from '@ionic/react';
import {getESignUrl, downloadPenSignDocs} from '../helpers/CalloutHelpers';


const ReviewAndSign : React.FC<SessionApp> = ({sessionId}) => {
    const [docusignUrl, setDocusignUrl] = useState(''); 
    const [downloadUrl, setDownloadUrl] = useState(''); 
    const [showIdCheckError, setShowIdCheckError] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    
    useEffect(() => {

        let sessionId = '27a269e4-2ad9-434f-a9d2-e6cb0d1f97c9';

        console.log('spinner on');
        setShowSpinner(true);
        getESignUrl(sessionId).then((data) => {
            setDocusignUrl(data.eSignUrl);
            setShowSpinner(false);
        }).catch(() => {
            //TODO: ADD A DISTINCTION BETWEEEN OVER 2 DOCUSIGN ATTEMPTS AND A GENERIC ERROR
            setShowIdCheckError(true);
            
            downloadPenSignDocs(sessionId, 'id_check_failed').then((response : any) => {
                setDownloadUrl(response);
                setShowSpinner(false);
            }).catch(function() {
                setDownloadError('Error: Unable to download the signature document.');               
                setShowSpinner(false);
            })
        })
    },[])

    return (
        <IonContent className='ion-padding'>
            <IonLoading isOpen={showSpinner} message={'Loading Signing Information...'} spinner="lines"></IonLoading>
            <IonGrid>
                {showIdCheckError === false && 
                    <>
                        <IonRow className='well'>
                            <IonCol>
                            <span>
                                <b>Congratulations! You have completed the application interview process.</b>
                                <br/>
                                <br/>
                                To begin the e-signature process, click the “Proceed to E-Signature” button below. You will be redirected to Docusign, our electronic signature system partner. Before signing, you will be asked a series of questions to verify your identity.

                                <br/>
                                <br/>
                                When you have completed the signing process through DocuSign, keep your browser open as you will be redirected back to this site to download forms that must be pen signed.
                            </span>
                            </IonCol>
                        </IonRow>
                        {docusignUrl !== '' &&
                            <IonRow>
                                <IonCol>
                                    <a className="btn btn-primary" href={docusignUrl}>
                                        <IonButton>Proceed to E-Signature</IonButton>
                                    </a>
                                </IonCol>    
                            </IonRow>
                        }
                    </>
                }
                {showIdCheckError && 
                    <>
                        <IonRow className='well'>
                            <IonCol>
                                <span>
                                    <b>Whoops!  Midland was unable to verify your identity.</b>
                                <br/>
                                <br/>

                                As a financial institution, Midland is required to verify your identity.  During the application process, you were unable to answer some (or all) of the identity verification questions.

                                Because you were unable to answer the identity verification questions, you will need to print your application by clicking the download button below.
                                <br/>
                                <br/>
                                Be sure to physically sign your application where needed and return to Midland with a copy of a valid government issued photo ID as well.  The application, ID, and IRA statement (if transferring funds from another custodian) can all be uploaded securely at
                                <br/>
                                <a href="https://www.midlandtrust.com/secure-upload/">https://www.midlandtrust.com/secure-upload/</a>
                                <br/>
                                <br/>
                                You may also fax your application to 239-333-1032 or mail it to:
                                <br/>PO Box 07520
                                <br/>  Fort Myers, FL 33919.
                                <br/><br/>
                                Thank you for your interest in opening an account with Midland.  Once received, Midland's new account team will review your application and a knowledgeable dedicated representative will reach out to you.  We look forward to a lasting relationship. Feel free to contact Midland at 866-839-0429 if you need anything at all.
                                <br/>
                            </span>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            {downloadUrl !== '' &&
                                <IonCol>
                                    <a className="btn btn-primary" href={downloadUrl} download = 'Midland_Application_Documents.pdf'>
                                        <IonButton>Download My Signature Document</IonButton>
                                    </a>
                               </IonCol>  
                            }
                            {downloadError &&
                                <IonCol>
                                    {downloadError}
                                </IonCol>  
                            }
                            
                        </IonRow>
                    </>
                }
            </IonGrid>
        </IonContent>
    )
}

export default ReviewAndSign; 