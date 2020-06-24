import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton } from '@ionic/react';
import {AppPage} from '../components/Menu';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import Welcome from '../components/Welcome';
import {welcomePageParameters, requestBody} from '../helpers/Utils'
import './Page.css';
import './Page.css';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {AppSection, MenuParamters} from '../helpers/MenuGenerator'

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
  
  const [welcomePageFields, setWelcomePageFields] = useState<welcomePageParameters>({
    account_type: '',
    investment_type: '',
    referral_code: '',
    sales_rep: '',
    referred_by: '',
    cash_contribution_form: false,
    rollover_form: false,
    transfer_form: false
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
    
    formParams.transferForm = welcomePageFields.transfer_form;
    formParams.rolloverForm = welcomePageFields.rollover_form;
    formParams.newContribution = welcomePageFields.cash_contribution_form;
    formParams.planInfo = welcomePageFields.account_type.includes('SEP');

    formParams.initialInvestment = (welcomePageFields.investment_type !== "I'm Not Sure" && welcomePageFields.investment_type !== '')
    
    setMenuParams(formParams);
  },[welcomePageFields, setMenuParams])
  
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
        setWelcomePageFields(data.data);
      })
    })
    
  },[sessionId])

  const { name } = useParams<{ name: string; }>();

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
    if (!currentState.currentPage.url.includes(pageName)) {
      let updatedState = getPageStateFromPage(pageName);
      setCurrentState(updatedState);
    }

    switch (pageName) {
      case 'Welcome': 
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'Disclosures':
        return <Disclosures selectedAccountType={welcomePageFields.account_type}/>;
      case 'OwnerInformation':
        return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'Beneficiaries':
        return <Beneficiaries sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'FeeArrangement':
        return <FeeArrangement sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'AccountNotifications':
        return <AccountNotifications sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'TransferIRA':
        return <Transfers sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'RolloverPlan':
        return <Rollovers sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'InvestmentDetails':
        return <InitialInvestment sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'NewContribution':
        return <NewContribution sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'PaymentInformation':
        return <PaymentInformation sessionId={sessionId} setSessionId={setSessionId}/>;
      case 'ReviewAndSign':
        return <ReviewAndSign sessionId={sessionId} setSessionId={setSessionId}/>;
      default: 
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId}/>;
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
            <IonButton routerLink={currentState.prevPage?.url}>Prev</IonButton>
            <IonButton routerLink={currentState.nextPage?.url}>Next</IonButton>
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
