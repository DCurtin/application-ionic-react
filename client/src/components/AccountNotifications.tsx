import React, {useState, useEffect} from 'react';
import { SessionApp, states } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
const paperStatementOptions = ['e-Statement', 'Mailed Monthly', 'Mailed Quarterly', 'Mailed Annually']

const AccountNotifications: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    useEffect(() => {

    })
    const [formData, setFormData] = useState({
        statement_option__c: '', 
        interested_party_email_notifications__c: true,
        interested_party_access_level__c: '',
        interested_party_first_name__c: '', 
        interested_party_last_name__c: '', 
        interested_party_email__c: '', 
        interested_party_phone__c:'', 
        interested_party_street__c: '', 
        interested_party_city__c: '',
        interested_party_state__c: '', 
        interested_party_zip__c: '', 
        interested_party_company_name__c: '',
        interested_party_title__c: '', 
        interested_party_online_access__c: false,
        interested_party_ira_statement__c: ''
    })

    const updateForm = (e:any) => {
        setFormData(prevState => {
            let newValue = e.target.value;
            return {...prevState, [e.target.name]: newValue}
        });
    }

    return(
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow>
                    <IonCol className='well'>
                    <p><b>MIDLAND360 is the Midland Premier Online Access System:</b> Midland provides every account holder with 24/7 secure, online access to your account(s). You will find this system provides a truly 360 degree view of your account including account balances, pending/posted transactions, account statements, ability to submit bill pay and other transactions, and much more! Within 1 business day of receiving this application, you will receive an email with instructions on how to access your account online. <a href="https://www.midlandira.com/midland360" target="_blank">Click here for more detailed information about MIDLAND360</a></p>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                        <IonText color='primary'>
                            Account Statements
                        </IonText>
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                    <em>Electronic statements are always provided in your online access. If you would like to receive paper statements in the mail, please select one of the following options. There is a $5 fee per statement mailed.<br/></em>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Paper Statement Options
                        </IonLabel>
                        <IonSelect name='statement_option__c' value={formData.statement_option__c} onIonChange={updateForm}>
                            {paperStatementOptions.map((statementOption, index) => (
                                <IonSelectOption key={index} value={statementOption}>
                                    {statementOption == 'e-Statement' ? 'No Paper Statement' : statementOption}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                        <IonText color='primary'>
                            Third-Party Representative
                        </IonText>
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <em> You can provide another party such as your spouse, financial advisor, or investment manager with access to your account. </em>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>
                        Do you want to provide someone else access to your account? *
                        </IonLabel>
                        <IonSelect value={formData.interested_party_access_level__c} name='interested_party_access_level__c' onIonChange={updateForm}>
                            <IonSelectOption value='None'>No</IonSelectOption>
                            <IonSelectOption value='Interested Party'>
                                Yes
                            </IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                {formData.interested_party_access_level__c == 'Interested Party' && 
                (
                    <React.Fragment>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    First Name
                                </IonLabel>
                                <IonInput value={formData.interested_party_first_name__c} name='interested_party_first_name__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Last Name
                                </IonLabel>
                                <IonInput value={formData.interested_party_last_name__c} name='interested_party_last_name__c' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Email
                                </IonLabel>
                                <IonInput value={formData.interested_party_email__c} name='interested_party_email__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>Phone</IonLabel>
                                <IonInput value={formData.interested_party_phone__c} name='interested_party_phone__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonInput value={formData.interested_party_street__c} name='interested_party_street__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    City
                                </IonLabel>
                                <IonInput value={formData.interested_party_city__c} name='interested_party_city__c' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    State
                                </IonLabel>
                                <IonSelect value={formData.interested_party_state__c} name='interested_party_state__c' onIonChange={updateForm}>
                                    {states.map((state, index) => (
                                        <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                        )
                                )}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel> Zip</IonLabel>
                                <IonInput value={formData.interested_party_zip__c} name='interested_party_zip__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Company Name
                                </IonLabel>
                                <IonInput value={formData.interested_party_company_name__c} name='interested_party_company_name__c' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Title
                                </IonLabel>
                                <IonInput value={formData.interested_party_title__c} name='interested_party_title__c' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Online Access</IonLabel>
                                <IonSelect value={formData.interested_party_online_access__c} name='interested_party_online_access__c' onIonChange={updateForm}>
                                    <IonSelectOption value={true}>Yes</IonSelectOption>
                                    <IonSelectOption  value={false}>No</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Paper Statement Options
                                </IonLabel>
                                <IonSelect value={formData.interested_party_ira_statement__c} name='interested_party_ira_statement__c' onIonChange={updateForm}>
                                    {paperStatementOptions.map((statementOption, index) => (
                                        <IonSelectOption value={statementOption} key={index}>{statementOption}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                    </React.Fragment>
                )}
            </IonGrid>
        </IonContent>
    )
}

export default AccountNotifications; 