import React, {useEffect, useState} from 'react';
import { FormData } from '../helpers/Utils';
import { IonPage, IonHeader, IonThumbnail, IonImg, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonLoading } from '@ionic/react';
import {handleDocusignReturn, downloadPenSignDocs} from '../helpers/CalloutHelpers'
import { useParams, useLocation } from 'react-router';

const DocusignReturn: React.FC = () => {
    const {sessionId} = useParams<{ sessionId: string, event: string}>();
    const location = useLocation();
    const SIGNING_COMPLETE = 'signing_complete';
    const ID_CHECK_FAILED = 'id_check_failed';
    
    const [formData, setFormData] = useState<FormData>({
        docusignAttempts: '',
        docusignUrl: '', 
        accountType: '',
        docusignResult: '',
        downloadUrl: '',
        showSpinner: false,
        errorMsg: ''
    });

    useEffect(() => { 
        const searchParams = new URLSearchParams(location.search);
        const docusignResult = searchParams.get('event') || '{}';
        setFormData(prevState => {return {...prevState, showSpinner: true, docusignResult: docusignResult}});
        
        handleDocusignReturn(sessionId, docusignResult).then((response : any) => {
            setFormData(prevState => {return {...prevState, docusignAttempts: response.docusignAttempts, docusignUrl: response.docusignUrl, accountType: response.accountType}});
            if (shouldDownloadPenSignDocOnPageLoad(docusignResult, response.docusignAttempts)) {
                downloadPenSignDocsAfterEsignSuccess(sessionId, docusignResult);    
            }
            else if (docusignResult === ID_CHECK_FAILED && response.docusignAttempts === 1) {
                setFormData(prevState => {return {...prevState, showSpinner: false}});    
            }
        }).catch(function(error: any) {
            setFormData(prevState => {return {...prevState, errorMsg:'Error preparing the final application steps.', showSpinner: false}});     
        })
    },[])

    const downloadPenSignDocsAfterEsignSuccess = (formData: any, docusignResult: string) => {
        downloadPenSignDocs(sessionId, docusignResult).then((response : any) => {
            setFormData(prevState => {return {...prevState, downloadUrl: response, showSpinner:false}});
        }).catch(function(error: any) {
            setFormData(prevState => {return {...prevState, errorMsg:'Unable to download the signature document.', showSpinner: false}});           
        })
    }

    const downloadFullSigningDoc = (formData: any) => {
        const searchParams = new URLSearchParams(location.search);
        const docusignResult = searchParams.get('event') || '{}';
        setFormData(prevState => {return {...prevState, showSpinner: true}});

        downloadPenSignDocs(sessionId, docusignResult).then((response : any) => {
            const link = document.createElement('a');
            link.href = response;
            link.setAttribute('download', 'Midland_Application_Documents.pdf');
            document.body.appendChild(link);
            link.click();
            setFormData(prevState => {return {...prevState, showSpinner:false}});
        })      
    }

    const shouldDownloadPenSignDocOnPageLoad = (docusignResult: string, docusignAttempts: number) => {
        return docusignResult === SIGNING_COMPLETE || (docusignResult === ID_CHECK_FAILED && docusignAttempts >= 2);
    }

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
                {formData.errorMsg !== '' &&
                    <IonRow>
                        <p>
                            Error: {formData.errorMsg}
                        </p>
                    </IonRow>
                }
                {formData.docusignResult === SIGNING_COMPLETE && formData.accountType.includes('401') === false &&
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
                {formData.docusignResult === SIGNING_COMPLETE && formData.accountType.includes('401') &&
                    <>
                        <h3 color='primary'>
                            ONLINE APPLICATION: COMPLETED
                        </h3>
                        <p>
                            <br/>
                            <b>E-SIGNATURE COMPLETE:</b> Thank you for completing the electronic signing of your new account documents! Midland’s new account team will review your application and reach out to you within 1 business day.
                        </p>
                        <p>
                            Please visit our website at <a href="https://midlandtrust.com">https://midlandtrust.com</a>
                        </p>
                    </>
                }
                {formData.docusignResult === ID_CHECK_FAILED && formData.docusignAttempts === 1 &&
                    <>
                        <b>Whoops!  Midland was unable to verify your identity.</b>
                        <br/>
                        <br/>

                        As a financial institution, Midland is required to verify your identity.  During the application process, you were unable to answer some (or all) of the identity verification questions.  Midland realizes that some of the questions can be challenging from time to time, so Midland will allow you to try again one additional time.

                        If you would like to attempt to verify your identity a second time through the verification questions, {/*<apex:outputLink value="{!DocusignUrl}">&nbsp;click here.</apex:outputLink>*/}
                        <br/>
                        <br/>
                        {formData.accountType.includes('401') === false &&
                            <>
                                You may also skip the verification questions / electronic submission and print your application instead by clicking the download button below. If you decide to skip the verification questions, be sure to physically sign your application where needed and return to Midland with a copy of a valid government issued photo ID as well.  The application, ID, and IRA statement (if transferring funds from another custodian) can all be uploaded securely at
                                <br/>
                                <a href="https://www.midlandira.com/secure-upload">https://www.midlandira.com/secure-upload/</a>
                                <br/>
                                <br/>
                                You may also fax your application to 239-466-5496 or mail it to:                    <br/>
                                PO Box 07520 <br/> Fort Myers, FL 33919.
                                <br/>
                                <br/>
                                Thank you for your interest in opening an account with Midland.  Once received, Midland's new account team will review your application and a knowledgeable dedicated representative will reach out to you.
                                We look forward to a lasting relationship. Feel free to contact Midland at 866-839-0429 if you need anything at all.
                                <br/>
                            </>
                        }
                        <p>
                            <IonButton color="primary" href={formData.docusignUrl}>Proceed to E-Signature</IonButton>
                        </p>
                        <p>
                            <IonButton color="primary" onClick={() => downloadFullSigningDoc(formData)}>Download My Signature Document</IonButton>
                        </p>
                    </>
                }
                {formData.docusignResult === ID_CHECK_FAILED && formData.docusignAttempts >= 2 && formData.accountType.includes('401') === false &&
                    <>
                        <b>Whoops!  Midland was unable to verify your identity.</b>
                        <br/>
                        <br/>
                        {formData.accountType.includes('401') === false &&
                            <>
                                As a financial institution, Midland is required to verify your identity.  During the application process, you were unable to answer some (or all) of the identity verification questions.
                
                                Because you were unable to answer the identity verification questions, you will need to print your application by clicking the download button below.
                                <br/><br/>
                                Be sure to physically sign your application where needed and return to Midland with a copy of a valid government issued photo ID as well.  The application, ID, and IRA statement (if transferring funds from another custodian) can all be uploaded securely at
                                <br/>
                                <a href="https://www.midlandira.com/secure-upload/">https://www.midlandira.com/secure-upload/</a>
                                <br/>
                                <br/>
                                You may also fax your application to 239-466-5496 or mail it to:
                                <br/>PO Box 07520
                                <br/>  Fort Myers, FL 33919.
                                <br/><br/>
                                <p>
                                Thank you for your interest in opening an account with Midland.  Once received, Midland's new account team will review your application and a knowledgeable dedicated representative will reach out to you.  We look forward to a lasting relationship. Feel free to contact Midland at 866-839-0429 if you need anything at all.
                                </p>
                            </>
                        }
                        {formData.accountType.includes('401') &&
                            <>
                                <p>
                                    As a financial institution, Midland is required to verify your identity. During the application process, you were unable to answer some (or all) of the identifying verification questions. Please contact our new accounts team for assistance completing your application. 
                                </p>
                                <br/><br/>
                                <p>
                                    Please call 239.333.1032 Option 2.
                                </p>
                            </>
                        }
                    </>
                }
                {formData.docusignResult.includes('session_timeout') || formData.docusignResult.includes('ttl_expired') &&
                    <>
                        <h2>Whoops! We see that the session has timed out.</h2>
                        <p>
                            <br/>
                            Your signing session has timed out. Click here to pick up where you left off.
                        </p>
    
                        <p>
                            <a href="{!$Page.Application + '?id=' + Online_Application__c.Id}">Go Back To My Application</a>
                        </p>
                    </>
                }          
                {(formData.docusignResult.includes('decline') || formData.docusignResult.includes('cancel')) &&    
                    <>
                        <h2>Whoops! Something went wrong!</h2>
                        <p>
                            <br/>
                            You have chosen to decline providing an electronic signature for this application. Our office will be contacting you within 1 business day to provide alternate signature options. If you did not intend to decline, you can click here to return to the application and e-sign the application documents.
                        </p>
                        <p>
                            <a href="{!$Page.Application + '?id=' + Online_Application__c.Id}">Go Back To My Application</a>
                        </p>
                    </>
                }        
                <IonLoading isOpen={formData.showSpinner} message={'Loading Signature Document...'} spinner="lines"></IonLoading>
                {formData.downloadUrl !== '' && (formData.docusignResult === SIGNING_COMPLETE || (formData.docusignResult === ID_CHECK_FAILED && formData.docusignAttempts >= 2)) &&
                    <IonRow>
                        <IonCol>
                            <a className="btn btn-primary" href={formData.downloadUrl} download = 'Midland_Application_Documents.pdf'>
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