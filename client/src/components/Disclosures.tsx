import React, {useState, useEffect, useRef} from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonCheckbox } from '@ionic/react';
import {welcomePageParameters, saveWelcomeParameters} from "../helpers/Utils";
import {useForm } from 'react-hook-form';

interface InitSessionApp {
    welcomePageFields: welcomePageParameters,
    setWelcomePageFields: Function,
    sessionId: string,
    selectedAccountType: string,
    updateMenuSections:Function,
    formRef: any
}

const Disclosures: React.FC<InitSessionApp> = props => {
    let disclosurePDF = props.selectedAccountType.includes('Roth') ? 'https://www.midlandira.com/wp-content/uploads/2015/12/ROTH-IRA-5305-RA.pdf' : 'https://www.midlandira.com/wp-content/uploads/2015/12/Traditional-IRA-5305-A.pdf';

    const handleReadDisclosure = (event: any) => {       
        props.setWelcomePageFields(
            {
                ...props.welcomePageFields,
                has_read_diclosure: event.detail.checked
            }
        )
    }

    const {register, handleSubmit, watch, errors} = useForm(); 

    const onSubmit = () => { 
        props.updateMenuSections('is_disclosure_page_valid',true);
    }

    const validateFields = () => {
        let body : saveWelcomeParameters ={
            session: {sessionId: props.sessionId, page: 'welcomePage'},
            data: props.welcomePageFields
        }
        let options = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        }

        fetch('/saveState', options).then((response)=>{
            response.json().then(function(data: any){
                console.log(data);
                props.setWelcomePageFields(data.sessionId);
            })
        })
      return (props.welcomePageFields.has_read_diclosure === true);
    }

    const showError = (fieldName: string) => {
            let errorsArr = (Object.keys(errors));
            let className = errorsArr.includes(fieldName) ? 'danger ion-no-padding' : 'ion-no-padding';
            return className;
    };

    return (
        <IonContent className="ion-padding">
            <form ref={props.formRef} onSubmit={handleSubmit(onSubmit)}>
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

                            <IonCheckbox checked={props.welcomePageFields.has_read_diclosure} onIonChange={handleReadDisclosure} 
                            name='hasReadDisclosure' className={showError('hasReadDisclosure')} ref={register({validate: validateFields})}></IonCheckbox> &nbsp; I have reviewed these disclosures and agree to all terms and conditions herein 
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </form>
        </IonContent>
    )
}

export default Disclosures;