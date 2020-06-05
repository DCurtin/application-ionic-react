import React from 'react'; 
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import {SessionApp} from '../helpers/Utils';

const Beneficiaries: React.FC<SessionApp> = ({sessionId, setSessionId}) => {
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
            </IonGrid>
        </IonContent>
    )
}
export default Beneficiaries; 