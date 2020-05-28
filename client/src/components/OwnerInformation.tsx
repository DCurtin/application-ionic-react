import React from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonLabel, IonSelect, IonSelectOption, IonInput } from '@ionic/react';

const OwnerInformation: React.FC = () => {

    return (
        <IonContent>
            <IonGrid>
                <IonRow className="well">
                    <IonCol>
                    Please complete your personal information below. Fields outlined in red are required. Others are optional.
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <strong>
                    Identity
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            Salutation *
                        </IonLabel>
                        <IonSelect>
                            <IonSelectOption value="Mr.">Mr.</IonSelectOption>
                            <IonSelectOption value="Ms.">Ms.</IonSelectOption>
                            <IonSelectOption value="Mrs.">Mrs.</IonSelectOption>
                            <IonSelectOption value="Dr.">Dr.</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            First Name *
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                    <IonCol>
                        <IonLabel>
                            Last Name *
                        </IonLabel>
                        <IonInput></IonInput>
                    </IonCol>
                </IonRow>
                
            </IonGrid>
        </IonContent>
    )
}

export default OwnerInformation;