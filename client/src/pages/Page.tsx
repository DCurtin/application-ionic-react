import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonItem, IonButton, IonList } from '@ionic/react';
import {appPages, AppPage} from '../components/Menu';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome from '../components/Welcome';
import ApplicationIdentity from '../components/ApplicationIdentity'
import ApplicationBene from '../components/ApplicationBene'
import './Page.css';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

/*interface AppPage {
  header?: string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}*/

export interface userState{
  prevPage?: AppPage,
  currentPage: AppPage,
  nextPage?: AppPage
}

const Page: React.FC = () => {

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  })

  const { name } = useParams<{ name: string; }>();

  const handleAccountTypeSelected = (selectedValue: string) => {
    setSelectedAccountType(selectedValue);
  }

  const displayPage = (pageName:string, sessionId:String, setSessionId:Function) => {
    
  if(!currentState.currentPage.url.includes(pageName)){
    console.log(pageName)
    console.log(currentState.currentPage.url)
    console.log(currentState.currentPage.url.includes(pageName));
    var updatedState = getPageStateFromPage(pageName);
    setCurrentState(updatedState);
  }

    switch (pageName) {
      case 'Welcome': 
        return <Welcome onAccountTypeSelected={handleAccountTypeSelected} selectedAccountType={selectedAccountType} currentState={currentState}/>;
      case 'OwnerInformation':
        return <ApplicationIdentity sessionId={sessionId} setSessionId={setSessionId} currentState={currentState} />
      case 'Beneficiaries':
        return <ApplicationBene sessionId={sessionId} currentState={currentState}/>
      default:
        return <ExploreContainer name={pageName} currentState={currentState}/>
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
        <IonList>
        <IonItem>
              <IonButton routerLink={currentState.nextPage?.url}>Next</IonButton>
          </IonItem>
          <IonItem>
              <IonButton routerLink={currentState.prevPage?.url}>Prev</IonButton>
          </IonItem>
          </IonList>
        {displayPage(name, sessionId, setSessionId)}
      </IonContent>
    </IonPage>
  );
};

function getPageStateFromPage(page:string){
  var returnIndex = 0;
  var foundUrl = appPages.some((item, index, arr) => {
      returnIndex = index;
      if(item.url.includes(page))
      {
        return item.url.includes(page)
      }
  });

  if(foundUrl){
    
      if(returnIndex === 0)
      {
        return {
          prevPage: undefined,
          currentPage: appPages[0],
          nextPage: appPages[1]
        };
      }

      if(returnIndex >= appPages.length)
      {
        var finalIndex = (appPages.length - 1);
          return{
          prevPage: appPages[finalIndex -1],
          currentPage: appPages[finalIndex],
          nextPage: undefined
        }
    }
    //else
    return{
      prevPage: appPages[returnIndex -1],
      currentPage: appPages[returnIndex],
      nextPage: appPages[returnIndex + 1]
    }

  }

  return {
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  };
}


export default Page;
