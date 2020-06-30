import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {getTransferPage, saveTransferPage} from '../helpers/CalloutHelpers'

const Transfers : React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast}) => {
    const history = useHistory();
    const {register, handleSubmit, watch, errors} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });
    let watchAllFields = watch();

    const [formData, setFormData] = useState<FormData>({
        account_type: 'Traditional IRA',
        existing_transfers: 0
    })
    useEffect(()=>{
        if(sessionId !== '')
        {
            getTransferPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    
    function ImportForm(data : any){
        let importedForm : FormData = data
        setFormData(importedForm);
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveTransferPage(sessionId, formData);
      })
    },[formData])

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const addTransfer = () => {
        setFormData(prevState => {
            let currentCount = prevState.existing_transfers;
            let newCount = currentCount < 2 ? currentCount + 1: currentCount; 
            return {
            ...prevState, 
            existing_transfers: newCount
            }; 
        })
    }

    const validateFields = (e: any) => {
        saveTransferPage(sessionId, formData);
        updateMenuSections('is_transfer_ira_page_valid', true);
        setShowErrorToast(false);
    }

    useEffect(() => {
        showErrorToast();
        console.log(errors)
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = errorsArr.includes(fieldName) ? 'danger' : '';
        if (watchAllFields[fieldName] && !errorsArr.includes(fieldName)) {
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

    const displayTransferForm = (transferCount: number) => {
        if (transferCount > 0) {
            let formRows = [];
            for (let i = 1; i < transferCount + 1; i++) {
                formRows.push(
                    <React.Fragment key={i}>
                        <IonItemDivider>
                            <strong>
                                <IonText color='primary'>
                                    Transfer {i}
                                </IonText>
                            </strong>
                        </IonItemDivider>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                   Account Number 
                                </IonLabel>
                                <IonItem className={showError(`account_number__${i}`)}>
                                    <IonInput value={formData[`account_number__${i}`]} name={`account_number__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Institution Name
                                </IonLabel>
                                <IonItem className={showError(`institution_name__${i}`)}>
                                    <IonInput value={formData[`institution_name__${i}`]} name={`institution_name__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonItem className={showError(`contact_name__${i}`)}>
                                    <IonInput value={formData[`contact_name__${i}`]} name={`contact_name__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Contact Phone Number
                                </IonLabel>
                                <IonItem className={showError(`contact_phone_number__${i}`)}>
                                    <IonInput value={formData[`contact_phone_number__${i}`]} name={`contact_phone_number__${i}`} onIonInput={updateForm} ref={register({required: true, pattern:/^[0-9]{10}$/})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonItem className={showError(`mailing_street__${i}`)}>
                                    <IonInput value={formData[`mailing_street__${i}`]} name={`mailing_street__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel> City</IonLabel>
                                <IonItem className={showError(`mailing_city__${i}`)}>
                                    <IonInput value={formData[`mailing_city__${i}`]} name={`mailing_city__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel> State </IonLabel>
                                <IonItem className={showError(`mailing_state__${i}`)}>
                                    <IonSelect interface='action-sheet' value={formData[`mailing_state__${i}`]} name={`mailing_state__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                    {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonItem className={showError(`mailing_zip__${i}`)}>
                                    <IonInput value={formData[`mailing_zip__${i}`]} name={`mailing_zip__${i}`} onIonInput={updateForm} ref={register({required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Transfer Type 
                                </IonLabel>
                                <IonItem className={showError(`transfer_type__${i}`)}>
                                    <IonSelect interface='action-sheet' value={formData[`transfer_type__${i}`]} name={`transfer_type__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                        <IonSelectOption value='Cash Transfer'>Cash (Most Common)</IonSelectOption>
                                        <IonSelectOption value='In-Kind Transfer'> In-Kind (Private Holding)</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            {formData[`transfer_type__${i}`] === 'Cash Transfer' && (
                                <IonCol>
                                    <IonLabel>Account Type</IonLabel>
                                    <IonItem className={showError(`account_type__${i}`)}>
                                        <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                            {formData.account_type.includes('Roth') ? (
                                                <IonSelectOption value='Roth IRA'>Roth IRA</IonSelectOption>
                                            ) : (
                                                <React.Fragment>
                                                    <IonSelectOption value='Traditional IRA'>Traditional IRA</IonSelectOption>
                                                    <IonSelectOption value='SEP IRA'>SEP IRA</IonSelectOption>
                                                    <IonSelectOption value='Simple IRA'> Simple IRA</IonSelectOption>
                                                </React.Fragment>
                                            )}
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                            )}
                            {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                                <IonCol>
                                    <IonLabel>
                                        Holding Name
                                    </IonLabel>
                                    <IonItem className={showError(`asset_name_1__${i}`)}>
                                        <IonInput name={`asset_name_1__${i}`} value={formData[`asset_name_1__${i}`]} onIonInput={updateForm} ref={register({required: true})}/>
                                    </IonItem>
                                </IonCol>
                            )}
                        </IonRow>
                        {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel> Account Type</IonLabel>
                                        <IonItem className={showError(`account_type__${i}`)}>
                                            <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                                {formData.account_type.includes('Roth') ? (
                                                    <IonSelectOption value='Roth IRA'>Roth IRA</IonSelectOption>
                                                ) : (
                                                    <React.Fragment>
                                                        <IonSelectOption value='Traditional IRA'>Traditional IRA</IonSelectOption>
                                                        <IonSelectOption value='SEP IRA'>SEP IRA</IonSelectOption>
                                                        <IonSelectOption value='Simple IRA'> Simple IRA</IonSelectOption>
                                                    </React.Fragment>
                                                )}
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol>
                                        <IonLabel>
                                            Holding 2 Name (if applicable)
                                        </IonLabel>
                                        <IonItem className={showError(`asset_name_2__${i}`)}>
                                            <IonInput value={formData[`asset_name_2__${i}`]} name={`asset_name_2__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel>
                                            Complete or Partial Transfer
                                        </IonLabel>
                                        <IonItem className={showError(`full_or_partial_cash_transfer__${i}`)}>
                                            <IonSelect interface='action-sheet' value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                                <IonSelectOption value='All Available Cash'> Complete </IonSelectOption>
                                                <IonSelectOption value=''>Partial</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol>
                                        <IonLabel>
                                            Holding 3 Name (if applicable)
                                        </IonLabel>
                                        <IonItem className={showError(`asset_name_3__${i}`)}>
                                            <IonInput name={`asset_name_3__${i}`} value={formData[`asset_name_3__${i}`]} onIonInput={updateForm} ref={register({required: true})}/>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </React.Fragment>
                        )}
                        {formData[`transfer_type__${i}`] === 'Cash Transfer' && 
                        (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol size='6'>
                                    <IonItem className={showError(`full_or_partial_cash_transfer__${i}`)}>
                                        <IonSelect value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                            <IonSelectOption value='All Available Cash'>All Available Cash</IonSelectOption>
                                            <IonSelectOption value='Partial Cash Transfer'>Partial Cash Transfer</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                    </IonCol>
                                    {formData[`full_or_partial_cash_transfer__${i}`] == 'Partial Cash Transfer' && (
                                        <IonCol>
                                            <IonLabel>Cash Amount</IonLabel>
                                            <IonItem className={showError(`cash_amount__${i}`)}>
                                                <IonInput value={formData[`cash_amount__${i}`]} name={`cash_amount__${i}`} onIonInput={updateForm} ref={register({required: true})}/>
                                            </IonItem>
                                        </IonCol>
                                    )}
                                </IonRow>
                            </React.Fragment>
                        )}
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                To expedite this transfer request, Midland will send your signed request via fax or scan if acceptable by your current IRA custodian. If your current IRA custodian requires original documents, how do you want this transfer to be delivered?
                                </IonLabel>
                                <div className="ion-text-wrap">
                                    <IonItem className={showError(`delivery_method__${i}`)}>
                                        <IonRadioGroup name={`delivery_method__${i}`} value={formData[`delivery_method__${i}`]} onIonChange={updateForm} ref={register({required: true})}>
                                            <IonLabel>Mail (No charge)</IonLabel>
                                            <IonRadio value='Certified Mail' className='ion-margin-horizontal'>
                                            </IonRadio>
                                            <IonLabel>Overnight ($30 Fee Applies)</IonLabel>
                                            <IonRadio value='FedEx Overnight' className='ion-margin-horizontal'></IonRadio>
                                        </IonRadioGroup>
                                    </IonItem>
                                </div>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Upload Current Institution's Statement
                                </IonLabel>
                                <IonItem className={showError(`file__${i}`)}>
                                    <input type='file' name={`file__${i}`} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                            <IonRow>
                                <IonCol>
                                    <b>
                                        <IonText color='primary'>
                                            Midland Trust is unable to transfer in publically traded securities.
                                        </IonText>
                                    </b>
                                </IonCol>
                            </IonRow>
                        )}
                    </React.Fragment>
                )
            }
            return formRows;
        }
    }

    return (
        <IonContent className='ion-padding'>
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    <b>Using this page, you can request an IRA-to-IRA Transfer.</b> Please provide the information below regarding the account you would like to transfer. To help expedite your request, please note the following:
	                <ul data-type="circle">
                        <li>Provide as much information as possible. Incomplete/inaccurate information will result in transfer delays</li>
                        <li>IRA-to-IRA trustee transfers are non-reportable for tax purposes. The funds will go directly from your current IRA to your Midland Trust</li>
                        <li> At the end of this application process, you will sign Midland’s Transfer Form and Midland will initiate the transfer request for you within 24 hours if your current custodian accepts DocuSign</li>
                        <li>IRA transfers typically take 1-2 weeks to complete, depending on your current IRA company</li>
                    </ul>
                    </IonCol>
                </IonRow>
                    {displayTransferForm(formData.existing_transfers)}
                
                <IonRow>
                    <IonCol>
                        {formData.existing_transfers < 2 && (
                            <IonButton onClick={addTransfer}>
                                <IonIcon icon={addOutline} slot='start'></IonIcon>
                                Add Transfer
                            </IonButton>
                        )}
                    </IonCol>
                </IonRow>
            </IonGrid> 
            </form>           
        </IonContent>
    )
}

export default Transfers; 