import React, {useState} from 'react';
import { SessionApp, FormData } from '../helpers/Utils';
import {useForm} from 'react-hook-form';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonButton, IonLabel, IonInput, IonLoading } from '@ionic/react';
import {chargeCreditCard} from '../helpers/CalloutHelpers'

const PaymentInformation: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef}) => {
    const {register, handleSubmit, watch, errors} = useForm(); 
    const [formData, setFormData] = useState<FormData>({
        creditCardNumber: '',
        expirationDateString: '',
        creditCardStatus: '', 
        paymentAmount: '', 
        creditCardStatusDetails: ''
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            return {...prevState, [e.target.name]:newValue}});
    }

    const processCreditCard = (formData: any) => {
        setFormData(prevState => {return {...prevState, creditCardStatus: 'Pending'}});
        chargeCreditCard(formData,sessionId).then(function(response: any) {
            setFormData(prevState => {return {...prevState, creditCardStatus: response.Status, creditCardStatusDetails: response.StatusDetails, paymentAmount: response.PaymentAmount}});
        })
    }

    const validateFields = () => {
        updateMenuSections('isPaymentInfoPageValid', true);
    }
    
    return (
        <IonContent className='ion-padding'>
            <form ref={formRef} onSubmit={handleSubmit(validateFields)}>
                <IonGrid>
                    <IonRow className='well'>
                        <IonCol>
                            <p>
                            Midland charges your credit card for today's non-refundable fee(s) listed below. Future annual fees will be charged to the same card unless notified otherwise.
                            </p>
                        </IonCol>
                    </IonRow>
                    <IonItemDivider>
                        <strong>
                            <IonText color='primary'>
                                $50 Setup Fee
                            </IonText>
                        </strong>
                    </IonItemDivider>
                    {formData.creditCardStatus !== 'Completed' &&
                        <>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>
                                        Credit Card Number
                                    </IonLabel>
                                    <IonInput class='item-input' name='creditCardNumber' value={formData.creditCardNumber} onIonChange={updateForm}></IonInput>
                                </IonCol>
                                <IonCol>
                                    <IonLabel>
                                        Expiration Date
                                    </IonLabel>
                                    <IonInput class='item-input' name='expirationDateString' value={formData.expirationDateString} onIonChange={updateForm} placeholder='10/2025'></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol class="ion-float-right">
                                    <IonButton color="primary" onClick={() => processCreditCard(formData)}>Submit & Proceed</IonButton>
                                </IonCol>
                            </IonRow>
                        </>
                    }               
                    <IonLoading isOpen={formData.creditCardStatus === 'Pending'} message={'Applying Payment...'} spinner="lines"></IonLoading>
                    {formData.creditCardStatus === 'Error' &&
                        <IonRow>
                            Error - {formData.creditCardStatusDetails}
                        </IonRow>
                    }
                    {formData.creditCardStatus === 'Completed' &&
                        <IonRow>
                            Thank you for your payment of ${formData.paymentAmount}.
                            {/*on the card ending
                            in {{application.getLastFourDigitsOfCreditCard()}}.*/}
                        </IonRow>
                    }
                </IonGrid>
            </form>
        </IonContent>
    );
}

export default PaymentInformation;