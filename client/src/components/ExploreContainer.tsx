import { IonContent, IonList, IonItem, IonButton, IonListHeader, IonLabel} from '@ionic/react';
import React from 'react';
import './ExploreContainer.css';

interface AppPage {
  header?: string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

interface userState{
  prevPage?: AppPage,
  currentPage: AppPage,
  nextPage?: AppPage
}

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
        <IonItem>
              <IonButton routerLink={currentState.nextPage?.url} >Next</IonButton>
        </IonItem>
        <IonItem>
              <IonButton  routerLink={currentState.prevPage?.url}>Prev</IonButton>
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default ExploreContainer;
