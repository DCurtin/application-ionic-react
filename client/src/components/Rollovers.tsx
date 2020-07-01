import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonRadioGroup, IonRadio, IonItem } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {saveRolloverPage, getRolloverPage} from '../helpers/CalloutHelpers'

const Rollovers : React.FC<SessionApp> = ({sessionId, setShowErrorToast, updateMenuSections, formRef}) => {
    const history = useHistory();
    const {register, handleSubmit, watch, errors} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });
    let watchAllFields = watch();
    const [formData, setFormData] = useState<FormData>({
        account_type: 'Traditional IRA',
        existing_employer_plan_roll_overs: 0
    });

    useEffect(()=>{
        if(sessionId !== '')
        {
            getRolloverPage(sessionId).then(data =>{
                if(data === undefined)
                {
                    return;
                }
                ImportForm(data);
            })
        }
    },[sessionId])

    function ImportForm(data : any){
        setFormData(data);
    }
    
    useEffect(()=>{
      return history.listen(()=>{
        saveRolloverPage(sessionId, formData);
      })
    },[formData])

    const addRollover = () => {
        setFormData(prevState => {
            let currentCount = prevState.existing_employer_plan_roll_overs;
            let newCount = currentCount < 2 ? currentCount + 1 : currentCount;
            return {
                ...prevState,
                existing_employer_plan_roll_overs: newCount
            };
        })
    }

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            return {...prevState, [e.target.name]:newValue}});
    }

    const validateFields = (e: any) => {
        saveRolloverPage(sessionId, formData);
        updateMenuSections('is_rollover_plan_page_valid', true);
        setShowErrorToast(false);
    }

    useEffect(() => {
        showErrorToast();
        console.log(errors)
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = errorsArr.includes(fieldName) ? 'danger' : '';
        if (watchAllFields[fieldName] && !errorsArr.includes(fieldName)) {
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

    const displayRolloverForm = (rolloverCount: number) => {
        if (rolloverCount > 0)
        {
            let formRows = [];
            for (let i = 1; i< rolloverCount + 1; i++){
                formRows.push(
                    <React.Fragment key={i}>
                        <IonItemDivider>
                            <strong>
                                <IonText color='primary'>
                                    Employer Plan {i}
                                </IonText>
                            </strong>
                        </IonItemDivider>
                        <IonRow>
                            <IonCol>
                                <IonLabel> Institution Name</IonLabel>
                                <IonItem className={showError(`institution_name__${i}`)}>
                                    <IonInput name={`institution_name__${i}`} value={formData[`institution_name__${i}`]} placeholder='Institution Name' onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel> Cash Amount (approximate value allowed)</IonLabel>
                                <IonItem className={showError(`cash_amount__${i}`)}>
                                    <IonInput name={`cash_amount__${i}`} value={formData[`cash_amount__${i}`]} onIonInput={updateForm} ref={register({required: true, pattern:/^([0-9]+\.[0-9]+|[0-9]+)$/})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Contact Name
                                </IonLabel>
                                <IonItem className={showError(`name__${i}`)}>
                                    <IonInput name={`name__${i}`} value={formData[`name__${i}`]} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Contact Phone Number
                                </IonLabel>
                                <IonItem className={showError(`phone__${i}`)}>
                                    <IonInput type='number' pattern='/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/' name={`phone__${i}`} value={formData[`phone__${i}`]} onIonInput={updateForm} placeholder='(555)555-5555'  ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Street
                                </IonLabel>
                                <IonItem className={showError(`mailing_street__${i}`)}>
                                    <IonInput name={`mailing_street__${i}`} value={formData[`mailing_street__${i}`]} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    City
                                </IonLabel>
                                <IonItem className={showError(`mailing_city__${i}`)}>
                                    <IonInput name={`mailing_city__${i}`} value={formData[`mailing_city__${i}`]} onIonInput={updateForm} ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    State
                                </IonLabel>
                                <IonItem className={showError(`mailing_state__${i}`)}>
                                    <IonSelect interface='action-sheet' value={formData[`mailing_state__${i}`]} name={`mailing_state__${i}`} onIonChange={updateForm}  ref={register({required: true})} interfaceOptions={{cssClass: 'states-select'}}>
                                        {states.map((state,index) => (
                                            <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonItem className={showError(`mailing_zip__${i}`)}>
                                    <IonInput value={formData[`mailing_zip__${i}`]} name={`mailing_zip__${i}`} onIonInput={updateForm}  ref={register({required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonLabel>
                                    Account Type
                                </IonLabel>
                                <IonItem className={showError(`account_type__${i}`)}>
                                    <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                        {formData.account_type.includes('Roth') ? (
                                            <React.Fragment>
                                                <IonSelectOption value='Roth IRA'>Roth IRA</IonSelectOption>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <IonSelectOption value='Traditional IRA'>
                                                    Traditional IRA
                                                </IonSelectOption>
                                                <IonSelectOption value='SEP IRA'>
                                                    SEP IRA
                                                </IonSelectOption>
                                                <IonSelectOption value='Simple IRA'>
                                                    Simple IRA
                                                </IonSelectOption>
                                            </React.Fragment>
                                        )}
                                        <IonSelectOption value='Individual(k)'>Individual(k)</IonSelectOption>
                                        <IonSelectOption value='Profit Sharing Plan'>
                                            Profit Sharing Plan
                                        </IonSelectOption>
                                        <IonSelectOption value='401(k)'>401(k)</IonSelectOption>
                                        <IonSelectOption value='403(b)'> 403(b)</IonSelectOption>
                                        <IonSelectOption value='Defined Benefit Plan'>Defined Benefit Plan</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonLabel> Account Number</IonLabel>
                                <IonItem className={showError(`account_number__${i}`)}>
                                    <IonInput name={`account_number__${i}`} value={formData[`account_number__${i}`]} onIonInput={updateForm}  ref={register({required: true})}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size='6'>
                                <IonLabel>
                                    Rollover Type
                                </IonLabel>
                                <IonItem className={showError(`rollover_type__${i}`)}>
                                    <IonSelect interface='action-sheet' value={formData[`rollover_type__${i}`]} name={`rollover_type__${i}`} onIonChange={updateForm} ref={register({required: true})}>
                                        <IonSelectOption value='Direct Rollover'>Direct Rollover</IonSelectOption>
                                        <IonSelectOption value='Indirect Rollover'>
                                            Indirect Rollover
                                        </IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                                <em><b>Direct Rollover </b> - Funds are currently in an employer plan.<br/><b>Indirect Rollover</b> - I have or will receive the funds directly from my plan and would like to rollover those funds to my Midland Trust.<br/></em>
                            </IonCol>
                        </IonRow>
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
                        <b>
                        Using this page, you can tell us about your pending employer plan rollover. 
                        </b> &nbsp;
                        The plan administrator of your employer plan account will not allow Midland to initiate the rollover. You, as the plan participant, will be required to contact the plan administrator of your current employer plan to request this rollover. Typically, it’s as easy as calling the phone number on your most recent statement. At the end of this application, we will provide you with "Rollover Instructions" for you to provide to your plan administrator to help expedite the request.

                        As an option you are welcome to provide Midland with your account information to deduct your contribution below, but if mailing a check to our office, please send to the address below and mark the year in which you wish the contribution to be applied to.
                    </IonCol>
                </IonRow>
                {displayRolloverForm(formData.existing_employer_plan_roll_overs)}
                <IonRow>
                    <IonCol>
                    <IonButton onClick={addRollover}>
                        <IonIcon icon={addOutline} slot='start'></IonIcon>
                             Add Rollover
                    </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            </form>
        </IonContent>
    )
}

export default Rollovers;