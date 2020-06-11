import React, {useState, useEffect} from 'react';
import { SessionApp, initialInvestmentTypes } from '../helpers/Utils';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

const InitialInvestment : React.FC<SessionApp> = ({sessionId, setSessionId}) => {   
    const [formData, setFormData] = useState({
        initial_investment_type__c : 'Futures/Forex'
    });

    useEffect(() => {
        // TO DO: Grab initial investment type fields from saved application 
    })

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        console.log(formData);
        setFormData(prevState => ({...prevState, [e.target.name]:newValue}));
    }

    let investmentTypesArr = initialInvestmentTypes.filter(investmentType => (investmentType !== `I'm Not Sure`));

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                    Already have an investment in mind for your new account? Tell us about your transaction. If you don’t know all of the details, no problem! Our client services team will reach out to you to further discuss this transaction before anything is processed.
                    </IonCol>
                </IonRow>
                <IonItemDivider>
                    <IonText color='primary'>
                        <b>
                            Investment Details    
                        </b>
                    </IonText>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            What type of asset?
                        </IonLabel>
                        <IonSelect value={formData.initial_investment_type__c} name='initial_investment_type__c' onIonChange={updateForm}>
                            {investmentTypesArr.map((investmentType, index) => (
                                <IonSelectOption key={index} value={investmentType}>{investmentType}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default InitialInvestment; 