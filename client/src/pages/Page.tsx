import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton } from '@ionic/react';
import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router';
import Welcome from '../components/Welcome';
import {welcomePageParameters, requestBody} from '../helpers/Utils'
import './Page.css';
import './Page.css';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {MenuSection, MenuParameters, AppPage} from '../helpers/MenuGenerator'

import {useHistory} from 'react-router-dom';
import Beneficiaries from '../components/Beneficiaries';

import FeeArrangement from '../components/FeeArrangement';
import AccountNotifications from '../components/AccountNotifications';
import Transfers from '../components/Transfers';
import Rollovers from '../components/Rollovers';
import InitialInvestment from '../components/InitialInvestment';
import NewContribution from '../components/NewContribution';
import PaymentInformation from '../components/PaymentInformation';
import ReviewAndSign from '../components/ReviewAndSign';
import { checkmarkCircleSharp, checkmarkCircle, alertCircleOutline, alertCircleSharp } from 'ionicons/icons';

export interface userState {
  prevPage?:AppPage, 
  currentPage: AppPage, 
  nextPage?: AppPage
}

export interface session{
  sessionId: string,
  setSessionId: Function,
  menuSections: MenuSection[],
  setMenuParams: Function,
  setMenuSections: Function
}

interface PageRef {
  validatePage: Function;
}

const Page: React.FC<session> = ({sessionId, setSessionId, menuSections, setMenuSections, setMenuParams}) => {
  const history = useHistory();
  let appPages = menuSections.flatMap(e=>{
    return e.pages
  });

  const disclosureRef = useRef<PageRef>(null);
  
  const [welcomePageFields, setWelcomePageFields] = useState<welcomePageParameters>({
    AccountType: '',
    InitialInvestment: '',
    ReferralCode: '',
    SalesRep: '',
    SpecifiedSource: '',
    CashContribution: false,
    RolloverEmployer: false,
    TransferIra: false
  });

  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  });


  useEffect(function(){
    let formParams : MenuParameters = {
      initialInvestment : false,
      newContribution : false,
      planInfo : false,
      rolloverForm : false,
      transferForm : false,
      is401k: false
    }
    
    formParams.transferForm = welcomePageFields.TransferIra;
    formParams.rolloverForm = welcomePageFields.RolloverEmployer;
    formParams.newContribution = welcomePageFields.CashContribution;
    formParams.planInfo = welcomePageFields.AccountType.includes('SEP');
    formParams.is401k = welcomePageFields.AccountType.includes('401k');

    formParams.initialInvestment = (welcomePageFields.InitialInvestment !== "I'm Not Sure" && welcomePageFields.InitialInvestment !== '')
    
    setMenuParams(formParams);
  },[welcomePageFields])
  
  useEffect(function(){
    let url = '/getPageFields'
    let body : requestBody ={
        session: {sessionId: sessionId, page: 'rootPage'},
        data: undefined
    }
    let options = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    fetch(url, options).then((response)=>{
      response.json().then((data:any)=>{
        console.log(data)
        setWelcomePageFields(data.welcomePageFields);
      })
    })
    
  },[])
  const { name } = useParams<{ name: string; }>();

  useEffect(() => {    
    let updatedState = getPageStateFromPage(name);
    setCurrentState(updatedState);
  }, [name,menuSections]);


  const getPageStateFromPage = (currentPageName:string) => {
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
    switch (pageName) {
      case 'Welcome': 
        return <Welcome initialValues={welcomePageFields} setInitialValues={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'Disclosures':
        return <Disclosures selectedAccountType={welcomePageFields.AccountType} updateMenuSections={updateMenuSections} />;
      case 'OwnerInformation':
        return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'Beneficiaries':
        return <Beneficiaries sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'FeeArrangement':
        return <FeeArrangement sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'AccountNotifications':
        return <AccountNotifications sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'TransferIRA':
        return <Transfers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'RolloverPlan':
        return <Rollovers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'InvestmentDetails':
        return <InitialInvestment sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'NewContribution':
        return <NewContribution sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'PaymentInformation':
        return <PaymentInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      case 'ReviewAndSign':
        return <ReviewAndSign sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
      default: 
        return <Welcome initialValues={welcomePageFields} setInitialValues={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections}/>;
    }
  }


  const goToNextPage = () => {
    validateFields();
  }

  const validateFields = () => {
    let isPageValid;
    if (currentState.currentPage.url.includes('Welcome')) {
      isPageValid = ( welcomePageFields.AccountType !== '' && welcomePageFields.InitialInvestment !== '');
      updateMenuSections(isPageValid);
      
    }
    else {
      isPageValid = currentState.currentPage.isValid;
    }

    if (isPageValid){
      let path = currentState.nextPage?.url;
      if (path){
        history.push(path);
      }
    }
  }

  const updateMenuSections = (isPageValid:boolean) => {
    let currentPage  = {...currentState.currentPage};
    let iosIcon = isPageValid ? checkmarkCircle : alertCircleOutline;
    let mdIcon = isPageValid ? checkmarkCircleSharp : alertCircleSharp;
    let newPage = {...currentPage, isValid: isPageValid, iosIcon:iosIcon, mdIcon: mdIcon};
    let menuSectionsArr = [...menuSections];
    let currentMenuSectionIndex = menuSectionsArr.findIndex(menuSection => menuSection.header === currentPage.header); 
    let currentMenuSection = menuSectionsArr[currentMenuSectionIndex];
    let menuSectionPagesArr = [...menuSectionsArr[currentMenuSectionIndex].pages];
    let currentPageIndex = menuSectionPagesArr.findIndex(appPage => appPage.url === currentPage.url);
    menuSectionPagesArr.splice(currentPageIndex, 1, newPage);
    let newMenuSection = {...currentMenuSection, pages: menuSectionPagesArr};
    menuSectionsArr.splice(currentMenuSectionIndex, 1, newMenuSection);
    setMenuSections(menuSectionsArr);
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
            <IonButton routerLink={currentState.prevPage?.url}>Prev</IonButton>
            <IonButton onClick={goToNextPage}>Next</IonButton>
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
