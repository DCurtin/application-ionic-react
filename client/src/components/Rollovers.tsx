import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import { SessionApp, states, FormData, showErrorToast } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonText, IonLabel, IonInput, IonSelectOption, IonSelect, IonItem } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {saveRolloverPage, getRolloverPage} from '../helpers/CalloutHelpers'

const Rollovers : React.FC<SessionApp> = ({sessionId, setShowErrorToast, updateMenuSections, formRef, setShowSpinner}) => {
    const history = useHistory();
    const {control, handleSubmit, errors, formState} = useForm({
        mode: 'onChange'
    });

    const [formData, setFormData] = useState<FormData>({
        account_type: 'Traditional IRA',
        existing_employer_plan_roll_overs: 0
    });


    useEffect(()=>{
        if(sessionId !== '')
        {
            setShowSpinner(true);
            getRolloverPage(sessionId).then(data =>{
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
        showErrorToast(errors, setShowErrorToast);
        return function onUnmount() {
            if (Object.keys(errors).length > 0) {
                updateMenuSections('is_rollover_plan_page_valid', false);
            }
        }
    }, [errors])

    const showError = (fieldName: string) => {
        let errorsArr = (Object.keys(errors));
        let className = '';
        if ((formState.submitCount > 0) && errorsArr.includes(fieldName)) {
            className = 'danger';
        }
        return className;
    };

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
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> Institution Name</IonLabel>
                                <IonItem className={showError(`institution_name__${i}`)}>
                                    <Controller name={`institution_name__${i}`} defaultValue={formData[`institution_name__${i}`]}  control={control} as={ 
                                        <IonInput name={`institution_name__${i}`} value={formData[`institution_name__${i}`]} placeholder='Institution Name'/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> Cash Amount (approximate value allowed)</IonLabel>
                                <IonItem className={showError(`cash_amount__${i}`)}>
                                    <Controller name={`cash_amount__${i}`} defaultValue={formData[`cash_amount__${i}`]} control={control} as={
                                        <IonInput name={`cash_amount__${i}`} value={formData[`cash_amount__${i}`]}type='number'/>
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
                                <IonItem className={showError(`name__${i}`)}>
                                    <Controller name={`name__${i}`} control={control} defaultValue={formData[`name__${i}`]} as={
                                        <IonInput name={`name__${i}`} value={formData[`name__${i}`]}/>
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
                                <IonItem className={showError(`phone__${i}`)}>
                                    <Controller name={`phone__${i}`} control={control} defaultValue={formData[`phone__${i}`]} as={
                                        <IonInput type='tel' name={`phone__${i}`} value={formData[`phone__${i}`]} />
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
                                    Street
                                </IonLabel>
                                <IonItem className={showError(`mailing_street__${i}`)}>
                                    <Controller name={`mailing_street__${i}`} control={control} defaultValue={formData[`mailing_street__${i}`]} as={
                                        <IonInput name={`mailing_street__${i}`} value={formData[`mailing_street__${i}`]} />
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    City
                                </IonLabel>
                                <IonItem className={showError(`mailing_city__${i}`)}>
                                    <Controller name={`mailing_city__${i}`} control={control} defaultValue={formData[`mailing_city__${i}`]} as={
                                        <IonInput name={`mailing_city__${i}`} value={formData[`mailing_city__${i}`]} />
                                    }onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    State
                                </IonLabel>
                                <IonItem className={showError(`mailing_state__${i}`)}>
                                    <Controller name={`mailing_state__${i}`} control={control} defaultValue={formData[`mailing_state__${i}`]} as={
                                        <IonSelect interface='action-sheet' value={formData[`mailing_state__${i}`]} name={`mailing_state__${i}`} interfaceOptions={{cssClass: 'states-select'}}>
                                            {states.map((state,index) => (
                                                <IonSelectOption value={state} key={index}>{state}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Zip
                                </IonLabel>
                                <IonItem className={showError(`mailing_zip__${i}`)}>
                                    <Controller name={`mailing_zip__${i}`} defaultValue={formData[`mailing_zip__${i}`]}  control={control} as={ 
                                        <IonInput value={formData[`mailing_zip__${i}`]} name={`mailing_zip__${i}`}/>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true, pattern:/^[0-9]{5}(?:-[0-9]{4})?$/}} />
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel>
                                    Account Type
                                </IonLabel>
                                <IonItem className={showError(`account_type__${i}`)}>
                                    <Controller name={`account_type__${i}`} control={control} defaultValue={formData[`account_type__${i}`]}  as={
                                        <IonSelect interface='action-sheet' value={formData[`account_type__${i}`]} name={`account_type__${i}`} interfaceOptions={{cssClass: 'states-select'}}>
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
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}} />
                                </IonItem>
                            </IonCol>
                            <IonCol size="6" sizeMd="6" sizeSm="12" sizeXs="12">
                                <IonLabel> Account Number</IonLabel>
                                <IonItem className={showError(`account_number__${i}`)}>
                                    <Controller name={`account_number__${i}`} control={control} defaultValue={formData[`account_number__${i}`]} as={
                                        <IonInput name={`account_number__${i}`} value={formData[`account_number__${i}`]}/>
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
                                    Rollover Type
                                </IonLabel>
                                <IonItem className={showError(`rollover_type__${i}`)}>
                                    <Controller name={`rollover_type__${i}`} control={control} defaultValue={formData[`rollover_type__${i}`]} as={
                                        <IonSelect interface='action-sheet' value={formData[`rollover_type__${i}`]} name={`rollover_type__${i}`}>
                                            <IonSelectOption value='Direct Rollover'>Direct Rollover</IonSelectOption>
                                            <IonSelectOption value='Indirect Rollover'>
                                                Indirect Rollover
                                            </IonSelectOption>
                                        </IonSelect>
                                    } onChangeName="onIonChange" onChange={([selected]) => {
                                        updateForm(selected);
                                        return selected.detail.value;
                                    }} rules={{required: true}}/>
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