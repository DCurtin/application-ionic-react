import React, { useEffect } from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption, IonItem, IonCheckbox, IonInput, IonButton } from '@ionic/react';
import './Welcome.css';

import {useHistory} from 'react-router-dom';

import {welcomePageParameters, SessionApp, saveWelcomeParameters, initialInvestmentTypes} from "../helpers/Utils";
import { Interface } from 'readline';

interface InitSessionApp extends SessionApp {
    welcomePageFields: welcomePageParameters,
    setWelcomePageFields: Function,
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
    
    const handleAccountTypeSelected = (event: CustomEvent) => {
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        updatedwelcomePageFields.account_type = event.detail.value
        props.setWelcomePageFields({
            ...updatedwelcomePageFields
        });
    }

    const handleInitialInvestmentChange = (event: CustomEvent) => {
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        updatedwelcomePageFields.investment_type = event.detail.value
        props.setWelcomePageFields({
            ...updatedwelcomePageFields
        });
    }

    const handleSalesRepChange = (event: CustomEvent) => {
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        updatedwelcomePageFields.sales_rep = event.detail.value
        props.setWelcomePageFields({
            ...updatedwelcomePageFields
        });
    }
    
    const handleSpecifiedSourceChange = (event: CustomEvent) => {
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        updatedwelcomePageFields.referred_by = event.detail.value
        props.setWelcomePageFields({
            ...updatedwelcomePageFields
        });
    }
    
    const handleReferralCodeChange = (event: CustomEvent) => {
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        updatedwelcomePageFields.referral_code = event.detail.value
        props.setWelcomePageFields({
            ...updatedwelcomePageFields
        });
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
              return initValues.transfer_form
            case 'RolloverEmployer':
              return initValues.rollover_form
            case 'CashContribution':
              return initValues.cash_contribution_form
            default:
              return false;
          }
    }

    const handleChecked = (event: CustomEvent) => {
        console.log(event.detail.value);
        console.log(event.detail.checked);
        let updatedwelcomePageFields : welcomePageParameters = props.welcomePageFields
        if(event.detail.value === 'TransferIra'){
            updatedwelcomePageFields.transfer_form = event.detail.checked
            props.setWelcomePageFields({
                ...updatedwelcomePageFields
            });
        }

        if(event.detail.value === 'RolloverEmployer'){
            updatedwelcomePageFields.rollover_form = event.detail.checked
            props.setWelcomePageFields({
                ...updatedwelcomePageFields
            });
        }

        if(event.detail.value === 'CashContribution'){
            updatedwelcomePageFields.cash_contribution_form = event.detail.checked
            props.setWelcomePageFields({
                ...updatedwelcomePageFields
            });
        }
    }


    useEffect(()=>{
        //save state on page change
        return history.listen(()=>{
            //save initial data
            //return session id
            console.log('saving welcome page');
            
            var url = '/startApplication'
            if(props.sessionId !== ''){
                url = '/saveState'
            }
            console.log(url);
            console.log(props.sessionId);
            let body : saveWelcomeParameters ={
                session: {sessionId: props.sessionId, page: 'welcomePage'},
                data: props.welcomePageFields
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
    },[props.welcomePageFields])

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
                       <IonSelect value={props.welcomePageFields.account_type} onIonChange={handleAccountTypeSelected}>
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
                            getFundingOptions(props.welcomePageFields.account_type).map((fundingType, index) => {
                                return (
                                <IonItem key={index}>
                                    <IonCheckbox color="primary" slot="start" value={fundingType[0]} onIonChange={handleChecked} checked={IsChecked(fundingType[0],  props.welcomePageFields)}></IonCheckbox>
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
                        <IonSelect value={props.welcomePageFields.investment_type} onIonChange={handleInitialInvestmentChange} interfaceOptions={{header: 'Initial Investment'}}>
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
                        <IonSelect value={props.welcomePageFields.sales_rep} onIonChange={handleSalesRepChange}>
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
                        <IonInput value={props.welcomePageFields.referred_by} onIonChange={handleSpecifiedSourceChange}>

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
                        <IonInput value={props.welcomePageFields.referral_code} onIonChange={handleReferralCodeChange}></IonInput>
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