import React, {useState, useEffect} from 'react';
import {requestBody} from '../helpers/Utils'
import {IonPage, IonHeader, IonToolbar, IonThumbnail, IonImg, IonTitle, IonContent, IonInput, IonButton} from '@ionic/react'

interface resume{
    last_name:string,
    last_4_ssn:string,
    date_of_birth:string,
    email:string
}


interface resumeRequest{
    appExternalId: string
    data: resume
}

const Resume: React.FC<{setSessionId: Function}> = ({setSessionId}) => {
    const [authInput, setAuthInput] = useState<resume>({
        last_name:'',
        last_4_ssn:'',
        date_of_birth:'',
        email:''
    })

    const [loading, setLoading] = useState<boolean>(false);

    
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
                <IonButton onClick={()=>{authenticate(authInput, setLoading, setSessionId)}} disabled={loading}>Submit</IonButton>
            </IonContent>
    </IonPage>)
}

function authenticate(authInput: resume, setLoading: Function, setSessionId: Function) {
    setLoading(true);
    let url = '/resume'
    let body :resumeRequest ={
        appExternalId: '',
        data: authInput
    }
    let options ={
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    fetch(url, options).then((response: Response)=>{
        if(response.ok){
            response.json().then((data:any)=>{
                console.log(data.sessionId);
                setSessionId(data.sessionId);
            })
            setLoading(false);
        }else{
            console.log(response.text)
        }
        setLoading(false);
    })
}


export default Resume