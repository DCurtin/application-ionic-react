import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonItem, IonButton, IonList } from '@ionic/react';
import {AppPage} from '../components/Menu';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome, {WelcomePageParamters} from '../components/Welcome';
import './Page.css';
import './Page.css';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {AppSection, MenuParamters} from '../helpers/MenuGenerator'

import {useHistory} from 'react-router-dom';

export interface userState {
  prevPage?:AppPage, 
  currentPage: AppPage, 
  nextPage?: AppPage
}

export interface session{
  sessionId: string,
  setSessionId: Function,
  menuSections: AppSection[],
  setMenuParams: Function
}

const Page: React.FC<session> = ({sessionId, setSessionId, menuSections, setMenuParams}) => {
  const history = useHistory();
  let appPages = menuSections.flatMap(e=>{
    return e.pages
  })
  
  const [welcomePageFields, setWelcomePageFields] = useState<WelcomePageParamters>({
    AccountType: '',
    CashContribution: false,
    InitialInvestment: '',
    ReferralCode: '',
    RolloverEmployer: false,
    SalesRep: '',
    SpecifiedSource: '',
    TransferIra: false
  });

  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  });

  useEffect(function(){
    let formParams : MenuParamters = {
      initialInvestment : false,
      newContribution : false,
      planInfo : false,
      rolloverForm : false,
      transferForm : false
    }
    console.log('use effect on page');
    
    formParams.transferForm = welcomePageFields.TransferIra;
    formParams.rolloverForm = welcomePageFields.RolloverEmployer;
    formParams.newContribution = welcomePageFields.CashContribution;
    formParams.planInfo = welcomePageFields.AccountType.includes('SEP');

    formParams.initialInvestment = (welcomePageFields.InitialInvestment !== "I'm Not Sure" && welcomePageFields.InitialInvestment !== '')
    
    
    setMenuParams(formParams);

    return function(){
      console.log('test cleanup');
    }
  },[welcomePageFields, sessionId])
  
  useEffect(function(){
    //get paramters
    
  },[sessionId])

  const { name } = useParams<{ name: string; }>();

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
        return <Welcome InitialValues={welcomePageFields} SetInitialValues={setWelcomePageFields} />;
      case 'Disclosures':
        return <Disclosures selectedAccountType={welcomePageFields.AccountType}/>;
      case 'OwnerInformation':
        return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId}/>;
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


export default Page;
