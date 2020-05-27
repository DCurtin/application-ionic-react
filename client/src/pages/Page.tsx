import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonBackButton } from '@ionic/react';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome from '../components/Welcome';
import './Page.css';

const Page: React.FC = () => {

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  const { name } = useParams<{ name: string; }>();

  const handleAccountTypeSelected = (selectedValue: string) => {
    setSelectedAccountType(selectedValue);
  }

  const displayPageTitle = (pageName:string) => {
    switch(pageName){
      case 'Welcome':
        return 'Welcome to Midland Trust!'
      default:
        return pageName;
    }
  }

  const displayPage = (pageName:string) => {
    switch (pageName) {
      case 'Welcome': 
        return <Welcome onAccountTypeSelected={handleAccountTypeSelected} selectedAccountType={selectedAccountType}/>;
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
          <IonTitle>{displayPageTitle(name)}</IonTitle>
          <IonButtons slot="end">
            <IonBackButton></IonBackButton>
          </IonButtons>
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
