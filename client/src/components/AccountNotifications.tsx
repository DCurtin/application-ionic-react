import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import { SessionApp, states, accountNotificationsForm } from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {getAccountNotificationsPage, saveAccountNotificationsPage} from '../helpers/CalloutHelpers'
const paperStatementOptions = ['e-Statement', 'Mailed Monthly', 'Mailed Quarterly', 'Mailed Annually']

const AccountNotifications: React.FC<SessionApp> = ({sessionId, setSessionId, updateMenuSections, formRef, setShowErrorToast}) => {
    const history = useHistory();
    const {register, handleSubmit, watch, errors} = useForm(); 
    let watchAllFields = watch();
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
    //validation
    const validateFields = (data: any, e: any) => {
        updateMenuSections('is_account_notifications_page_valid', true);
        setShowErrorToast(false);
    }

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        console.log(errors);
        let className = errorsArr.includes(fieldName) ? 'danger' : '';
        console.log(watchAllFields);
        if (watchAllFields[fieldName] && !errorsArr.includes(fieldName)){
            className = '';
        }
        return className;
    };

    const showErrorToast = () => {
        let errorsArr = Object.keys(errors);
        if (errorsArr.length > 0) {
            setShowErrorToast(true);
        }
    }

    useEffect(() => {
        showErrorToast();
    }, [errors])
    //validation

    return(
        <IonContent className='ion-padding'>
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
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
                            <IonItem className={showError('ira_statement_option')}>
                                <IonSelect name='ira_statement_option' value={formData.ira_statement_option} onIonChange={updateForm} interface='action-sheet' ref={register({required: true})}>
                                    {paperStatementOptions.map((statementOption, index) => (
                                        <IonSelectOption key={index} value={statementOption}>
                                            {statementOption == 'e-Statement' ? 'No Paper Statement' : statementOption}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
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
                            <IonItem className={showError('include_interested_party')}>
                                <IonSelect value={formData.include_interested_party} name='include_interested_party' onIonChange={updateForm} interface='action-sheet' ref={register({required: false})}>
                                    <IonSelectOption value={false}>No</IonSelectOption>
                                    <IonSelectOption value={true}>
                                        Yes
                                    </IonSelectOption>
                                </IonSelect>
                            </IonItem>
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
                                    <IonItem className={showError('first_name')}>
                                        <IonInput value={formData.first_name} name='first_name' onIonInput={updateForm} ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>
                                        Last Name
                                    </IonLabel>
                                    <IonItem className={showError('last_name')}>
                                        <IonInput value={formData.last_name} name='last_name' onIonInput={updateForm} ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>
                                        Email
                                    </IonLabel>
                                    <IonItem className={showError('email')}>
                                        <IonInput value={formData.email} name='email' onIonInput={updateForm} ref={register({required: true, pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/})}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>Phone</IonLabel>
                                    <IonItem className={showError('phone')}>
                                        <IonInput value={formData.phone} type='number' name='phone' onIonInput={updateForm} ref={register({required: true,pattern:/^[0-9]{10}$/})}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Street</IonLabel>
                                    <IonItem className={showError('mailing_street')}>
                                        <IonInput value={formData.mailing_street} name='mailing_street' onIonInput={updateForm} ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>
                                        City
                                    </IonLabel>
                                    <IonItem className={showError('mailing_city')}>
                                        <IonInput value={formData.mailing_city} name='mailing_city' onIonInput={updateForm} ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>
                                        State
                                    </IonLabel>
                                    <IonItem className={showError('mailing_state')}>
                                        <IonSelect value={formData.mailing_state} name='mailing_state' onIonChange={updateForm} interface='action-sheet' ref={register({required: true})} interfaceOptions={{cssClass: 'states-select'}}>
                                            {states.map((state, index) => (
                                                <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                                )
                                        )}
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel> Zip</IonLabel>
                                    <IonItem className={showError('mailing_zip')}>
                                        <IonInput value={formData.mailing_zip} type='number' name='mailing_zip' onIonInput={updateForm} ref={register({required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/})}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>
                                        Company Name
                                    </IonLabel>
                                    <IonItem className={showError('company_name')}>
                                        <IonInput value={formData.company_name} name='company_name' onIonInput={updateForm}  ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>
                                        Title
                                    </IonLabel>
                                    <IonItem className={showError('title')}>
                                        <IonInput value={formData.title} name='title' onIonInput={updateForm}  ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Online Access</IonLabel>
                                    <IonItem className={showError('online_access')}>
                                        <IonSelect value={formData.online_access} name='online_access' onIonChange={updateForm} interface='action-sheet'  ref={register({required: false})}>
                                            <IonSelectOption value={true}>Yes</IonSelectOption>
                                            <IonSelectOption  value={false}>No</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>
                                        Paper Statement Options
                                    </IonLabel>
                                    <IonItem className={showError('statement_option')}>
                                        <IonSelect value={formData.statement_option} name='statement_option' onIonChange={updateForm} interface='action-sheet'  ref={register({required: true})}>
                                            {paperStatementOptions.map((statementOption, index) => (
                                                <IonSelectOption value={statementOption} key={index}>{statementOption}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </React.Fragment>
                    )}
                </IonGrid>
            </form>
        </IonContent>
    )
}

export default AccountNotifications; 