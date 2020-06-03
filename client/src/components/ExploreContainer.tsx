import { IonContent, IonList, IonItem, IonButton, IonListHeader, IonLabel} from '@ionic/react';
import {userState} from '../pages/Page'
import React from 'react';
import './ExploreContainer.css';

interface ContainerProps {
  name: string,
  currentState: userState
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, currentState }) => {
  return (
    <IonContent>
      <IonList>
        <IonListHeader>
        <IonLabel>
            {name}
        </IonLabel>
        </IonListHeader>
      </IonList>
    </IonContent>
  );
};

export default ExploreContainer;
