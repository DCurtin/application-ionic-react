import React, {useState, useEffect} from 'react'; 
import {useForm, Controller} from 'react-hook-form';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import {SessionApp, states, FormData, showErrorToast, reValidateOnUnmmount} from '../helpers/Utils';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {getBenePage, saveBenePage} from '../helpers/CalloutHelpers';

const Beneficiaries: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast, setErrorMessage, setShowSpinner}) => {
    const history = useHistory();
    const [formData, setFormData] = useState<FormData>({
        beneficiary_count: 0
    });

    const {control, handleSubmit, errors, setValue, getValues, formState } = useForm({
        mode: 'onChange'
    });

    useEffect(()=>{
        if(sessionId !== '')
        {
            setShowSpinner(true);
            getBenePage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
                setShowSpinner(false);
            })
        }
    },[sessionId])


    function ImportForm(data : any){
        let importedForm : FormData = data;
        setFormData({...importedForm});
    }

    useEffect(()=>{
      return history.listen(()=>{
        saveBenePage(sessionId, formData);
      })
    },[formData]);

    const addBeneficiary = () => {
        setFormData(prevState => {
            let currentCount = prevState.beneficiary_count;
            let newCount = currentCount < 4 ? currentCount +1 : currentCount;  
         return {...prevState, beneficiary_count : newCount}
        });
    }

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    const validateFields = (e: any) => {
         if (!isSharePercentageValid()) {
            setErrorMessage('Share percentage for each beneficiary type must add up to 100.');
            setShowErrorToast(true); 
            return;
        }
        saveBenePage(sessionId, formData).then(() => updateMenus())
    }

    const updateMenus = () => {
        updateMenuSections('is_beneficiaries_page_valid', true);
        setErrorMessage(''); 
        setShowErrorToast(false);
    }

    const isSharePercentageValid = () => {
        let isValid = true; 
        if (calcShare('Primary') !== null) {
            isValid = isValid && (calcShare('Primary') === 100);
        }
        if (calcShare('Contingent') !== null) {
            isValid = isValid && (calcShare('Contingent') === 100)
        }
        return isValid; 
    }

    useEffect(() => {
        showErrorToast(errors, setShowErrorToast);

        return () => reValidateOnUnmmount(errors, updateMenuSections, 'is_beneficiaries_page_valid');
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
        }
        return className;
    };

    const calcShare = (beneficiaryType : string) => {
        let totalShare = null; 
        if (formData.beneficiary_count > 0) {
            for (let i=1; i <= formData.beneficiary_count; i++) {
                if (getValues(`type__${i}`) == beneficiaryType) {
                    if (totalShare == null) {
                        totalShare = 0;
                    }
                    let beneficiaryShare = +getValues(`share_percentage__${i}`);
                    if (beneficiaryShare !== null && totalShare !== null) {
                        totalShare += beneficiaryShare;
                    }
                }
            }
        }
        return totalShare; 
    }
 
    const displayBeneficiaryForm = (beneficiaryCount: number) => {
        if (beneficiaryCount > 0) {
            let formRows = [];
            for (let i = 0; i < beneficiaryCount; i++){
                let beneficiaryNumber = i +1;
              formRows.push(
              <React.Fragment key={beneficiaryNumber}>
                  <IonItemDivider>
                    <strong>
                        <IonText color='primary'>
                            Beneficiary {beneficiaryNumber}
                        </IonText>
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            First Name
                        </IonLabel>
                        <IonItem className={showError(`first_name__${beneficiaryNumber}`)}>
                        <Controller name={`first_name__${beneficiaryNumber}`} defaultValue={formData[`first_name__${beneficiaryNumber}`]} control={control} as={
                                <IonInput name={`first_name__${beneficiaryNumber}`} value={formData[`first_name__${beneficiaryNumber}`]}/>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value;
                            }} rules={{required: true}} />
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Last Name</IonLabel>
                        <IonItem className={showError(`last_name__${beneficiaryNumber}`)}>
                            <Controller name={`last_name__${beneficiaryNumber}`} control={control} defaultValue={formData[`last_name__${beneficiaryNumber}`]} as={
                                <IonInput name={`last_name__${beneficiaryNumber}`} value={formData[`last_name__${beneficiaryNumber}`]}/>
                            }  onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}} />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Social Security Number</IonLabel>
                        <IonItem className={showError(`ssn__${beneficiaryNumber}`)}>
                            <Controller name={`ssn__${beneficiaryNumber}`} control={control} defaultValue={formData[`ssn__${beneficiaryNumber}`]} as={
                                <IonInput name={`ssn__${beneficiaryNumber}`} value={formData[`ssn__${beneficiaryNumber}`]} />
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}} /> 
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Date of Birth</IonLabel>
                        <IonItem className={showError(`dob__${beneficiaryNumber}`)}>
                            <Controller name={`dob__${beneficiaryNumber}`} control={control} defaultValue={formData[`dob__${beneficiaryNumber}`]}  as={
                                <IonInput type='date' name={`dob__${beneficiaryNumber}`} value={formData[`dob__${beneficiaryNumber}`]} />
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}
                            />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel> Beneficiary Type</IonLabel>
                        <IonItem className={showError(`type__${beneficiaryNumber}`)}>
                            <Controller name={`type__${beneficiaryNumber}`} defaultValue={formData[`type__${beneficiaryNumber}`]} control={control} as={
                                <IonSelect interface='action-sheet' name={`type__${beneficiaryNumber}`} value={formData[`type__${beneficiaryNumber}`]}>
                                    <IonSelectOption value='Primary'>Primary</IonSelectOption>
                                    <IonSelectOption value='Contingent'>Contingent</IonSelectOption>
                                </IonSelect>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Relationship
                        </IonLabel>
                        <IonItem className={showError(`relationship__${beneficiaryNumber}`)}>
                            <Controller control={control} name={`relationship__${beneficiaryNumber}`} defaultValue={formData[`relationship__${beneficiaryNumber}`]} as={
                                <IonSelect interface='action-sheet' name={`relationship__${beneficiaryNumber}`} value={formData[`relationship__${beneficiaryNumber}`]}>
                                    <IonSelectOption value='Spouse'>Spouse</IonSelectOption>
                                    <IonSelectOption value='Parent'>Parent</IonSelectOption>
                                    <IonSelectOption value='Child'>Child</IonSelectOption>
                                    <IonSelectOption value='Sibling'>Sibling</IonSelectOption>
                                    <IonSelectOption value='Other Family'>Other Family</IonSelectOption>
                                    <IonSelectOption value='Other'>Other</IonSelectOption>
                                </IonSelect>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Share %</IonLabel>
                        <IonItem className={showError(`share_percentage__${beneficiaryNumber}`)}>
                            <Controller control={control}  name={`share_percentage__${beneficiaryNumber}`} defaultValue={formData[`share_percentage__${beneficiaryNumber}`]} as={
                                <IonInput type='number' name={`share_percentage__${beneficiaryNumber}`} value={formData[`share_percentage__${beneficiaryNumber}`]}/>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{
                                required: true, 
                                pattern: /^([0-9]|[1-9][0-9]|100)$/
                            }}/>
                        </IonItem>
                    </IonCol>
                    <IonCol className='well' size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                       Calculated Share Percentage 
                       {
                           (!!formData[`type__${beneficiaryNumber}`] && !!calcShare(formData[`type__${beneficiaryNumber}`])) ? (
                                <p>
                                        <strong>
                                        {formData[`type__${beneficiaryNumber}`]} Share Percentage : {calcShare(formData[`type__${beneficiaryNumber}`])} %
                                        </strong>
                                </p>
                           ) : ''
                       }
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary Street</IonLabel>
                        <IonItem className={showError(`mailing_street__${beneficiaryNumber}`)}>
                        <Controller control={control} name={`mailing_street__${beneficiaryNumber}`} defaultValue={formData[`mailing_street__${beneficiaryNumber}`]} as={
                            <IonInput name={`mailing_street__${beneficiaryNumber}`} value={formData[`mailing_street__${beneficiaryNumber}`]} />
                        }  onChangeName="onIonChange" onChange={([selected]) => {
                            updateForm(selected);
                            return selected.detail.value
                        }} rules={{required: true}} />
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary City</IonLabel>
                        <IonItem className={showError(`mailing_city__${beneficiaryNumber}`)}>
                            <Controller control={control} name={`mailing_city__${beneficiaryNumber}`} defaultValue={formData[`mailing_city__${beneficiaryNumber}`]} as={ 
                                <IonInput name={`mailing_city__${beneficiaryNumber}`} value={formData[`mailing_city__${beneficiaryNumber}`]}/>
                            }  onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary State</IonLabel>
                        <IonItem className={showError(`mailing_state__${beneficiaryNumber}`)}>
                            <Controller control={control} name={`mailing_state__${beneficiaryNumber}`} defaultValue={formData[`mailing_state__${beneficiaryNumber}`]} as={ 
                                <IonSelect interface='action-sheet' name={`mailing_state__${beneficiaryNumber}`} value={formData[`mailing_state__${beneficiaryNumber}`]} interfaceOptions={{cssClass: 'states-select'}}>
                                {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                            </IonSelect>
                            }  onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary Zip</IonLabel>
                        <IonItem className={showError(`mailing_zip__${beneficiaryNumber}`)}>
                            <Controller control={control} name={`mailing_zip__${beneficiaryNumber}`} defaultValue={formData[`mailing_zip__${beneficiaryNumber}`]} as={ 
                                <IonInput  name={`mailing_zip__${beneficiaryNumber}`} value={formData[`mailing_zip__${beneficiaryNumber}`]} />
                            }  onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/}}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Phone
                        </IonLabel>
                        <IonItem className={showError(`phone__${beneficiaryNumber}`)}>
                            <Controller control={control} name={`phone__${beneficiaryNumber}`} defaultValue={formData[`phone__${beneficiaryNumber}`]} as={
                                <IonInput type='number' name={`phone__${beneficiaryNumber}`} value={formData[`phone__${beneficiaryNumber}`]}/>
                            } onChangeName="onIonChange" onChange={([selected]) => {
                                updateForm(selected);
                                return selected.detail.value
                            }} rules={{required: true}}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Email
                        </IonLabel>
                        <IonItem className={showError(`email__${beneficiaryNumber}`)}>
                        <Controller defaultValue={formData[`email__${beneficiaryNumber}`]} name={`email__${beneficiaryNumber}`} control={control} as={
                                 <IonInput type='email'   name={`email__${beneficiaryNumber}`} value={formData[`email__${beneficiaryNumber}`]}/>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{
                                      required:true, 
                                      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,63}/
                                      }}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
              </React.Fragment>)
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
                            <p>
                                Naming beneficiaries in this online application is optional, but highly recommended. If you skip this step, we will provide you with a beneficiary form at a later date.
                            </p>
                            <p>
                                Naming a beneficiary allows your IRA assets to go to whomever you choose. Primary beneficiaries are the first set of individuals/entities that you wish to leave your retirement assets to. If you are married and leave the retirement account to your spouse, he/she inherits the account as if it were his/her own. Secondary beneficiaries receive the assets if your primary beneficiaries die before you or refuse to accept the inheritance.
                            </p>
                            <p>
                                If you elect not to designate a beneficiary, your assets may pass to your estate - subjecting them to the probate process, estate expenses, and creditor claims, causing delays for your beneficiary to receive these assets.
                            </p>
                        </IonCol>
                    </IonRow>
                    {displayBeneficiaryForm(formData.beneficiary_count)}
                    <IonRow>
                        <IonCol>
                            {formData.beneficiary_count < 4 && 
                            <IonButton onClick={addBeneficiary}> <IonIcon icon={addOutline} slot='start'></IonIcon> Add Beneficiary </IonButton>
                            }
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </form>
        </IonContent>
    )
}
export default Beneficiaries; 