import React, {useState, useEffect} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput,IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { SessionApp, states } from '../helpers/Utils';


const OwnerInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
        const [formData, setFormData] = useState({
            first_name__c:'',
             last_name__c:'', 
             ssn__c: '', 
             email__c: '', 
             confirm_email__c:'',
             dob__c: '', 
             salutation__c: '',
            marital_status__c: '',
            mother_s_maiden_name__c: '',
            occupation__c: '',
            isSelfEmployed__c: false,
            hasHSA__c: false,
            id_type__c: '', 
            id_number__c: '',
            issued_by__c:'', 
            issue_date__c: '', 
            expiration_date__c: '',
            legal_address__c: '', 
            legal_city__c: '', 
            legal_state__c:'',
            legal_zip__c: '',
            home_and_mailing_address_different__c: false,
            mailing_address__c: '', 
            mailing_city__c: '', 
            mailing_state__c: '',
            mailing_zip__c: '', 
            primary_phone__c: '', 
            preferred_contact_method__c:'', 
            alternate_phone__c:'', 
            alternate_phone_type__c:''
        });
        const history = useHistory();
        const updateForm = (e : any) => {
            let newValue = e.target.name == 'home_and_mailing_address_different__c' ? e.target.checked : e.target.value;
            setFormData({
            ...formData,
              [e.target.name]: newValue
            });
            console.log(formData);
        }
    
        function ImportForm(data : any){
            let importedForm = {
                first_name__c: data['first_name__c'], 
                last_name__c: data['last_name__c'], 
                ssn__c: data['ssn__c'], 
                email__c: data['email__c'], 
                confirm_email__c: data['confirm_email__c'],
                dob__c: data['dob__c'], 
                salutation__c: data['salutation__c'],
                marital_status__c: data['marital_status__c'],
                mother_s_maiden_name__c: data['mother_s_maiden_name__c'],
                occupation__c: data['occupation__c'],
                isSelfEmployed__c: data['isSelfEmployed__c'],
                hasHSA__c: data['hasHSA__c'],
                id_type__c: data['id_type__c'], 
                id_number__c: data['id_number__c'],
                issued_by__c:data['issued_by__c'], 
                issue_date__c: data['issue_date__c'], 
                expiration_date__c: data['expiration_date__c'],
                legal_address__c: data['legal_address__c'], 
                legal_city__c: data['legal_city__c'], 
                legal_state__c:data['legal_state__c'],
                legal_zip__c: data['legal_zip__c'],
                home_and_mailing_address_different__c: data['home_and_mailing_address_different__c'],
                mailing_address__c: data['mailing_address__c'], 
                mailing_city__c: data['mailing_city__c'], 
                mailing_state__c: data['mailing_state__c'],
                mailing_zip__c: data['mailing_zip__c'], 
                primary_phone__c: data['primary_phone__c'], 
                preferred_contact_method__c:data['preferred_contact_method__c'], 
                alternate_phone__c:data['alternate_phone__c'], 
                alternate_phone_type__c:data['alternate_phone_type__c']
            }

            console.log('data');
            console.log(data);

            console.log('importedForm');
            console.log(importedForm);

            setFormData(importedForm);
        }
    
        useEffect(()=>{
            console.log('sessionId ' + sessionId );
            if(sessionId !== '')
            {
               //query fields
              let url = '/getPageFields'
              let body ={
                session:{sessionId: sessionId, page: 'appId'}
              }
              let options = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
              }
              fetch(url, options).then(function(response: any){
                response.json().then(function(data: any){
                  ImportForm(data[0]);
                })
              })
            }
           
            return function cleanup() {
                console.log('cleaning up sess id')
              }
        },[sessionId])
    
        useEffect(()=>{
          return history.listen(()=>{
            let url = '';
            if(sessionId === '')
            {
                url = '/startApplication'
            }else{
                url = '/saveState'
            }

            let body = {
            session:{sessionId: sessionId, page: 'appId'},
            data: formData
            }
            let options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            }
            fetch(url, options).then(function(response: any){
            response.json().then(function(data: any){
                setSessionId(data.sessionId);
            })
            });
          })
        },[formData])

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
                        <IonSelect name="salutation__c" value={formData.salutation__c} onIonChange={updateForm}>
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
                        <IonInput class='item-input' name="first_name__c" value={formData.first_name__c} placeholder="First Name" onIonChange={updateForm} clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Last Name *
                        </IonLabel>
                        <IonInput class='item-input' name="last_name__c" value={formData.last_name__c} placeholder="Last Name" onIonChange={updateForm} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Social Security Number *
                        </IonLabel>
                        <IonInput class='item-input' name="ssn__c" value={formData.ssn__c} placeholder="Social" onIonChange={updateForm} required clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Date of Birth *
                        </IonLabel>
                        <IonInput type='date' class='item-input' name="dob__c" value={formData.dob__c} placeholder="Date of Birth" onIonChange={e => updateForm(e!)} clearInput></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Marital Status
                        </IonLabel>
                        <IonSelect name='marital_status__c' onIonChange={updateForm}>
                            <IonSelectOption value="Single">Single</IonSelectOption>
                            <IonSelectOption value="Married">Married</IonSelectOption>
                            <IonSelectOption value="Widowed/Divorced">Widowed/Divorced</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Mother's Maiden Name</IonLabel>
                        <IonInput name='mother_s_maiden_name__c' value={formData.mother_s_maiden_name__c} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Occupation</IonLabel>
                        <IonSelect name='occupation__c' onIonChange={updateForm} value={formData.occupation__c}>
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
                            <IonRadioGroup name='isSelfEmployed__c' onIonChange={updateForm} value={formData.isSelfEmployed__c} >
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
                            <IonRadioGroup name='hasHSA__c' onIonChange={updateForm} value={formData.hasHSA__c}> 
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
                        <IonSelect value={formData.id_type__c} onIonChange={updateForm} name='id_type__c'>
                            <IonSelectOption value={`Driver's License`}>Driver's License</IonSelectOption>
                            <IonSelectOption value='Passport'>Passport</IonSelectOption>
                            <IonSelectOption value='Other'>Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel> ID Number </IonLabel>
                        <IonInput value={formData.id_number__c} name='id_number__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Issued By
                        </IonLabel>
                        <IonInput value={formData.issued_by__c} onIonChange={updateForm} name='issued_by__c'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Issue Date
                        </IonLabel>
                        <IonInput type='date' value={formData.issue_date__c} onIonChange={updateForm} name='issue_date__c'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Expiration Date</IonLabel>
                        <IonInput type='date' value={formData.expiration_date__c} onIonChange={updateForm} name='expiration_date__c'>
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
                        <IonInput onIonChange={updateForm} value={formData.legal_address__c} name='legal_address__c'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            City
                        </IonLabel>
                        <IonInput onIonChange={updateForm} value={formData.legal_city__c} name='legal_city__c'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Physical State
                        </IonLabel>
                        <IonSelect onIonChange={updateForm} value={formData.legal_state__c} name='legal_state__c'>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Zip
                        </IonLabel>
                        <IonInput value={formData.legal_zip__c} name='legal_zip__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonCheckbox checked={formData.home_and_mailing_address_different__c} name='home_and_mailing_address_different__c' onIonChange={updateForm}></IonCheckbox> &nbsp; My mailing address is different than my physical address
                        <p></p>
                    </IonCol>
                </IonRow>
                {formData.home_and_mailing_address_different__c && <React.Fragment>
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
                            <IonInput value={formData.mailing_address__c} name='mailing_address__c' onIonChange={updateForm}></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Mailing City</IonLabel>
                            <IonInput value={formData.mailing_city__c} name='mailing_city__c' onIonChange={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Mailing State</IonLabel>
                            <IonSelect name='mailing_state__c' value={formData.mailing_state__c} onIonChange={updateForm}>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonLabel> Mailing Zip</IonLabel>
                            <IonInput value={formData.mailing_zip__c} name='mailing_zip__c' onIonChange={updateForm}></IonInput>
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
                        <IonInput value={formData.primary_phone__c} name='primary_phone__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Preferred Contact Method
                        </IonLabel>
                        <IonSelect value={formData.preferred_contact_method__c} name='preferred_contact_method__c' onIonChange={updateForm}>
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
                        <IonInput class='item-input' name='email__c' value={formData.email__c} placeholder='Email' onIonChange={updateForm} required clearInput>
                        </IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Confirm Email</IonLabel>
                        <IonInput value={formData.confirm_email__c} name='confirm_email__c' onIonChange={updateForm}></IonInput>
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
                        <IonInput value={formData.alternate_phone__c} name='alternate_phone__c' onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Alternate Phone Type</IonLabel>
                        <IonSelect value={formData.alternate_phone_type__c} name='alternate_phone_type__c' onIonChange={updateForm}>
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