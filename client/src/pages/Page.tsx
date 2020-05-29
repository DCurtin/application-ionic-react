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
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import './Page.css';

export interface userState {
  prevPage?:AppPage, 
  currentPage: AppPage, 
  nextPage?: AppPage
}

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

export interface session{
  sessionId: string,
  setSessionId: Function
}

const Page: React.FC<session> = ({sessionId, setSessionId}) => {
  //console.log(setSessionId);

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  //const [sessionId, setSessionId] = useState<string>('');
  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  })
  const [initialInvestment, setInitialInvestment] = useState<string>('');

  const { name } = useParams<{ name: string; }>();

  const handleAccountTypeSelected = (selectedValue: string) => {
    setSelectedAccountType(selectedValue);
  }

  const displayPage = (pageName:string, sessionId:String, setSessionId:Function) => {
    
  if(!currentState.currentPage.url.includes(pageName)){
    var updatedState = getPageStateFromPage(pageName);
    setCurrentState(updatedState);
  }

  const handleInitialInvestmentSelected = (initialInvestment : string) => {
    setInitialInvestment(initialInvestment);
  }

  const getPageStateFromPage = (currentPageName:string) => {
    console.log(appPages);
    const appPagesArr = [...appPages];
    let currentPageIndex = appPagesArr.findIndex(page => page.url.includes(currentPageName));

    if (currentPageIndex <= 0) {
      return {
        prevPage: undefined,
        currentPage: appPages[0], 
        nextPage: appPages[1]
      }
    }

    if (currentPageIndex >= appPages.length) {
      var finalIndex = appPages.length - 1;
      return {
        prevPage: appPages[finalIndex - 1], 
        currentPage: appPages[finalIndex], 
        nextPage: undefined
      }
    }

    return {
      prevPage: appPages[currentPageIndex -1], 
      currentPage: appPages[currentPageIndex],
      nextPage: appPages[currentPageIndex+1]
    }
  }

  const displayPage = (pageName:string) => {
    if (!currentState.currentPage.url.includes(pageName)) {
      let updatedState = getPageStateFromPage(pageName);
      setCurrentState(updatedState);
    }

    switch (pageName) {
      case 'Welcome': 
        return <Welcome onAccountTypeSelected={handleAccountTypeSelected} selectedAccountType={selectedAccountType} initialInvestment={initialInvestment} onInitialInvestmentSelected={handleInitialInvestmentSelected}/>;
      case 'Disclosures':
        return <Disclosures selectedAccountType={selectedAccountType}/>;
      case 'OwnerInformation':
        return <OwnerInformation/>;
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
          <IonTitle>{currentState.currentPage.title}</IonTitle>
        </IonToolbar>
        <IonButtons>
            <IonButton routerLink={currentState.nextPage?.url}>Next</IonButton>
            <IonButton routerLink={currentState.prevPage?.url}>Prev</IonButton>
        </IonButtons>
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
