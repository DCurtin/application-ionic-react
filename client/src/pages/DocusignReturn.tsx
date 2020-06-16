import React from 'react';
import { IonPage, IonHeader, IonThumbnail, IonImg, IonToolbar, IonTitle } from '@ionic/react';

const DocusignReturn: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonThumbnail slot="start">
                        <IonImg src="../../assets/icon/midlandCrestForDarkBg.png"/>
                    </IonThumbnail>
                    <IonTitle>
                        Docusign Return
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

        </IonPage>
    )
}

export default DocusignReturn; 