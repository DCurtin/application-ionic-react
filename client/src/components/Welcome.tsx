import React, { useEffect, useRef } from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption, IonItem, IonCheckbox, IonInput, IonButton } from '@ionic/react';
import './Welcome.css';
import {useForm} from 'react-hook-form';

import {useHistory} from 'react-router-dom';

import {welcomePageParameters, SessionApp, saveWelcomeParameters, initialInvestmentTypes} from "../helpers/Utils";


interface InitSessionApp extends SessionApp {
    initialValues: welcomePageParameters,
    setInitialValues: Function,
    updateMenuSections: Function,
    validateOnNext:boolean
}

const Welcome: React.FC<InitSessionApp> = props => {
    const history = useHistory();
    const accountTypes = [
        'Traditional IRA', 
        'Roth IRA', 
        'SEP IRA',
        'Inherited IRA - Traditional',
        'Inherited IRA - Roth'
    ]

    const midlandReps = [`Not Applicable`, `Adam Sypniewski`, `Brad Janitz`, `Daniel Hanlon`, `Danny Grossman`, `Eric Lutz`, `Kelsey Dineen`, `Matt Calhoun`, `Rita Woods`, `Sacha Bretz`]; 

    const {register, handleSubmit, watch, errors} = useForm(); 
    const formRef = useRef<HTMLFormElement>(null);

    
    const handleAccountTypeSelected = (event: CustomEvent) => {
        if (event.detail.value.includes('Inherited')) {
            props.setInitialValues(
                {...props.initialValues,
                AccountType: event.detail.value,
                RolloverEmployer: false, 
                CashContribution: false
                }
            )
        } else {
            props.setInitialValues(
                {
                    ...props.initialValues,
                    AccountType: event.detail.value
                }
            )
        }
    }

    const handleInitialInvestmentChange = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                InitialInvestment: event.detail.value
            }
        )
    }

    const handleSalesRepChange = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                SalesRep: event.detail.value
            }
        )
    }
    
    const handleSpecifiedSourceChange = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                SpecifiedSource: event.detail.value
            }
        )
    }
    
    const handleReferralCodeChange = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                ReferralCode: event.detail.value
            }
        )
    }

    const getFundingOptions = (accountType: string) => {
       let fundingOptions = {
            'TransferIra':'Transfer from another IRA'
        }

        if (accountType.includes('Inherited')) {
            return Object.entries({...fundingOptions});
        }
        return Object.entries({...fundingOptions, 'RolloverEmployer':'Rollover from an employer plan', 'CashContribution':'Make a new cash contribution'});
    }

    const IsChecked: Function =  (key: string, initValues: welcomePageParameters) =>{
        switch (key) {
            case 'TransferIra': 
              return initValues['TransferIra']
            case 'RolloverEmployer':
              return initValues['RolloverEmployer']
            case 'CashContribution':
              return initValues['CashContribution']
            default:
              return false;
          }
    }

    const handleChecked = (event: CustomEvent) => {
        if(event.detail.value === 'TransferIra'){
            props.setInitialValues(
                {
                    ...props.initialValues,
                    TransferIra: event.detail.checked
                }
            )
        }

        if(event.detail.value === 'RolloverEmployer'){
            props.setInitialValues(
                {
                    ...props.initialValues,
                    RolloverEmployer: event.detail.checked
                }
            )
        }

        if(event.detail.value === 'CashContribution'){
            props.setInitialValues(
                {
                    ...props.initialValues,
                    CashContribution: event.detail.checked
                }
            )
        }
    }

    useEffect(()=>{
        return history.listen(()=>{
            //save initial data
            //return session id            
            var url = '/startApplication'
            if(props.sessionId !== ''){
                url = '/saveState'
            }
            let body : saveWelcomeParameters ={
                session: {sessionId: props.sessionId, page: 'welcomePage'},
                data: props.initialValues
            }
            let options = {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }

            fetch(url, options).then((response)=>{
                response.json().then(function(data: any){
                    console.log(data);
                    props.setSessionId(data.sessionId);
                  })
            })
        })
    },[props.initialValues])

    useEffect(() => {
        if(props.validateOnNext) {
            if (formRef !== null && formRef.current !== null) {
                formRef.current.dispatchEvent(new Event('submit'));
            }
        }
    }, [props.validateOnNext])



    const validateFields = () => {
        props.updateMenuSections(true);
    }

    return (
        <IonContent className="ion-padding">
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
             <IonGrid>
                <IonRow color="medium" className="well">
                    <IonCol>
                        <p>
                            <strong>
                                MIDLAND ONLINE APPLICATION:
                            </strong>
                            This online application will take about 10-15 minutes to complete. Before you start, we recommend having a credit card, photo ID, beneficiary information, and a current retirement plan statement on hand.
                        </p>
                        <p>
                         <strong>
                         IMPORTANT NOTICE:
                        </strong>
                         Federal law requires all financial institutions to obtain, verify and record information that identifies each person who opens an account. We require that you provide your name, date of birth, and taxpayer ID. 
                        </p>
                        <p>
                            <strong>
                            THIS IS A SECURE APPLICATION:
                            </strong>
                            Midland uses several security features including browser encryption to ensure the privacy and security of your personal financial information.
                        </p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel color="primary">
                            <strong>
                                What type of account would you like to open?
                            </strong>
                        </IonLabel>
                       <IonSelect interface='action-sheet' value={props.initialValues.AccountType} onIonChange={handleAccountTypeSelected} name='accountType' ref={register({required: true})}>
                           {accountTypes.map((accountType, index) => 
                           (<IonSelectOption key={index} value={accountType}>
                               {accountType}
                           </IonSelectOption>))}
                        </IonSelect> 
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <i>
                            <p>
                                All Midland accounts are self-directed.
                            </p>
                            <p>
                                If you'd like to open a 401k, ESA, or HSA please call our office at (866) 839-0429.
                            </p>
                        </i>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <strong>
                                How would you like to fund your account?
                            </strong>
                        </IonLabel>
                        <p>Check all that apply.</p>
                        {
                            getFundingOptions(props.initialValues.AccountType).map((fundingType, index) => {
                                return (
                                <IonItem key={index}>
                                    <IonCheckbox color="primary" slot="start" value={fundingType[0]} onIonChange={handleChecked} checked={IsChecked(fundingType[0],  props.initialValues)}></IonCheckbox>
                                <IonLabel>{fundingType[1]}</IonLabel>
                                </IonItem>
                                )
                            })
                        }
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <strong>
                                Do you have an initial investment in mind?
                            </strong>
                        </IonLabel>
                        <IonSelect interface='action-sheet' value={props.initialValues.InitialInvestment} onIonChange={handleInitialInvestmentChange} interfaceOptions={{header: 'Initial Investment'}} name='initialInvestment' ref={register({required: true})}>
                            {initialInvestmentTypes.map((investmentType, index) => (
                            <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <strong>
                                Have you been working with a Midland rep?
                            </strong>
                        </IonLabel>
                        <IonSelect value={props.initialValues.SalesRep} onIonChange={handleSalesRepChange}>
                            {midlandReps.map((rep, index) => (
                                <IonSelectOption value={rep} key={index}>{rep}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <strong> 
                                How did you hear about us?
                            </strong>
                        </IonLabel>
                        <IonInput value={props.initialValues.SpecifiedSource} onIonChange={handleSpecifiedSourceChange}>

                        </IonInput>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            <strong>
                                Referral / Group Code
                            </strong>
                        </IonLabel>
                        <IonInput value={props.initialValues.ReferralCode} onIonChange={handleReferralCodeChange}></IonInput>
                        <IonButton color="primary">Apply Code</IonButton>
                    </IonCol>
                </IonRow>
               <IonRow className="well">
                   <IonCol>
                       <p>
                       When you're ready to continue, please press the "Next" button at the top of the screen!
                       </p>
                   </IonCol>
               </IonRow>
             </IonGrid>
            </form>
        </IonContent>
    );
}

export default Welcome; 