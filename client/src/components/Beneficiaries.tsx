import React, {useState, useEffect} from 'react'; 
import {useForm} from 'react-hook-form';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import {SessionApp, states, FormData, requestBody} from '../helpers/Utils';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {getBenePage, saveBenePage} from '../helpers/CalloutHelpers'

const Beneficiaries: React.FC<SessionApp> = ({sessionId, setSessionId, updateMenuSections, formRef}) => {
    const history = useHistory();
    const {register, handleSubmit, watch, errors} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    }); 
    const [formData, setFormData] = useState<FormData>({
        beneficiary_count: 0
    })

    useEffect(()=>{
        if(sessionId !== '')
        {
            getBenePage(sessionId).then(data =>{
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
        saveBenePage(sessionId, formData);
        updateMenuSections('isBeneficiariesPageValid', true);
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
                    <IonCol>
                        <IonLabel>
                            First Name
                        </IonLabel>
                        <IonInput name={`first_name__${beneficiaryNumber}`} value={formData[`first_name__${beneficiaryNumber}`]} onIonChange={updateForm}>
                        </IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Last Name</IonLabel>
                        <IonInput name={`last_name__${beneficiaryNumber}`} value={formData[`last_name__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Social Security Number</IonLabel>
                        <IonInput name={`ssn__${beneficiaryNumber}`} value={formData[`ssn__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Date of Birth</IonLabel>
                        <IonInput type='date' name={`dob__${beneficiaryNumber}`} value={formData[`dob__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel> Type </IonLabel>
                        <IonSelect interface='action-sheet' name={`type__${beneficiaryNumber}`} value={formData[`type__${beneficiaryNumber}`]} onIonChange={updateForm}>
                            <IonSelectOption value='Primary'>Primary</IonSelectOption>
                            <IonSelectOption value='Contingent'>Contingent</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Relationship
                        </IonLabel>
                        <IonSelect interface='action-sheet' name={`relationship__${beneficiaryNumber}`} value={formData[`relationship__${beneficiaryNumber}`]}   onIonChange={updateForm}>
                            <IonSelectOption value='Spouse'>Spouse</IonSelectOption>
                            <IonSelectOption value='Parent'>Parent</IonSelectOption>
                            <IonSelectOption value='Child'>Child</IonSelectOption>
                            <IonSelectOption value='Sibling'>Sibling</IonSelectOption>
                            <IonSelectOption value='Other Family'>Other Family</IonSelectOption>
                            <IonSelectOption value='Other'>Other</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Share %</IonLabel>
                        <IonInput type='number' name={`share_percentage__${beneficiaryNumber}`} value={formData[`share_percentage__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol className='well'>
                       Calculated Share Percentage 
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Beneficiary Street</IonLabel>
                        <IonInput name={`mailing_street__${beneficiaryNumber}`} value={formData[`mailing_street__${beneficiaryNumber}`]}onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Beneficiary City</IonLabel>
                        <IonInput name={`mailing_city__${beneficiaryNumber}`} value={formData[`mailing_city__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>Beneficiary State</IonLabel>
                        <IonSelect interface='action-sheet' name={`mailing_state__${beneficiaryNumber}`} value={formData[`mailing_state__${beneficiaryNumber}`]} onIonChange={updateForm}>
                            {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>Beneficiary Zip</IonLabel>
                        <IonInput  name={`mailing_zip__${beneficiaryNumber}`} value={formData[`mailing_zip__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Phone
                        </IonLabel>
                        <IonInput  name={`phone__${beneficiaryNumber}`} value={formData[`phone__${beneficiaryNumber}`]} onIonChange={updateForm}></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Email
                        </IonLabel>
                        <IonInput type='email' onIonChange={updateForm}  name={`email__${beneficiaryNumber}`} value={formData[`email__${beneficiaryNumber}`]}></IonInput>
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