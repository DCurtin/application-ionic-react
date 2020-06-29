import React, {useState} from 'react';
import { SessionApp, FormData } from '../helpers/Utils';
import {useForm} from 'react-hook-form';
import { IonContent, IonGrid, IonRow, IonCol, IonItemDivider, IonText, IonButton, IonLabel, IonInput, IonLoading } from '@ionic/react';
import {chargeCreditCard} from '../helpers/CalloutHelpers'

const PaymentInformation: React.FC<SessionApp> = ({sessionId, updateMenuSections, formRef}) => {
    const {handleSubmit} = useForm(); 
    const [formData, setFormData] = useState<FormData>({
        creditCardNumber: '',
        expirationDateString: '',
        paymentAmount: '', 
        paymentStatus: '', 
        paymentStatusDetails: ''
    });

    const updateForm = (e:any) => {
        let newValue = e.target.value;
        setFormData(prevState => {
            return {...prevState, [e.target.name]:newValue}});
    }

    const processCreditCard = (formData: any) => {
        setFormData(prevState => {return {...prevState, paymentStatus: 'Pending'}});
        chargeCreditCard(formData,sessionId).then(function(response: any) {
            setFormData(prevState => {return {...prevState, paymentStatus: 'Success', paymentAmount: response.PaymentAmount}});
        }).catch(function(error: any) {
            setFormData(prevState => {return {...prevState, paymentStatus: 'Error', paymentStatusDetails: error.message}});
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
                    {formData.paymentStatus !== 'Success' &&
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
                    <IonLoading isOpen={formData.paymentStatus === 'Pending'} message={'Applying Payment...'} spinner="lines"></IonLoading>
                    {formData.paymentStatus === 'Error' &&
                        <IonRow>
                            Error - {formData.paymentStatusDetails}
                        </IonRow>
                    }
                    {formData.paymentStatus === 'Success' &&
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