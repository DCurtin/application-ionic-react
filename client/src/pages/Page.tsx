import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonBackButton, IonItemDivider, IonButton } from '@ionic/react';
import React, {useState} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome from '../components/Welcome';
import './Page.css';
import {appPages, AppPage} from '../components/Menu';

export interface userState {
  prevPage?:AppPage, 
  currentPage: AppPage, 
  nextPage?: AppPage
}

const Page: React.FC = () => {

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined, 
    currentPage: appPages[0], 
    nextPage: appPages[1]
  });

  const { name } = useParams<{ name: string; }>();

  const handleAccountTypeSelected = (selectedValue: string) => {
    setSelectedAccountType(selectedValue);
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

  const displayPageTitle = (pageName:string) => {
    switch(pageName){
      case 'Welcome':
        return 'Welcome to Midland Trust!'
      default:
        return pageName;
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
        </IonToolbar>
        <IonButtons>
            <IonButton routerLink={currentState.nextPage?.url}>
              Next
            </IonButton>
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

export default Page;
