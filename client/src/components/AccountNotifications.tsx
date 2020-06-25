import React, {useState, useEffect} from 'react';
import { SessionApp, states, accountNotificationsForm } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {getAccountNotificationsPage, saveAccountNotificationsPage} from '../helpers/CalloutHelpers'
const paperStatementOptions = ['e-Statement', 'Mailed Monthly', 'Mailed Quarterly', 'Mailed Annually']

const AccountNotifications: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const history = useHistory();
    const [formData, setFormData] = useState<accountNotificationsForm>({
        statement_option: '', 
        include_interested_party: false,
        first_name: '', 
        last_name: '', 
        email: '', 
        phone:'', 
        mailing_street: '', 
        mailing_city: '',
        mailing_state: '', 
        mailing_zip: '', 
        company_name: '',
        title: '', 
        online_access: false,
        ira_statement_option: ''
    })

    useEffect(()=>{
        if(sessionId !== '')
        {
            getAccountNotificationsPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let importedForm : accountNotificationsForm = data
        setFormData(importedForm);
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveAccountNotificationsPage(sessionId, formData);
      })
    },[formData])

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
                        <IonSelect name='ira_statement_option' value={formData.ira_statement_option} onIonChange={updateForm} interface='action-sheet'>
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
                        <IonSelect value={formData.include_interested_party} name='include_interested_party' onIonChange={updateForm} interface='action-sheet'>
                            <IonSelectOption value={false}>No</IonSelectOption>
                            <IonSelectOption value={true}>
                                Yes
                            </IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                {formData.include_interested_party == true && 
                (
                    <React.Fragment>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    First Name
                                </IonLabel>
                                <IonInput value={formData.first_name} name='first_name' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Last Name
                                </IonLabel>
                                <IonInput value={formData.last_name} name='last_name' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Email
                                </IonLabel>
                                <IonInput value={formData.email} name='email' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>Phone</IonLabel>
                                <IonInput value={formData.phone} name='phone' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonInput value={formData.mailing_street} name='mailing_street' onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    City
                                </IonLabel>
                                <IonInput value={formData.mailing_city} name='mailing_city' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    State
                                </IonLabel>
                                <IonSelect value={formData.mailing_state} name='mailing_state' onIonChange={updateForm} interface='action-sheet'>
                                    {states.map((state, index) => (
                                        <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                        )
                                )}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel> Zip</IonLabel>
                                <IonInput value={formData.mailing_zip} name='mailing_zip' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Company Name
                                </IonLabel>
                                <IonInput value={formData.company_name} name='company_name' onIonChange={updateForm}>
                                </IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Title
                                </IonLabel>
                                <IonInput value={formData.title} name='title' onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Online Access</IonLabel>
                                <IonSelect value={formData.online_access} name='online_access' onIonChange={updateForm} interface='action-sheet'>
                                    <IonSelectOption value={true}>Yes</IonSelectOption>
                                    <IonSelectOption  value={false}>No</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Paper Statement Options
                                </IonLabel>
                                <IonSelect value={formData.statement_option} name='statement_option' onIonChange={updateForm} interface='action-sheet'>
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