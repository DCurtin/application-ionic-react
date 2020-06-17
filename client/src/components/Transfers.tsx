import React, {useState, useEffect} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {getTransferPage, saveTransferPage} from '../helpers/CalloutHelpers'

const Transfers : React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const history = useHistory();
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
        console.log('saving bene');
        saveTransferPage(sessionId, formData);
      })
    },[formData])

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        console.log(e.target.name + ' ' + newValue);
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
                                <IonInput value={formData[`account_number__${i}`]} name={`account_number__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Institution Name
                                </IonLabel>
                                <IonInput value={formData[`institution_name__${i}`]} name={`institution_name__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonInput value={formData[`contact_name__${i}`]} name={`contact_name__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Contact Phone Number
                                </IonLabel>
                                <IonInput value={formData[`contact_phone_number__${i}`]} name={`contact_phone_number__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonInput value={formData[`mailing_street__${i}`]} name={`mailing_street__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel> City</IonLabel>
                                <IonInput value={formData[`mailing_city__${i}`]} name={`mailing_city__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel> State </IonLabel>
                                <IonSelect value={formData[`mailing_state__${i}`]} name={`mailing_state__${i}`} onIonChange={updateForm}>
                                {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonInput value={formData[`mailing_zip__${i}`]} name={`mailing_zip__${i}`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Transfer Type 
                                </IonLabel>
                                <IonSelect value={formData[`transfer_type__${i}`]} name={`transfer_type__${i}`} onIonChange={updateForm}>
                                    <IonSelectOption value='Cash Transfer'>Cash (Most Common)</IonSelectOption>
                                    <IonSelectOption value='In-Kind Transfer'> In-Kind (Private Holding)</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            {formData[`transfer_type__${i}`] === 'Cash Transfer' && (
                                <IonCol>
                                    <IonLabel>Account Type</IonLabel>
                                    <IonSelect value={formData[`account_type__${i}`]} name={`account_type__${i}`} onIonChange={updateForm}>
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
                                </IonCol>
                            )}
                            {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                                <IonCol>
                                    <IonLabel>
                                        Holding Name
                                    </IonLabel>
                                    <IonInput name={`asset_name_1__${i}`} value={formData[`asset_name_1__${i}`]} onIonChange={updateForm}></IonInput>
                                </IonCol>
                            )}
                        </IonRow>
                        {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel> Account Type</IonLabel>
                                        <IonSelect value={formData[`account_type__${i}`]} name={`account_type__${i}`} onIonChange={updateForm}>
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
                                    </IonCol>
                                    <IonCol>
                                        <IonLabel>
                                            Holding 2 Name (if applicable)
                                        </IonLabel>
                                        <IonInput value={formData[`asset_name_2__${i}`]}name={`asset_name_2__${i}`} onIonChange={updateForm}></IonInput>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel>
                                            Complete or Partial Transfer
                                        </IonLabel>
                                        <IonSelect value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`} onIonChange={updateForm}>
                                            <IonSelectOption value='All Available Cash'> Complete </IonSelectOption>
                                            <IonSelectOption value=''>Partial</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                    <IonCol>
                                        <IonLabel>
                                            Holding 3 Name (if applicable)
                                        </IonLabel>
                                        <IonInput name={`asset_name_3__${i}`} value={formData[`asset_name_3__${i}`]} onIonChange={updateForm}></IonInput>
                                    </IonCol>
                                </IonRow>
                            </React.Fragment>
                        )}
                        {formData[`transfer_type__${i}`] === 'Cash Transfer' && 
                        (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol size='6'>
                                    <IonSelect value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`} onIonChange={updateForm}>
                                        <IonSelectOption value='All Available Cash'>All Available Cash</IonSelectOption>
                                        <IonSelectOption value='Partial Cash Transfer'>Partial Cash Transfer</IonSelectOption>
                                    </IonSelect>
                                    </IonCol>
                                    {formData[`full_or_partial_cash_transfer__${i}`] == 'Partial Cash Transfer' && (
                                        <IonCol>
                                            <IonLabel>Cash Amount</IonLabel>
                                            <IonInput value={formData[`cash_amount__${i}`]} name={`cash_amount__${i}`} onIonChange={updateForm}></IonInput>
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
                                    <IonRadioGroup name={`delivery_method__${i}`} value={formData[`delivery_method__${i}`]} onIonChange={updateForm}>
                                        <IonLabel>Mail (No charge)</IonLabel>
                                        <IonRadio value='Certified Mail' className='ion-margin-horizontal'>
                                        </IonRadio>
                                        <IonLabel>Overnight ($30 Fee Applies)</IonLabel>
                                        <IonRadio value='FedEx Overnight' className='ion-margin-horizontal'></IonRadio>
                                    </IonRadioGroup>
                                </div>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Upload Current Institution's Statement
                                </IonLabel>
                                <input type='file'></input>
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
        </IonContent>
    )
}

export default Transfers; 