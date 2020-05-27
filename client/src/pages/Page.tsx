import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail } from '@ionic/react';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome from '../components/Welcome';
import ApplicationIdentity from '../components/ApplicationIdentity'
import './Page.css';

const Page: React.FC = () => {

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  const [sessionId, setSessionId] = useState(undefined);

  const { name } = useParams<{ name: string; }>();

  const handleAccountTypeSelected = (selectedValue: string) => {
    setSelectedAccountType(selectedValue);
  }

  const displayPage = (pageName:string) => {
    switch (pageName) {
      case 'Welcome': 
        return <Welcome onAccountTypeSelected={handleAccountTypeSelected} selectedAccountType={selectedAccountType}/>;
      
      case 'IdInfo':
        return <ApplicationIdentity sessionId={sessionId} setSessionId={setSessionId} />
      default:
        return <ExploreContainer name={pageName}/>
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonThumbnail slot="start">
            <IonImg src="../../assets/icon/midlandCrestForDarkBg.png"/>
          </IonThumbnail>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" color="primary">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {displayPage(name)}
      </IonContent>
    </IonPage>
  );
};

export default Page;
