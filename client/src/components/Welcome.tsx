import React from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption, IonItemDivider, IonItem, IonItemGroup, IonCheckbox } from '@ionic/react';
import './Welcome.css';

const Welcome: React.FC<{selectedAccountType: string; onAccountTypeSelected: (accountType: string) => void}> = props => {
    const accountTypes = [
        'Traditional IRA', 
        'Roth IRA', 
        'SEP IRA',
        'Inherited IRA - Traditional',
        'Inherited IRA - Roth'
    ]
    
    const handleAccountTypeSelected = (event: CustomEvent) => {
        props.onAccountTypeSelected(event.detail.value);
    }

    const getFundingOptions = (accountType: string) => {
        let fundingOptions = [
            'Transfer from another IRA'
        ]

        if (accountType.includes('Inherited')) {
            return [...fundingOptions];
        }
        return [...fundingOptions, 'Rollover from an employer plan', 'Make a new cash contribution'];
    }

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
                       <IonSelect value={props.selectedAccountType} onIonChange={handleAccountTypeSelected}>
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
                            getFundingOptions(props.selectedAccountType).map((fundingType, index) => {
                                return (
                                <IonItem key={index}>
                                    <IonCheckbox color="primary" slot="start" value={fundingType}></IonCheckbox>
                                <IonLabel>{fundingType}</IonLabel>
                                </IonItem>
                                )
                            })
                        }
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}

export default Welcome; 