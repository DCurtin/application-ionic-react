import React, {useState, useEffect} from 'react';
import {IonPage, IonHeader, IonToolbar, IonThumbnail, IonImg, IonTitle, IonContent, IonInput, IonButton} from '@ionic/react'

const Resume: React.FC<{setSessionId: Function}> = ({setSessionId}) => {
    const [authInput, setAuthInput] = useState({
        last_name:'',
        last_4_ssn:'',
        date_of_birth:undefined,
        email:''
    })

    
    function updateForm(event:any){
        setAuthInput(prevState => {
            console.log(prevState);
            return {...prevState, [event.target.name]:event.target.value}});
    }

    return (
    <IonPage> 
        <IonHeader>
            <IonToolbar color="primary">
                <IonThumbnail slot="start">
                    <IonImg src="../../assets/icon/midlandCrestForDarkBg.png"/>
                </IonThumbnail>
                <IonTitle>
                    Resume
                </IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
                <IonInput placeholder='Your Last Name' title='Your Last Name' name='last_name' value={authInput.last_name} onIonInput={updateForm}></IonInput>
                <IonInput placeholder='Last 4 Digits of Your SSN' title='Last 4 Digits of Your SSN' type='number' name='last_4_ssn' value={authInput.last_4_ssn} onIonInput={updateForm}></IonInput>
                <IonInput title='Your Date of Birth' type='date' name='date_of_birth' value={authInput.date_of_birth} onIonInput={updateForm}></IonInput>
                <IonInput placeholder='youremail@domain.com' title='Your Email Address' type='email' name='email' value={authInput.email} onIonInput={updateForm}></IonInput>
                <IonButton>Submit</IonButton>
            </IonContent>
    </IonPage>)
    }

export default Resume