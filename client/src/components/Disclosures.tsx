import React, {useRef, useState, useImperativeHandle, Ref} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCheckbox } from '@ionic/react';

interface Props {
    selectedAccountType: string;
}

interface PageRef {
    validatePage: Function;
}

const Disclosures = React.forwardRef((props:Props, ref: Ref<PageRef>) => {
    let disclosurePDF = props.selectedAccountType.includes('Roth') ? 'https://www.midlandira.com/wp-content/uploads/2015/12/ROTH-IRA-5305-RA.pdf' : 'https://www.midlandira.com/wp-content/uploads/2015/12/Traditional-IRA-5305-A.pdf';
    const disclosureRef= useRef<HTMLIonContentElement>(null);
    
    const [hasReviewedDisclosures, setHasReviewedDisclosures] = useState(false);

    const handleReviewedDisclosuresCheck = (e: any) => {
        let isChecked = e.target.checked; 
        setHasReviewedDisclosures(isChecked);
    }

    useImperativeHandle(ref, () => ({validatePage}));

    const validatePage = () =>{
        return (hasReviewedDisclosures);
    }
 
    
    return (
        <IonContent className="ion-padding" ref={disclosureRef}>
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
                        <IonCheckbox checked={hasReviewedDisclosures} onIonChange={handleReviewedDisclosuresCheck}></IonCheckbox> &nbsp; I have reviewed these disclosures and agree to all terms and conditions herein 
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
});

export default Disclosures;