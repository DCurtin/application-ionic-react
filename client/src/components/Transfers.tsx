import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { SessionApp, states, FormData, showErrorToast, reValidateOnUnmmount } from '../helpers/Utils';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio, IonList } from '@ionic/react';
import AutoSuggest from 'react-autosuggest';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {getTransferPage, saveTransferPage} from '../helpers/CalloutHelpers';

const custodians: string[] = [
    "Company1",
    "Company2",
    "Big Corp",
    "Happy Toy Company",
    'ccc',
    'cccc',
    'cccccc',
    'cccccccc',
    'cccccccccccc',
    'cccccccccccccc',
    'ccccccccccccccc',
    'cccccccccccccccccccccc',
    'cheese',
    'chuck',
    'check e cheese',
    'check',
    'checkmate'
  ];

  const lowerCasedCustodians = custodians.map(custodian => custodian.toLowerCase());

const Transfers : React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast, setShowSpinner}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, formState} = useForm({
        mode: 'onChange'
    });

    const [formData, setFormData] = useState<FormData>({
        account_type: 'Traditional IRA',
        existing_transfers: 0
    })
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [value, setValue] = useState('');

    useEffect(()=>{
        if(sessionId !== '')
        {
            setShowSpinner(true);
            getTransferPage(sessionId).then(data =>{
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
        showErrorToast(errors, setShowErrorToast);
        return () => reValidateOnUnmmount(errors, updateMenuSections, 'is_transfer_ira_page_valid');
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
        }
        return className;
    };

    const getSuggestions = (value: string) => {
        return lowerCasedCustodians.filter(custodian => custodian.startsWith(value.trim().toLowerCase()));
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
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                   Account Number 
                                </IonLabel>
                                <IonItem className={showError(`account_number__${i}`)}>
                                    <Controller name={`account_number__${i}`} control={control} defaultValue={formData[`account_number__${i}`]} as={
                                        <IonInput value={formData[`account_number__${i}`]} name={`account_number__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Institution Name
                                </IonLabel>
                                <IonItem className={showError(`institution_name__${i}`)}>
                                    <Controller name={`institution_name__${i}`} defaultValue={formData[`institution_name__${i}`]} control={control} as={
                                        <IonInput value={formData[`institution_name__${i}`]} name={`institution_name__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonItem className={showError(`contact_name__${i}`)}>
                                    <Controller name={`contact_name__${i}`} control={control} defaultValue={formData[`contact_name__${i}`]} as={
                                        <IonInput value={formData[`contact_name__${i}`]} name={`contact_name__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                Contact Phone Number
                                </IonLabel>
                                <IonItem className={showError(`contact_phone_number__${i}`)}>
                                    <Controller name={`contact_phone_number__${i}`} control={control} defaultValue={formData[`contact_phone_number__${i}`]}  as={
                                        <IonInput type='tel' value={formData[`contact_phone_number__${i}`]} name={`contact_phone_number__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>Street</IonLabel>
                                <IonItem className={showError(`mailing_street__${i}`)}>
                                    <Controller name={`mailing_street__${i}`} control={control} defaultValue={formData[`mailing_street__${i}`]} as={
                                        <IonInput value={formData[`mailing_street__${i}`]} name={`mailing_street__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> City</IonLabel>
                                <IonItem className={showError(`mailing_city__${i}`)}>
                                    <Controller name={`mailing_city__${i}`} control={control} defaultValue={formData[`mailing_city__${i}`]} as={
                                        <IonInput value={formData[`mailing_city__${i}`]} name={`mailing_city__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> State </IonLabel>
                                <IonItem className={showError(`mailing_state__${i}`)}>
                                    <Controller name={`mailing_state__${i}`} control={control} defaultValue={formData[`mailing_state__${i}`]} as={
                                        <IonSelect interface='action-sheet' value={formData[`mailing_state__${i}`]} name={`mailing_state__${i}`} interfaceOptions={{cssClass: 'states-select'}}>
                                        {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                                        </IonSelect>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonItem className={showError(`mailing_zip__${i}`)}>
                                    <Controller name={`mailing_zip__${i}`} defaultValue={formData[`mailing_zip__${i}`]} control={control} as={
                                        <IonInput value={formData[`mailing_zip__${i}`]} name={`mailing_zip__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/}}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Transfer Type 
                                </IonLabel>
                                <IonItem className={showError(`transfer_type__${i}`)}>
                                    <Controller defaultValue={formData[`transfer_type__${i}`]} name={`transfer_type__${i}`} control={control} as={
                                        <IonSelect interface='action-sheet' value={formData[`transfer_type__${i}`]} name={`transfer_type__${i}`}>
                                            <IonSelectOption value='Cash Transfer'>Cash (Most Common)</IonSelectOption>
                                            <IonSelectOption value='In-Kind Transfer'> In-Kind (Private Holding)</IonSelectOption>
                                        </IonSelect>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                            {formData[`transfer_type__${i}`] === 'Cash Transfer' && (
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>Account Type</IonLabel>
                                    <IonItem className={showError(`account_type__${i}`)}>
                                        <Controller name={`account_type__${i}`} control={control} defaultValue={formData[`account_type__${i}`]} as={
                                            <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`}>
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
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                        }} rules={{required: true}}/>
                                    </IonItem>
                                </IonCol>
                            )}
                            {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                                <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                    <IonLabel>
                                        Holding Name
                                    </IonLabel>
                                    <IonItem className={showError(`asset_name_1__${i}`)}>
                                        <Controller name={`asset_name_1__${i}`} defaultValue={formData[`asset_name_1__${i}`]} control={control} as={
                                            <IonInput name={`asset_name_1__${i}`} value={formData[`asset_name_1__${i}`]}/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                        }} rules={{required: true}}/>
                                    </IonItem>
                                </IonCol>
                            )}
                        </IonRow>
                        {formData[`transfer_type__${i}`] === 'In-Kind Transfer' && (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                        <IonLabel> Account Type</IonLabel>
                                        <IonItem className={showError(`account_type__${i}`)}>
                                            <Controller name={`account_type__${i}`} control={control} defaultValue={formData[`account_type__${i}`]} as={
                                                <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`}>
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
                                            } onChangeName="onIonChange" onChange={([selected]) => {
                                                updateForm(selected);
                                                return selected.detail.value;
                                            }} rules={{required: true}} />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                        <IonLabel>
                                            Holding 2 Name (if applicable)
                                        </IonLabel>
                                        <IonItem className={showError(`asset_name_2__${i}`)}>
                                            <Controller name={`asset_name_2__${i}`} defaultValue={formData[`asset_name_2__${i}`]} control={control} as={
                                                <IonInput value={formData[`asset_name_2__${i}`]} name={`asset_name_2__${i}`}/>
                                            } onChangeName="onIonChange" onChange={([selected]) => {
                                                updateForm(selected);
                                                return selected.detail.value;
                                            }} rules={{required: true}} />
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                        <IonLabel>
                                            Complete or Partial Transfer *
                                        </IonLabel>
                                        <IonItem className={showError(`full_or_partial_cash_transfer__${i}`)}>
                                            <Controller name={`full_or_partial_cash_transfer__${i}`} control={control} defaultValue={formData[`full_or_partial_cash_transfer__${i}`]} as={
                                                <IonSelect interface='action-sheet' value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`}>
                                                    <IonSelectOption value='All Available Cash'> Complete </IonSelectOption>
                                                    <IonSelectOption value=''>Partial</IonSelectOption>
                                                </IonSelect>
                                            } onChangeName="onIonChange" onChange={([selected]) => {
                                                updateForm(selected);
                                                return selected.detail.value;
                                            }} rules={{required: true}}/>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                        <IonLabel>
                                            Holding 3 Name (if applicable)
                                        </IonLabel>
                                        <IonItem className={showError(`asset_name_3__${i}`)}>
                                            <Controller name={`asset_name_3__${i}`} defaultValue={formData[`asset_name_3__${i}`]} control={control} as={
                                                <IonInput name={`asset_name_3__${i}`} value={formData[`asset_name_3__${i}`]}/>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                        }} rules={{required: true}}/>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </React.Fragment>
                        )}
                        {formData[`transfer_type__${i}`] === 'Cash Transfer' && 
                        (
                            <React.Fragment>
                                <IonRow>
                                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                        <IonLabel> Transfer Amount * </IonLabel>
                                        <IonItem className={showError(`full_or_partial_cash_transfer__${i}`)}>
                                            <Controller name={`full_or_partial_cash_transfer__${i}`} defaultValue={formData[`full_or_partial_cash_transfer__${i}`]} control={control} as={
                                                <IonSelect value={formData[`full_or_partial_cash_transfer__${i}`]} name={`full_or_partial_cash_transfer__${i}`} interface="action-sheet">
                                                    <IonSelectOption value='All Available Cash'>All Available Cash</IonSelectOption>
                                                    <IonSelectOption value='Partial Cash Transfer'>Partial Cash Transfer</IonSelectOption>
                                                </IonSelect>
                                            } onChangeName="onIonChange" onChange={([selected]) => {
                                                updateForm(selected);
                                                return selected.detail.value;
                                            }} rules={{required: true}}/>
                                        </IonItem>
                                    </IonCol>
                                    {formData[`full_or_partial_cash_transfer__${i}`] == 'Partial Cash Transfer' && (
                                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                            <IonLabel>Cash Amount</IonLabel>
                                            <IonItem className={showError(`cash_amount__${i}`)}>
                                                <Controller name={`cash_amount__${i}`} control={control} defaultValue={formData[`cash_amount__${i}`]} as={
                                                    <IonInput value={formData[`cash_amount__${i}`]} name={`cash_amount__${i}`}/>
                                                } onChangeName="onIonChange" onChange={([selected]) => {
                                                    updateForm(selected);
                                                    return selected.detail.value;
                                                }} rules={{required: true}} />
                                            </IonItem>
                                        </IonCol>
                                    )}
                                </IonRow>
                            </React.Fragment>
                        )}
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                To expedite this transfer request, Midland will send your signed request via fax or scan if acceptable by your current IRA custodian. If your current IRA custodian requires original documents, how do you want this transfer to be delivered?
                                </IonLabel>
                                <div className="ion-text-wrap">
                                    <IonList className={showError(`delivery_method__${i}`)}>
                                        <Controller defaultValue={formData[`delivery_method__${i}`]} name={`delivery_method__${i}`} control={control} as={
                                            <IonRadioGroup name={`delivery_method__${i}`} value={formData[`delivery_method__${i}`]}>
                                                <IonItem>
                                                    <IonLabel>Mail (No charge)</IonLabel>
                                                    <IonRadio value='Certified Mail'>
                                                    </IonRadio>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel>Overnight ($30 Fee Applies)</IonLabel>
                                                    <IonRadio value='FedEx Overnight'></IonRadio>
                                                </IonItem>
                                            </IonRadioGroup>
                                        } onChangeName="onIonChange" onChange={([selected]) => {
                                            updateForm(selected);
                                            return selected.detail.value;
                                        }} rules={{required: true}} />
                                    </IonList>
                                </div>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                Upload Current Institution's Statement
                                </IonLabel>
                                <IonItem>
                                    <input type='file' name={`file__${i}`}/>
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
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        {formData.existing_transfers < 2 && (
                            <IonButton onClick={addTransfer}>
                                <IonIcon icon={addOutline} slot='start'></IonIcon>
                                Add Transfer
                            </IonButton>
                        )}
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <AutoSuggest
                                suggestions={suggestions}
                                onSuggestionsClearRequested={() => setSuggestions([])}
                                onSuggestionsFetchRequested={({ value }) => {
                                setValue(value);
                                setSuggestions(getSuggestions(value));
                                }}
                                onSuggestionSelected={(_, { suggestionValue }) =>
                                console.log("Selected: " + suggestionValue)
                                }
                                getSuggestionValue={suggestion => suggestion}
                                renderSuggestion={suggestion => <span>{suggestion}</span>}
                                inputProps={{
                                value: value,
                                onChange: (_, { newValue, method }) => {
                                    setValue(newValue);
                                }
                                }}
                                highlightFirstSuggestion={true}
                            />

                        </IonItem>
                    </IonCol>
                </IonRow>
                
            </IonGrid> 
            </form>           
        </IonContent>
    )
}

export default Transfers; 