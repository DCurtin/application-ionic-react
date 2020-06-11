import React, {useState} from 'react';
import { SessionApp, states, FormData } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';

const InitialInvestment : React.FC<SessionApp> = ({sessionId, setSessionId}) => {   
    const [formData, setFormData] = useState({
        
    });
    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    Already have an investment in mind for your new account? Tell us about your transaction. If you don’t know all of the details, no problem! Our client services team will reach out to you to further discuss this transaction before anything is processed.
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default InitialInvestment; 