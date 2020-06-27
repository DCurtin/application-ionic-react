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
                {formData.docusignResult === 'signing_complete' && formData.accountType.includes('401') === false &&
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
                {formData.docusignResult === 'signing_complete' && formData.accountType.includes('401') &&
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
                {formData.docusignResult === 'id_check_failed' && formData.docusignAttempts === 0 &&
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
                                You may also skip the verification questions / electronic submission and print your application instead by <a href="services/apexrest/ApplicationAttachment/getAttachmentDoc?applicationId={!appl.Id}&token={!appl.Token__c}">clicking here</a>. If you decide to skip the verification questions, be sure to physically sign your application where needed and return to Midland with a copy of a valid government issued photo ID as well.  The application, ID, and IRA statement (if transferring funds from another custodian) can all be uploaded securely at
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
                    {/*<p>
                        <a class="btn btn-primary" href="{!DocusignUrl}">Proceed to E-Signature</a>
                        
                        <apex:outputPanel rendered="{!NOT(CONTAINS(appl.Account_Type__c, '401k'))}">
                            <apex:outputLink styleClass="btn btn-primary" rendered="{!signatureCardAttachmentId != null}" value="services/apexrest/ApplicationAttachment/getAttachmentDoc?applicationId={!appl.Id}&token={!appl.Token__c}">Download My Signature Document</apex:outputLink>
                            <apex:outputText rendered="{!signatureCardAttachmentId == null}" value="">Downloading Signature Document...</apex:outputText>
                            <apex:actionPoller action="{!setSignatureCardAttachmentId}" interval="10"  reRender="docusignFail1" enabled="{!signatureCardAttachmentId == null}" timeout="180000" />
                        </apex:outputPanel>
                    </p>   */}    
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