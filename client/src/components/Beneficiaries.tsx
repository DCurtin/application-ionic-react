import React, {useState} from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonItemDivider, IonLabel, IonInput } from '@ionic/react';
import {SessionApp} from '../helpers/Utils';
import { addOutline } from 'ionicons/icons';

interface FormData {
    [key:string] : any
}

const Beneficiaries: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
    const [formData, setFormData] = useState<FormData>({
        beneficiary_count__c: 0, 
        beneficiary_first_name_1__c: '',
        beneficiary_first_name_2__c: '', 
        beneficiary_first_name_3__c: '', 
        beneficiary_first_name_4__c: ''
    })

    const addBeneficiary = () => {
        let currentCount = formData.beneficiary_count__c;
        let newCount = currentCount < 4 ? currentCount +1 : currentCount;  
        setFormData({...formData, beneficiary_count__c : newCount});
    }

    const updateForm = (e:any) => {
        console.log(e.target.name);
        setFormData({...formData, [e.target.name]:e.target.value});
    }
 
    const displayBeneficiaryForm = (beneficiaryCount: number) => {
        if (beneficiaryCount > 0) {
            let formRows = [];
            for (let i = 0; i < beneficiaryCount; i++){
                let beneficiaryNumber = i +1;
              formRows.push(
              <React.Fragment key={beneficiaryNumber}>
                  <IonItemDivider>
                    <strong>
                    Beneficiary {beneficiaryNumber}
                    </strong>
                </IonItemDivider>
                <IonRow>
                    <IonCol>
                        <IonLabel>
                            First Name
                        </IonLabel>
                        <IonInput name={`beneficiary_first_name_${beneficiaryNumber}__c`} value={formData[`beneficiary_first_name_${beneficiaryNumber}__c`]} onIonChange={updateForm}>
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