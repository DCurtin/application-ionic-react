import React, {useState, useEffect} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio } from '@ionic/react';
import { addOutline } from 'ionicons/icons';

const Transfers : React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        account_type__c: 'Traditional IRA',
        existing_ira_transfers__c: 0,
        ira_account_number_1__c: '',
        ira_institution_name_1__c: '',
        ira_contact_name_1__c: '',
        ira_contact_phone_number_1__c: '', 
        ira_street_1__c: '',
        ira_city_1__c: '',
        ira_state_1__c: '',
        ira_zip_1__c: '',
        transfertype1__c: '',
        transfer1assetname1__c: '',
        transfer1assetname2__c: '',
        transfer1assetname3__c : '',
        ira_account_type_1__c: '',
        ira_full_or_partial_cash_transfer_1__c: '',
        ira_cash_amount_1__c: '',
        delivery_method__c: '',
        ira_account_number_2__c: '',
        ira_institution_name_2__c: '',
        ira_contact_name_2__c: '',
        ira_contact_phone_number_2__c:'',
        ira_street_2__c:'',
        ira_city_2__c: '',
        ira_state_2__c : '',
        ira_zip_2__c: '',
        transfertype2__c : '',
        ira_account_type_2__c: '',
        transfer2assetname1__c: '',
        transfer2assetname2__c: '',
        transfer2assetname3__c: '',
        ira_full_or_partial_cash_transfer_2__c: '',
        ira_cash_amount_2__c: '',
        delivery_method_2__c:''

    })

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const addTransfer = () => {
        setFormData(prevState => {
            let currentCount = prevState.existing_ira_transfers__c;
            let newCount = currentCount < 2 ? currentCount + 1: currentCount; 
            return {
            ...prevState, 
            existing_ira_transfers__c: newCount
            }; 
        })
    }

    const displayTransferForm = (transferCount: number) => {
        if (transferCount > 0) {
            let formRows = [];
            for (let i = 1; i < transferCount + 1; i++) {
                let deliveryMethodField = (i === 1) ? 'delivery_method__c' : `delivery_method_${i}__c` 
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
                                <IonInput value={formData[`ira_account_number_${i}__c`]} name={`ira_account_number_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Institution Name
                                </IonLabel>
                                <IonInput value={formData[`ira_institution_name_${i}__c`]} name={`ira_institution_name_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonInput value={formData[`ira_contact_name_${i}__c`]} name={`ira_contact_name_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                Contact Phone Number
                                </IonLabel>
                                <IonInput value={formData[`ira_contact_phone_number_${i}__c`]} name={`ira_contact_phone_number_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>Street</IonLabel>
                                <IonInput value={formData[`ira_street_${i}__c`]} name={`ira_street_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel> City</IonLabel>
                                <IonInput value={formData[`ira_city_${i}__c`]} name={`ira_city_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel> State </IonLabel>
                                <IonSelect value={formData[`ira_state_${i}__c`]} name={`ira_state_${i}__c`} onIonChange={updateForm}>
                                {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                                </IonSelect>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonInput value={formData[`ira_zip_${i}__c`]} name={`ira_zip_${i}__c`} onIonChange={updateForm}></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Transfer Type 
                                </IonLabel>
                                <IonSelect value={formData[`transfertype${i}__c`]} name={`transfertype${i}__c`} onIonChange={updateForm}>
                                    <IonSelectOption value='Cash Transfer'>Cash (Most Common)</IonSelectOption>
                                    <IonSelectOption value='In-Kind Transfer'> In-Kind (Private Holding)</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                            {formData[`transfertype${i}__c`] === 'Cash Transfer' && (
                                <IonCol>
                                    <IonLabel>Account Type</IonLabel>
                                    <IonSelect value={formData[`ira_account_type_${i}__c`]} name={`ira_account_type_${i}__c`} onIonChange={updateForm}>
                                        {formData.account_type__c.includes('Roth') ? (
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
                            {formData[`transfertype${i}__c`] === 'In-Kind Transfer' && (
                                <IonCol>
                                    <IonLabel>
                                        Holding Name
                                    </IonLabel>
                                    <IonInput name={`transfer${i}assetname1__c`} value={formData[`transfer${i}assetname1__c`]} onIonChange={updateForm}></IonInput>
                                </IonCol>
                            )}
                        </IonRow>
                        {formData[`transfertype${i}__c`] === 'In-Kind Transfer' && (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel> Account Type</IonLabel>
                                        <IonSelect value={formData[`ira_account_type_${i}__c`]} name={`ira_account_type_${i}__c`} onIonChange={updateForm}>
                                            {formData.account_type__c.includes('Roth') ? (
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
                                        <IonInput value={formData[`transfer${i}assetname2__c`]}name={`transfer${i}assetname2__c`} onIonChange={updateForm}></IonInput>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonLabel>
                                            Complete or Partial Transfer
                                        </IonLabel>
                                        <IonSelect value={formData[`ira_full_or_partial_cash_transfer_${i}__c`]} name={`ira_full_or_partial_cash_transfer_${i}__c`} onIonChange={updateForm}>
                                            <IonSelectOption value='All Available Cash'> Complete </IonSelectOption>
                                            <IonSelectOption value=''>Partial</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                    <IonCol>
                                        <IonLabel>
                                            Holding 3 Name (if applicable)
                                        </IonLabel>
                                        <IonInput name={`transfer${i}assetname3__c`} value={formData[`transfer${i}assetname3__c`]}></IonInput>
                                    </IonCol>
                                </IonRow>
                            </React.Fragment>
                        )}
                        {formData[`transfertype${i}__c`] === 'Cash Transfer' && 
                        (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol size='6'>
                                    <IonSelect value={formData[`ira_full_or_partial_cash_transfer_${i}__c`]} name={`ira_full_or_partial_cash_transfer_${i}__c`} onIonChange={updateForm}>
                                        <IonSelectOption value='All Available Cash'>All Available Cash</IonSelectOption>
                                        <IonSelectOption value='Partial Cash Transfer'>Partial Cash Transfer</IonSelectOption>
                                    </IonSelect>
                                    </IonCol>
                                    {formData[`ira_full_or_partial_cash_transfer_${i}__c`] == 'Partial Cash Transfer' && (
                                        <IonCol>
                                            <IonLabel>Cash Amount</IonLabel>
                                            <IonInput value={formData[`ira_cash_amount_${i}__c`]} name={`ira_cash_amount_${i}__c`} onIonChange={updateForm}></IonInput>
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
                                    <IonRadioGroup name={deliveryMethodField} value={formData[deliveryMethodField]} onIonChange={updateForm}>
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
                        {formData[`transfertype${i}__c`] === 'In-Kind Transfer' && (
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
                    {displayTransferForm(formData.existing_ira_transfers__c)}
                
                <IonRow>
                    <IonCol>
                        {formData.existing_ira_transfers__c < 2 && (
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