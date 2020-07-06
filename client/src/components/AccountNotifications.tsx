import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { SessionApp, states, accountNotificationsForm } from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {getAccountNotificationsPage, saveAccountNotificationsPage} from '../helpers/CalloutHelpers'
import { DevTool } from "@hookform/devtools";

const paperStatementOptions = ['e-Statement', 'Mailed Monthly', 'Mailed Quarterly', 'Mailed Annually']

const AccountNotifications: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast, setShowSpinner}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, setValue, getValues, formState} = useForm({
        mode: 'onChange'
    }); 

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
            setShowSpinner(true);
            getAccountNotificationsPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    setShowSpinner(false);
                    return;
                }
                ImportForm(data);
                setShowSpinner(false);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let importedForm : accountNotificationsForm = data
        setFormData(importedForm);
        for (var fieldName in data) {
            setValue(fieldName, data[fieldName])
        }
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveAccountNotificationsPage(sessionId, formData);
      })
    },[formData])

    const updateForm = (e:any) => {
        setFormData(prevState => {
            let newValue = e.target.value;
            console.log(e.target.value);
            return {...prevState, [e.target.name]: newValue}
        });
    }

    const validateFields = (data: any, e: any) => {
        saveAccountNotificationsPage(sessionId, formData);
        updateMenuSections('is_account_notifications_page_valid', true);
        setShowErrorToast(false);
    }

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
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
                                <Controller name='ira_statement_option' control={control} as={
                                    <IonSelect name='ira_statement_option' value={formData.ira_statement_option} interface='action-sheet'>
                                        {paperStatementOptions.map((statementOption, index) => (
                                            <IonSelectOption key={index} value={statementOption}>
                                                {statementOption == 'e-Statement' ? 'No Paper Statement' : statementOption}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required:true}}/>
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
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                            Do you want to provide someone else access to your account? *
                            </IonLabel>
                            <IonItem className={showError('include_interested_party')}>
                                <Controller name='include_interested_party' control={control} as={
                                    <IonSelect value={formData.include_interested_party} name='include_interested_party' interface='action-sheet'>
                                        <IonSelectOption value={false}>No</IonSelectOption>
                                        <IonSelectOption value={true}>
                                            Yes
                                        </IonSelectOption>
                                    </IonSelect>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    console.log(selected.detail);
                                    return selected.detail.value;
                                  }}/>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    {formData.include_interested_party == true && 
                    (
                        <React.Fragment>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        First Name
                                    </IonLabel>
                                    <IonItem className={showError('first_name')}>
                                        <Controller name='first_name' control={control} as={
                                        <IonInput value={formData.first_name} name='first_name'/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                      }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Last Name
                                    </IonLabel>
                                    <IonItem className={showError('last_name')}>
                                        <Controller name='last_name' control={control} as={
                                            <IonInput value={formData.last_name} name='last_name'/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Email
                                    </IonLabel>
                                    <IonItem className={showError('email')}>
                                        <Controller name='email' control={control} as={
                                            <IonInput value={formData.email} name='email'/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required: true, pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/}}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>Phone</IonLabel>
                                    <IonItem className={showError('phone')}>
                                        <Controller name='phone' control={control} as={
                                            <IonInput value={formData.phone} type='number' name='phone'/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{
                                            required: true,
                                            pattern:/^[0-9]{10}$/
                                        }}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>Street</IonLabel>
                                    <IonItem className={showError('mailing_street')}>
                                        <Controller name='mailing_street' control={control} as={
                                            <IonInput value={formData.mailing_street} name='mailing_street'/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        City
                                    </IonLabel>
                                    <IonItem className={showError('mailing_city')}>
                                        <Controller name='mailing_city' control={control} as={
                                            <IonInput value={formData.mailing_city} name='mailing_city' />
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        State
                                    </IonLabel>
                                    <IonItem className={showError('mailing_state')}>
                                        <Controller name='mailing_state' control={control} as={
                                            <IonSelect value={formData.mailing_state} name='mailing_state' interface='action-sheet'interfaceOptions={{cssClass: 'states-select'}}>
                                                {states.map((state, index) => (
                                                    <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                                    )
                                            )}
                                            </IonSelect>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel> Zip</IonLabel>
                                    <IonItem className={showError('mailing_zip')}>
                                        <Controller name='mailing_zip' control={control} as={
                                            <IonInput value={formData.mailing_zip} type='number' name='mailing_zip'/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/}} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Company Name
                                    </IonLabel>
                                    <IonItem className={showError('company_name')}>
                                        <Controller name='company_name' control={control} as={
                                            <IonInput value={formData.company_name} name='company_name' />
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Title
                                    </IonLabel>
                                    <IonItem className={showError('title')}>
                                        <Controller name='title' control={control} as={
                                            <IonInput value={formData.title} name='title'/>
                                        }onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                      }} rules={{required:true}} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>Online Access</IonLabel>
                                    <IonItem className={showError('online_access')}>
                                        <Controller name='online_access' control={control} as={
                                             <IonSelect value={formData.online_access} name='online_access' interface='action-sheet'>
                                             <IonSelectOption value={true}>Yes</IonSelectOption>
                                             <IonSelectOption  value={false}>No</IonSelectOption>
                                         </IonSelect>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}} />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Paper Statement Options
                                    </IonLabel>
                                    <IonItem className={showError('statement_option')}>
                                        <Controller name='statement_option' control={control} as={
                                            <IonSelect value={formData.statement_option} name='statement_option'  interface='action-sheet'>
                                                {paperStatementOptions.map((statementOption, index) => (
                                                    <IonSelectOption value={statementOption} key={index}>{statementOption}</IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                          }} rules={{required:true}}/>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </React.Fragment>
                    )}
                </IonGrid>
            </form>
            <DevTool control={control} />
        </IonContent>
    )
}

export default AccountNotifications; 