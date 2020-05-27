import React from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption, IonItemDivider, IonItem, IonItemGroup } from '@ionic/react';
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

    return (
        <IonContent className="ion-padding">
            <IonGrid>
                <IonRow>
                    <IonCol color="primary">
                        <strong>
                            MIDLAND ONLINE APPLICATION:
                        </strong>
                        This online application will take about 10-15 minutes to complete. Before you start, we recommend having a credit card, photo ID, beneficiary information, and a current retirement plan statement on hand.
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonLabel color="primary">
                            What type of account would you like to open?
                        </IonLabel>
                       <IonSelect value={props.selectedAccountType} onIonChange={handleAccountTypeSelected}>
                           {accountTypes.map(accountType => 
                           (<IonSelectOption value={accountType}>
                               {accountType}
                           </IonSelectOption>))}
                        </IonSelect> 
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
}

export default Welcome; 