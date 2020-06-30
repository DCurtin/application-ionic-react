import React, {useState, useEffect} from 'react'; 
import {useForm} from 'react-hook-form';
import { IonItem, IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/react';
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
    let watchAllFields = watch();

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
        updateMenuSections('is_beneficiaries_page_valid', true);
    }

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = errorsArr.includes(fieldName) ? 'danger ion-no-padding' : 'ion-no-padding';
        if (watchAllFields[fieldName]) {
            className = 'ion=no-padding';
        }
        return className;
};
 
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
                            <IonInput name={`first_name__${beneficiaryNumber}`} value={formData[`first_name__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Last Name</IonLabel>
                        <IonItem className={showError(`last_name__${beneficiaryNumber}`)}>
                            <IonInput name={`last_name__${beneficiaryNumber}`} value={formData[`last_name__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Social Security Number</IonLabel>
                        <IonItem className={showError(`ssn__${beneficiaryNumber}`)}>
                            <IonInput name={`ssn__${beneficiaryNumber}`} value={formData[`ssn__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Date of Birth</IonLabel>
                        <IonItem className={showError(`dob__${beneficiaryNumber}`)}>
                            <IonInput type='date' name={`dob__${beneficiaryNumber}`} value={formData[`dob__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel> Beneficiary Type</IonLabel>
                        <IonItem className={showError(`type__${beneficiaryNumber}`)}>
                            <IonSelect interface='action-sheet' name={`type__${beneficiaryNumber}`} value={formData[`type__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}>
                                <IonSelectOption value='Primary'>Primary</IonSelectOption>
                                <IonSelectOption value='Contingent'>Contingent</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Relationship
                        </IonLabel>
                        <IonItem className={showError(`relationship__${beneficiaryNumber}`)}>
                            <IonSelect interface='action-sheet' name={`relationship__${beneficiaryNumber}`} value={formData[`relationship__${beneficiaryNumber}`]}   onIonChange={updateForm} ref={register({required: true})}>
                                <IonSelectOption value='Spouse'>Spouse</IonSelectOption>
                                <IonSelectOption value='Parent'>Parent</IonSelectOption>
                                <IonSelectOption value='Child'>Child</IonSelectOption>
                                <IonSelectOption value='Sibling'>Sibling</IonSelectOption>
                                <IonSelectOption value='Other Family'>Other Family</IonSelectOption>
                                <IonSelectOption value='Other'>Other</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Share %</IonLabel>
                        <IonItem className={showError(`share_percentage__${beneficiaryNumber}`)}>
                            <IonInput type='number' name={`share_percentage__${beneficiaryNumber}`} value={formData[`share_percentage__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                    <IonCol className='well' size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                       Calculated Share Percentage 
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary Street</IonLabel>
                        <IonItem className={showError(`mailing_street__${beneficiaryNumber}`)}>
                            <IonInput name={`mailing_street__${beneficiaryNumber}`} value={formData[`mailing_street__${beneficiaryNumber}`]}onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary City</IonLabel>
                        <IonItem className={showError(`mailing_city__${beneficiaryNumber}`)}>
                            <IonInput name={`mailing_city__${beneficiaryNumber}`} value={formData[`mailing_city__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary State</IonLabel>
                        <IonItem className={showError(`mailing_state__${beneficiaryNumber}`)}>
                            <IonSelect interface='action-sheet' name={`mailing_state__${beneficiaryNumber}`} value={formData[`mailing_state__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}>
                                {states.map((state, index) => (<IonSelectOption key={index} value={state}>{state}</IonSelectOption>))}
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>Beneficiary Zip</IonLabel>
                        <IonItem className={showError(`mailing_zip__${beneficiaryNumber}`)}>
                            <IonInput  name={`mailing_zip__${beneficiaryNumber}`} value={formData[`mailing_zip__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Phone
                        </IonLabel>
                        <IonItem className={showError(`phone__${beneficiaryNumber}`)}>
                            <IonInput  name={`phone__${beneficiaryNumber}`} value={formData[`phone__${beneficiaryNumber}`]} onIonChange={updateForm} ref={register({required: true})}/>
                        </IonItem>
                    </IonCol>
                    <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                        <IonLabel>
                            Email
                        </IonLabel>
                        <IonItem className={showError(`email__${beneficiaryNumber}`)}>
                            <IonInput type='email' onIonChange={updateForm}  name={`email__${beneficiaryNumber}`} value={formData[`email__${beneficiaryNumber}`]} ref={register({required: true})}/>
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