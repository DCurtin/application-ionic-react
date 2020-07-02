import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { IonContent, IonText, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput,IonCheckbox, IonRadioGroup, IonRadio,IonItem } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { SessionApp, states, applicantIdForm} from '../helpers/Utils';
import {getAppPage, saveAppPage} from '../helpers/CalloutHelpers';


const OwnerInformation: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef, setShowErrorToast}) => {
    const history = useHistory();
    const [formData, setFormData] = useState<applicantIdForm>({
        is_self_employed: false,
        has_hsa: false,
        home_and_mailing_address_different: false
    });
    const {control, register, handleSubmit, watch, errors, setValue, getValues} = useForm({
        mode: "onChange"
    }); 

    const allValues = getValues();
    console.log(allValues);

    const watchAllFields = watch();

    const [confirmEmail, setConfirmEmail] = useState<string>('')
    const updateForm = (e : any) => {
            let newValue = e.target.name === 'home_and_mailing_address_different' ? e.target.checked : e.target.value;
            setFormData(previousState =>({
            ...previousState,
              [e.target.name]: newValue
            }));
    }

        const updateConfEmail = (e : any)=>{
            setConfirmEmail(e.target.value);
        }

        const validateEmail = () => {
            return (getValues('confirm_email') === getValues('email'));
        }
    
        useEffect(()=>{
            if(sessionId !== '')
            {
                getAppPage(sessionId).then(data =>{
                    if(data === undefined)
                    {
                        return;
                    }
                    ImportForm(data);
                })
            }
        },[sessionId]);

        useEffect(()=>{
            return history.listen(()=>{
              saveAppPage(sessionId, formData, () => {return;});
            })
        }, [formData]);

        useEffect(() => {
            showErrorToast();
        }, [errors])
    
        function ImportForm(data : any){
            let importedForm : applicantIdForm = data;
            setFormData(importedForm);
            for (var fieldName in data) {
                setValue(fieldName, data[fieldName])
            }
        }

        const updateMenus = () =>  {
            updateMenuSections('is_owner_info_page_valid', true);
            setShowErrorToast(false);

        }

        const validateFields = () => {
            saveAppPage(sessionId, formData, updateMenus);
        }


        const showError = (fieldName: string) => {
            let errorsArr = (Object.keys(errors));
            console.log(errors);
            let className = errorsArr.includes(fieldName) ? 'danger' : '';
            if (!errorsArr.includes(fieldName)) {
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

    return (
        <IonContent className="ion-padding">
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
                <IonGrid>
                    <IonRow className="well">
                        <IonCol>
                        Please complete your personal information below. Fields outlined in red are required. Others are optional.
                        </IonCol>
                    </IonRow>
                    <IonItemDivider>
                        <strong>
                        Identity
                        </strong>
                    </IonItemDivider>
                    <IonRow>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12"> 
                            <IonLabel>
                                Salutation *
                            </IonLabel>
                            <IonItem className={showError('salutation')}>
                                <Controller name='salutation' control={control} as={
                                    <IonSelect interface='action-sheet' name="salutation" value={formData.salutation}>
                                        <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                                        <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                                        <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                                        <IonSelectOption value="Dr.">Dr.</IonSelectOption>
                                    </IonSelect>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}} />
                            </IonItem>
                        </IonCol>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                First Name *
                            </IonLabel>
                            <IonItem className={showError('first_name')}>
                                <Controller name='first_name' control={control} as={
                                <IonInput name="first_name" value={formData.first_name} placeholder="First Name" clearInput></IonInput>} onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }} rules={{required: true}}/>
                            </IonItem>
                        </IonCol>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Last Name *
                            </IonLabel>
                            <IonItem className={showError('last_name')}>
                                <Controller name='last_name' control={control} as={
                                    <IonInput class='item-input' name="last_name" value={formData.last_name} placeholder="Last Name" clearInput></IonInput>
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
                                Social Security Number *
                            </IonLabel>
                            <IonItem className={showError('ssn')}>
                                <IonInput class='item-input' name="ssn" value={formData.ssn} placeholder="Social" onIonInput={updateForm} clearInput ref={register({required: true})}> </IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Date of Birth *
                            </IonLabel>
                            <IonItem className={showError('dob')}>
                                <IonInput type='date' class='item-input' name="dob" value={formData.dob} placeholder="Date of Birth" onIonInput={e => updateForm(e!)} clearInput ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Marital Status *
                            </IonLabel>
                            <IonItem className={showError('marital_status')}>
                                <IonSelect interface='action-sheet' name='marital_status' onIonChange={updateForm} value={formData.marital_status} ref={register({required: true})}>
                                    <IonSelectOption value="Single">Single</IonSelectOption>
                                    <IonSelectOption value="Married">Married</IonSelectOption>
                                    <IonSelectOption value="Widowed/Divorced">Widowed/Divorced</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Mother's Maiden Name</IonLabel>
                            <IonItem>
                                <IonInput name='mothers_maiden_name' value={formData.mothers_maiden_name} onIonInput={updateForm}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12">
                            <IonLabel>Occupation</IonLabel>
                            <IonItem>
                                <IonSelect interface='action-sheet' name='occupation' onIonChange={updateForm} value={formData.occupation}>
                                    <IonSelectOption value="Accountant">Accountant
                                    </IonSelectOption>
                                    <IonSelectOption value="Attorney">Attorney</IonSelectOption>
                                    <IonSelectOption value="Financial Advisor">Financial Adviser</IonSelectOption>
                                    <IonSelectOption value="Realtor">Realtor</IonSelectOption>
                                    <IonSelectOption value="Other">Other</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12">
                            <IonLabel>Are you Self-Employed? &nbsp;</IonLabel> 
                            <div className="ion-text-wrap">
                                <IonRadioGroup name='is_self_employed' onIonChange={updateForm} value={formData.is_self_employed} >
                                    <IonLabel>Yes</IonLabel>
                                    <IonRadio value={true} className='ion-margin-horizontal'/>
                                    &nbsp;
                                    <IonLabel>No</IonLabel>
                                    <IonRadio value={false} className='ion-margin-horizontal'/>
                                </IonRadioGroup>
                            </div>               
                        </IonCol>
                        <IonCol size="4" sizeMd="4" sizeSm="12" sizeXs="12">
                            <IonLabel>Do you have a Health Savings Account?</IonLabel>
                            <div className="ion-text-wrap ion-text-justify">
                                <IonRadioGroup name='has_hsa' onIonChange={updateForm} value={formData.has_hsa}> 
                                    <IonLabel>Yes</IonLabel>
                                    <IonRadio value={true} className='ion-margin-horizontal'/>
                                    <IonLabel>No</IonLabel>
                                    <IonRadio className='ion-margin-horizontal' value={false} />
                                </IonRadioGroup>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonItemDivider>
                        <strong>
                        Proof of ID
                        </strong>
                    </IonItemDivider>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Proof of Identification *</IonLabel>
                            <IonItem className={showError('id_type')}>
                                <IonSelect interface='action-sheet' value={formData.id_type} onIonChange={updateForm} name='id_type' ref={register({required: true})}>
                                <IonSelectOption value={`Driver's License`}>Driver's License</IonSelectOption>
                                <IonSelectOption value='Passport'>Passport</IonSelectOption>
                                <IonSelectOption value='Other'>Other</IonSelectOption>
                            </IonSelect>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel> ID Number * </IonLabel>
                            <IonItem className={showError('id_number')}>
                                <IonInput value={formData.id_number} name='id_number' onIonInput={updateForm} ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Issued By *
                            </IonLabel>
                            <IonItem className={showError('id_issued_by')}>
                                <IonInput value={formData.id_issued_by} onIonInput={updateForm} name='id_issued_by' ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Issue Date *
                            </IonLabel>
                            <IonItem className={showError('id_issued_date')}>
                                <IonInput type='date' value={formData.id_issued_date} onIonInput={updateForm} name='id_issued_date' ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Expiration Date *</IonLabel>
                            <IonItem className={showError('id_expiration_date')}> 
                                <IonInput type='date' value={formData.id_expiration_date} onIonInput={updateForm} name='id_expiration_date' ref={register({required: true})}>
                                </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <strong>
                                If you provided a Passport ID, please supply Midland with a copy of the passport. If you provided a Driver's License ID, a copy is not necessary.
                            </strong>
                        </IonCol>
                    </IonRow>
                    <IonItemDivider>
                        <strong>
                        Contact Information
                        </strong>
                    </IonItemDivider>
                    <IonRow>
                        <IonCol>
                            PHYSICAL ADDRESS
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <i>
                            If you currently reside outside of the US, please call our office at (866) 839-0429 for help setting up your IRA.
                            </i>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Physical Street Address *
                            </IonLabel>
                            <IonItem className={showError('legal_street')}> 
                                <IonInput onIonInput={updateForm} value={formData.legal_street} name='legal_street' ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                City *
                            </IonLabel>
                            <IonItem className={showError('legal_city')}>
                                <IonInput onIonInput={updateForm} value={formData.legal_city} name='legal_city' ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Physical State * 
                            </IonLabel>
                            <IonItem className={showError('legal_state')}>
                                <IonSelect interface='action-sheet' interfaceOptions={{cssClass: 'states-select'}} onIonChange={updateForm} value={formData.legal_state} name='legal_state' ref={register({required: true})}>
                                {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Zip *
                            </IonLabel>
                            <IonItem className={showError('legal_zip')}>
                                <Controller as={
                                     <IonInput value={formData.legal_zip} name='legal_zip' type='number'></IonInput>
                                } control={control} onChangeName="onIonChange" onChange={([selected]) => {
                                    updateForm(selected);
                                    return selected.detail.value;
                                  }}name='legal_zip' rules={{
                                    required: true,
                                    pattern:  /^[0-9]{5}(?:-[0-9]{4})?$/
                                }}/>
                                {errors.legal_zip ? (
                                    <IonText color='danger'>Invalid Zip</IonText>
                                ) : null}
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonCheckbox checked={formData.home_and_mailing_address_different} name='home_and_mailing_address_different' onIonChange={updateForm}></IonCheckbox> &nbsp; My mailing address is different than my physical address
                            <p></p>
                        </IonCol>
                    </IonRow>
                    {formData.home_and_mailing_address_different && <React.Fragment>
                        <IonRow>
                            <IonCol>
                                MAILING ADDRESS
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <i>
                                If you currently reside outside of United States, Midland will make all client correspondence electronic.  
                                </i>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>Mailing Street Address *</IonLabel>
                                <IonItem className={showError('mailing_street')}>
                                    <IonInput value={formData.mailing_street} name='mailing_street' onIonInput={updateForm} ref={register({required: true})}></IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>Mailing City *</IonLabel>
                                <IonItem className={showError('mailing_city')}>
                                    <IonInput value={formData.mailing_city} name='mailing_city' onIonInput={updateForm} ref={register({required: true})}
                                    ></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>Mailing State *</IonLabel>
                                <IonItem className={showError('mailing_state')}>
                                    <IonSelect interface='action-sheet' name='mailing_state' value={formData.mailing_state} ref={register({required: true})} onIonChange={updateForm} interfaceOptions={{cssClass: 'states-select'}}>
                                {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> Mailing Zip *</IonLabel>
                                <IonItem className={showError('mailing_zip')}>
                                    <IonInput value={formData.mailing_zip} name='mailing_zip' onIonInput={updateForm} ref={register({
                                        required: true,
                                        pattern:  /^[0-9]{5}(?:-[0-9]{4})?$/
                                    })}></IonInput>
                                    {errors.mailing_zip ? (<IonText color='danger'>
                                        Error Message
                                    </IonText>
                                    ): ''}
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </React.Fragment>}
                    <IonRow>
                        <IonCol>
                            PRIMARY CONTACT INFO
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Primary Phone *
                            </IonLabel>
                            <IonItem className={showError('primary_phone')}>
                                <IonInput value={formData.primary_phone} name='primary_phone' onIonInput={updateForm} ref={register({required: true})}></IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>
                                Preferred Contact Method 
                            </IonLabel>
                            <IonItem>
                                <IonSelect interface='action-sheet' value={formData.preferred_contact_method} name='preferred_contact_method' onIonChange={updateForm}>
                                    <IonSelectOption value='Email'>Email</IonSelectOption>
                                    <IonSelectOption value='Mail'>Mail</IonSelectOption>
                                    <IonSelectOption value='Phone (Home)'>Phone (Home)</IonSelectOption>
                                    <IonSelectOption value='Phone (Mobile)'>Phone (Mobile)</IonSelectOption>
                                    <IonSelectOption value='Phone (Work)'>Phone (Work)</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Email *</IonLabel>
                            <IonItem className={showError('email')}>
                            <IonInput class='item-input' name='email' value={formData.email} placeholder='Email' onIonInput={updateForm} required={true} clearInput ref={register({required: true})}>
                            </IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Confirm Email *</IonLabel>
                            
                            <IonItem className={showError('confirm_email')}>
                                <Controller name='confirm_email' control={control} as={
                                    <IonInput value={confirmEmail} name='confirm_email'></IonInput>
                                } onChangeName="onIonChange" onChange={([selected]) => {
                                    updateConfEmail(selected);
                                    return selected.detail.value;
                                }} rules={{
                                    required: true,
                                    validate: validateEmail
                                }}/>
                                {errors.confirm_email ? (
                                    <IonText color='danger'>E-mails Must Match</IonText>
                                ) : null}
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <p>SECONDARY CONTACT INFO</p>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Alternate Phone</IonLabel>
                            <IonItem>
                                <IonInput value={formData.alternate_phone} name='alternate_phone' onIonInput={updateForm}></IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                            <IonLabel>Alternate Phone Type</IonLabel>
                            <IonItem>
                                <IonSelect value={formData.alternate_phone_type} interface='action-sheet' name='alternate_phone_type' onIonChange={updateForm}>
                                    <IonSelectOption value='Home'>Home</IonSelectOption>
                                    <IonSelectOption value='Mobile'>Mobile</IonSelectOption>
                                    <IonSelectOption value='Office'>Office</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </form>
        </IonContent>
    )
}

export default OwnerInformation;