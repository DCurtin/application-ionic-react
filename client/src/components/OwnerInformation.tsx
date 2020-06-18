import React, {useState, useRef, useEffect} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput,IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { SessionApp, states, requestBody, applicantIdForm, saveApplicationId} from '../helpers/Utils';
import {getAppPage, saveAppPage} from '../helpers/CalloutHelpers';

const OwnerInformation: React.FC<SessionApp> = ({sessionId, setSessionId, updateMenuSections}) => {
    const history = useHistory();
    const [isValid, setIsValid] = useState(false);
    const isInitialRender = useRef(true);
    const [formData, setFormData] = useState<applicantIdForm>({
            is_self_employed: false,
            has_hsa: false,
            home_and_mailing_address_different: false
        });

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
        },[sessionId])
    
        function ImportForm(data : any){
            let importedForm : applicantIdForm = data;
            console.log(importedForm);
            setFormData(importedForm);
        }
        
        useEffect(()=>{
          return history.listen(()=>{
            saveAppPage(sessionId, formData);
          })
        },[formData])

        useEffect(() => { 
            if (isInitialRender.current) {
                isInitialRender.current = false; 
                return; 
            } else {
                updateMenuSections(isValid);
            }
        }, [isValid]);

        useEffect(() => {
            if (formData.first_name && formData.first_name !== '') {
                setIsValid(true);
            } 
        }, [formData]);


    return (
        <IonContent className="ion-padding">
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
                    <IonCol>
                        <IonLabel>
                            Salutation *
                        </IonLabel>
                        <IonSelect interface='action-sheet' name="salutation" value={formData.salutation} onIonChange={updateForm}>
                            <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                            <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                            <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                            <IonSelectOption value="Dr.">Dr.</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            First Name *
                        </IonLabel>
                        <IonInput class='item-input' name="first_name" value={formData.first_name} placeholder="First Name" onIonInput={updateForm} clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Last Name *
                        </IonLabel>
                        <IonInput class='item-input' name="last_name" value={formData.last_name} placeholder="Last Name" onIonInput={updateForm} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Social Security Number *
                        </IonLabel>
                        <IonInput class='item-input' name="ssn" value={formData.ssn} placeholder="Social" onIonInput={updateForm} required clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Date of Birth *
                        </IonLabel>
                        <IonInput type='date' class='item-input' name="dob" value={formData.dob} placeholder="Date of Birth" onIonInput={e => updateForm(e!)} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Marital Status
                        </IonLabel>
                        <IonSelect interface='action-sheet' name='marital_status' onIonChange={updateForm} value={formData.marital_status}>
                            <IonSelectOption value="Single">Single</IonSelectOption>
                            <IonSelectOption value="Married">Married</IonSelectOption>
                            <IonSelectOption value="Widowed/Divorced">Widowed/Divorced</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Mother's Maiden Name</IonLabel>
                        <IonInput name='mothers_maiden_name' value={formData.mothers_maiden_name} onIonInput={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Occupation</IonLabel>
                        <IonSelect interface='action-sheet' name='occupation' onIonChange={updateForm} value={formData.occupation}>
                            <IonSelectOption value="Accountant">Accountant
                            </IonSelectOption>
                            <IonSelectOption value="Attorney">Attorney</IonSelectOption>
                            <IonSelectOption value="Financial Advisor">Financial Adviser</IonSelectOption>
                            <IonSelectOption value="Realtor">Realtor</IonSelectOption>
                            <IonSelectOption value="Other">Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
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
                    <IonCol>
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
                    <IonCol>
                      <IonLabel>Proof of Identification</IonLabel>
                        <IonSelect interface='action-sheet' value={formData.id_type} onIonChange={updateForm} name='id_type'>
                            <IonSelectOption value={`Driver's License`}>Driver's License</IonSelectOption>
                            <IonSelectOption value='Passport'>Passport</IonSelectOption>
                            <IonSelectOption value='Other'>Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel> ID Number </IonLabel>
                        <IonInput value={formData.id_number} name='id_number' onIonInput={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Issued By
                        </IonLabel>
                        <IonInput value={formData.id_issued_by} onIonInput={updateForm} name='id_issued_by'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Issue Date
                        </IonLabel>
                        <IonInput type='date' value={formData.id_issued_date} onIonInput={updateForm} name='id_issued_date'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Expiration Date</IonLabel>
                        <IonInput type='date' value={formData.id_expiration_date} onIonInput={updateForm} name='id_expiration_date'>
                        </IonInput>
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
                    <IonCol>
                        <IonLabel>
                            Physical Street Address
                        </IonLabel>
                        <IonInput onIonInput={updateForm} value={formData.legal_street} name='legal_street'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            City
                        </IonLabel>
                        <IonInput onIonInput={updateForm} value={formData.legal_city} name='legal_city'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Physical State
                        </IonLabel>
                        <IonSelect interface='action-sheet' onIonChange={updateForm} value={formData.legal_state} name='legal_state'>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Zip
                        </IonLabel>
                        <IonInput value={formData.legal_zip} name='legal_zip' onIonInput={updateForm}></IonInput>
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
                        <IonCol>
                            <IonLabel>Mailing Street Address</IonLabel>
                            <IonInput value={formData.mailing_street} name='mailing_street' onIonInput={updateForm}></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Mailing City</IonLabel>
                            <IonInput value={formData.mailing_city} name='mailing_city' onIonInput={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Mailing State</IonLabel>
                            <IonSelect interface='action-sheet' name='mailing_state' value={formData.mailing_state} onIonChange={updateForm}>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonLabel> Mailing Zip</IonLabel>
                            <IonInput value={formData.mailing_zip} name='mailing_zip' onIonInput={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                </React.Fragment>}
                <IonRow>
                    <IonCol>
                        PRIMARY CONTACT INFO
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Primary Phone
                        </IonLabel>
                        <IonInput value={formData.primary_phone} name='primary_phone' onIonInput={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Preferred Contact Method
                        </IonLabel>
                        <IonSelect interface='action-sheet' value={formData.preferred_contact_method} name='preferred_contact_method' onIonChange={updateForm}>
                            <IonSelectOption value='Email'>Email</IonSelectOption>
                            <IonSelectOption value='Mail'>Mail</IonSelectOption>
                            <IonSelectOption value='Phone (Home)'>Phone (Home)</IonSelectOption>
                            <IonSelectOption value='Phone (Mobile)'>Phone (Mobile)</IonSelectOption>
                            <IonSelectOption value='Phone (Work)'>Phone (Work)</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Email</IonLabel>
                        <IonInput class='item-input' name='email' value={formData.email} placeholder='Email' onIonInput={updateForm} required clearInput>
                        </IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Confirm Email</IonLabel>
                        <IonInput value={confirmEmail} name='confirm_email' onIonInput={updateConfEmail}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <p>SECONDARY CONTACT INFO</p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Alternate Phone</IonLabel>
                        <IonInput value={formData.alternate_phone} name='alternate_phone' onIonInput={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Alternate Phone Type</IonLabel>
                        <IonSelect value={formData.alternate_phone_type} interface='action-sheet' name='alternate_phone_type' onIonChange={updateForm}>
                            <IonSelectOption value='Home'>Home</IonSelectOption>
                            <IonSelectOption value='Mobile'>Mobile</IonSelectOption>
                            <IonSelectOption value='Office'>Office</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default OwnerInformation;