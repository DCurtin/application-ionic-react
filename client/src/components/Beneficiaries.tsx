import React, {useState} from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput } from '@ionic/react';
import {SessionApp} from '../helpers/Utils';
import { addOutline } from 'ionicons/icons';

const Beneficiaries: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState({
        beneficiary_count__c: 0, 
        beneficiary_first_name_1__c: ''
    })

    const addBeneficiary = () => {
        console.log(formData.beneficiary_count__c);
        let currentCount = formData.beneficiary_count__c;
        let newCount = currentCount +1;  
        console.log(currentCount);
        setFormData({...formData, beneficiary_count__c : newCount});
    }

    const displayBeneficiaryForm = (beneficiaryCount: number) => {
        if (beneficiaryCount > 0) {
            let formRows = [];
            for (let i = 1; i < beneficiaryCount; i++){
              formRows.push(
              <React.Fragment key={i}>
                  <IonItemDivider>
                    <strong>
                    Beneficiary {i}
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            First Name
                        </IonLabel>
                        <IonInput name={`beneficiary_first_name_${i}__c`} value={formData[`beneficiary_first_name_1__c`]}>
                        </IonInput>
                    </IonCol>
                </IonRow>
              </React.Fragment>)
            }
            return formRows; 
        }
    }

    return (
        <IonContent className='ion-padding'>
            <IonGrid>
                <IonRow className='well'>
                    <IonCol>
                        <p>
                            Naming beneficiaries in this online application is optional, but highly recommended. If you skip this step, we will provide you with a beneficiary form at a later date.
                        </p>
                        <p>
                            Naming a beneficiary allows your IRA assets to go to whomever you choose. Primary beneficiaries are the first set of individuals/entities that you wish to leave your retirement assets to. If you are married and leave the retirement account to your spouse, he/she inherits the account as if it were his/her own. Secondary beneficiaries receive the assets if your primary beneficiaries die before you or refuse to accept the inheritance.
                        </p>
                        <p>
                            If you elect not to designate a beneficiary, your assets may pass to your estate - subjecting them to the probate process, estate expenses, and creditor claims, causing delays for your beneficiary to receive these assets.
                        </p>
                    </IonCol>
                </IonRow>
                {displayBeneficiaryForm(formData.beneficiary_count__c)}
                <IonRow>
                    <IonCol>
                        <IonButton onClick={addBeneficiary}> <IonIcon icon={addOutline} slot='start'></IonIcon> Add Beneficiary </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}
export default Beneficiaries; 