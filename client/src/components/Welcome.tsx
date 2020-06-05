import React, { useEffect } from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption, IonItem, IonCheckbox, IonInput, IonButton } from '@ionic/react';
import './Welcome.css';

import {useHistory} from 'react-router-dom';

import {WelcomePageParamters, SessionApp, saveWelcomeParamters} from "../helpers/Utils"
import { Interface } from 'readline';

interface InitSessionApp extends SessionApp {
    initialValues: WelcomePageParamters,
    setInitialValues: Function,
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
    const initialInvestmentTypes = [`I'm Not Sure`, `Futures/Forex`, `Closely-Held LLC`, `Private Placement`, `Promissory Note (Unsecured)`, `Promissory Note (Secured by Real Estate)`, `Promissory Note (Secured by Other)`, `Precious Metals`, `Real Estate`, `Other`];

    const midlandReps = [`Not Applicable`, `Adam Sypniewski`, `Brad Janitz`, `Daniel Hanlon`, `Danny Grossman`, `Eric Lutz`, `Kelsey Dineen`, `Matt Calhoun`, `Rita Woods`, `Sacha Bretz`];
    
    const handleAccountTypeSelected = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                AccountType: event.detail.value
            }
        )
    }

    const handleInitialInvestmentChange = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                InitialInvestment: event.detail.value
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

    const IsChecked: Function =  (key: string, initValues: WelcomePageParamters) =>{
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
        console.log(event.detail.value);
        console.log(event.detail.checked);
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
        //save state on page change
        return history.listen(()=>{
            //save initial data
            //return session id
            console.log('saving welcome page');
            let url = '/startApplication'
            let body : saveWelcomeParamters ={
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

    return (
        <IonContent className="ion-padding">
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
                       <IonSelect value={props.initialValues.AccountType} onIonChange={handleAccountTypeSelected}>
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
                        <IonSelect value={props.initialValues.InitialInvestment} onIonChange={handleInitialInvestmentChange} interfaceOptions={{header: 'Initial Investment'}}>
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
                        <IonSelect>
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
                        <IonInput>

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
                        <IonInput></IonInput>
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
        </IonContent>
    );
}

export default Welcome; 