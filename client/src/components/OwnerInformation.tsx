import React, {useState, useEffect} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput,IonCheckbox, IonRadioGroup, IonRadio } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { SessionApp, states, requestBody, applicantId, saveApplicationId} from '../helpers/Utils';


const OwnerInformation: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
        const [formData, setFormData] = useState<applicantId>({
            isSelfEmployed: false,
            hasHSA: false,
            homeAndMailingAddressDifferent: false,
            firstName:'',
            lastName:'', 
            ssn: '', 
            email: '', 
            confirmEmail:'',
            dob: '', 
            salutation: '',
            maritalStatus: '',
            mothersMaidenName: '',
            occupation: '',
            idType: '', 
            idNumber: '',
            issuedBy:'', 
            issueDate: '', 
            expirationDate: '',
            legalAddress: '', 
            legalCity: '', 
            legalState:'',
            legalZip: '',
            mailingAddress: '', 
            mailingCity: '', 
            mailingState: '',
            mailingZip: '', 
            primaryPhone: '', 
            preferredContactMethod:'', 
            alternatePhone:'', 
            alternatePhoneType:''
        });
        const history = useHistory();

        const updateForm = (e : any) => {
            let newValue = e.target.name === 'homeAndMailingAddressDifferent' ? e.target.checked : e.target.value;
            setFormData(previousState =>({
            ...previousState,
              [e.target.name]: newValue
            }));
        }

        
    
        function ImportForm(data : any){
            let importedForm : applicantId = data
            setFormData(importedForm);
        }
    
        useEffect(()=>{
            if(sessionId !== '')
            {
               //query fields
              let url = '/getPageFields'
              let body : requestBody ={
                session:{sessionId: sessionId, page: 'appId'},
                data: undefined
              }
              let options = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
              }
              fetch(url, options).then(function(response: any){
                response.json().then(function(data: any){
                    if(data.data === undefined){
                        return;
                    }
                  ImportForm(data.data);
                })
              })
            }
        },[sessionId])
    
        useEffect(()=>{
          return history.listen(()=>{
            let url = '/saveState'
            let body : saveApplicationId= {
            session: {sessionId: sessionId, page: 'appId'},
            data: formData
            }
            let options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
            }
            fetch(url, options).then(function(response: any){
            response.json().then(function(data: any){
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
                        <IonSelect name="salutation" value={formData.salutation} onIonChange={updateForm}>
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
                        <IonInput class='item-input' name="firstName" value={formData.firstName} placeholder="First Name" onIonInput={updateForm} clearInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Last Name *
                        </IonLabel>
                        <IonInput class='item-input' name="lastName" value={formData.lastName} placeholder="Last Name" onIonInput={updateForm} clearInput></IonInput>
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
                        <IonSelect name='maritalStatus' onIonChange={updateForm}>
                            <IonSelectOption value="Single">Single</IonSelectOption>
                            <IonSelectOption value="Married">Married</IonSelectOption>
                            <IonSelectOption value="Widowed/Divorced">Widowed/Divorced</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Mother's Maiden Name</IonLabel>
                        <IonInput name='mothersMaidenName' value={formData.mothersMaidenName} onIonInput={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Occupation</IonLabel>
                        <IonSelect name='occupation' onIonChange={updateForm} value={formData.occupation}>
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
                            <IonRadioGroup name='isSelfEmployed' onIonChange={updateForm} value={formData.isSelfEmployed} >
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
                            <IonRadioGroup name='hasHSA' onIonChange={updateForm} value={formData.hasHSA}> 
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
                        <IonSelect value={formData.idType} onIonChange={updateForm} name='idType'>
                            <IonSelectOption value={`Driver's License`}>Driver's License</IonSelectOption>
                            <IonSelectOption value='Passport'>Passport</IonSelectOption>
                            <IonSelectOption value='Other'>Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel> ID Number </IonLabel>
                        <IonInput value={formData.idNumber} name='idNumber' onIonInput={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Issued By
                        </IonLabel>
                        <IonInput value={formData.issuedBy} onIonInput={updateForm} name='issuedBy'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Issue Date
                        </IonLabel>
                        <IonInput type='date' value={formData.issueDate} onIonInput={updateForm} name='issueDate'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size='6'>
                        <IonLabel>Expiration Date</IonLabel>
                        <IonInput type='date' value={formData.expirationDate} onIonInput={updateForm} name='expirationDate'>
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
                        <IonInput onIonInput={updateForm} value={formData.legalAddress} name='legalAddress'></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            City
                        </IonLabel>
                        <IonInput onIonInput={updateForm} value={formData.legalCity} name='legalCity'></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Physical State
                        </IonLabel>
                        <IonSelect onIonChange={updateForm} value={formData.legalState} name='legalState'>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Zip
                        </IonLabel>
                        <IonInput value={formData.legalZip} name='legalZip' onIonInput={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonCheckbox checked={formData.homeAndMailingAddressDifferent} name='homeAndMailingAddressDifferent' onIonChange={updateForm}></IonCheckbox> &nbsp; My mailing address is different than my physical address
                        <p></p>
                    </IonCol>
                </IonRow>
                {formData.homeAndMailingAddressDifferent && <React.Fragment>
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
                            <IonInput value={formData.mailingAddress} name='mailingAddress' onIonInput={updateForm}></IonInput>
                        </IonCol>
                        <IonCol>
                            <IonLabel>Mailing City</IonLabel>
                            <IonInput value={formData.mailingCity} name='mailingCity' onIonInput={updateForm}></IonInput>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonLabel>Mailing State</IonLabel>
                            <IonSelect name='mailingState' value={formData.mailingState} onIonChange={updateForm}>
                            {states.map((state, index) => <IonSelectOption value={state} key={index}>{state}</IonSelectOption>)}
                            </IonSelect>
                        </IonCol>
                        <IonCol>
                            <IonLabel> Mailing Zip</IonLabel>
                            <IonInput value={formData.mailingZip} name='mailingZip' onIonInput={updateForm}></IonInput>
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
                        <IonInput value={formData.primaryPhone} name='primaryPhone' onIonInput={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Preferred Contact Method
                        </IonLabel>
                        <IonSelect value={formData.preferredContactMethod} name='preferredContactMethod' onIonChange={updateForm}>
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
                        <IonInput value={formData.confirmEmail} name='confirmEmail' onIonInput={updateForm}></IonInput>
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
                        <IonInput value={formData.alternatePhone} name='alternatePhone' onIonInput={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Alternate Phone Type</IonLabel>
                        <IonSelect value={formData.alternatePhoneType} name='alternatePhoneType' onIonChange={updateForm}>
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