import React from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonSelect, IonLabel, IonSelectOption } from '@ionic/react';

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
                    <IonCol>
                        <IonLabel>
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