import React from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCheckbox } from '@ionic/react';
import {welcomePageParameters, SessionApp} from "../helpers/Utils";

interface InitSessionApp {
    initialValues: welcomePageParameters,
    setInitialValues: Function,
    selectedAccountType: string
}



const Disclosures: React.FC<InitSessionApp> = props => {
    let disclosurePDF = props.selectedAccountType.includes('Roth') ? 'https://www.midlandira.com/wp-content/uploads/2015/12/ROTH-IRA-5305-RA.pdf' : 'https://www.midlandira.com/wp-content/uploads/2015/12/Traditional-IRA-5305-A.pdf';
    const handleReadDisclosure = (event: CustomEvent) => {
        props.setInitialValues(
            {
                ...props.initialValues,
                HasReadDisclosure: event.detail.checked
            }
        )
    }

    return (
        <IonContent className="ion-padding">
            <IonGrid>
                <IonRow className="well">
                    <IonCol>
                        <p>
                            <strong>
                            Midland Trust is not a fiduciary.
                            </strong> Midland Trust's role as the administrator of self-directed retirement accounts is non-discretionary and/or administrative in nature. The account holder or his/her authorized representative must direct all investment transactions and choose the investment(s) for the account.
                        </p>
                        <p>
                            <strong>
                            We do not provide tax, legal, or investment advice. 
                            </strong> Midland Trust has no responsibility or involvement in selecting or evaluating any investment. Nothing contained herein shall be construed as investment, legal, tax or financial advice or as a guarantee, endorsement, or certification of any investments.
                        </p>
                    </IonCol>
                </IonRow>
                <IonRow className="well">
                    <IonCol>
                        <p>
                        <a target="_blank" href={disclosurePDF}>
                            Click here to download your complete account disclosure.
                            </a> 
                        </p>
                        <IonCheckbox checked={props.initialValues.HasReadDisclosure} onIonChange={handleReadDisclosure}></IonCheckbox> &nbsp; I have reviewed these disclosures and agree to all terms and conditions herein 
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default Disclosures;