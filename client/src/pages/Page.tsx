import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router';
import Welcome from '../components/Welcome';
import {welcomePageParameters, requestBody} from '../helpers/Utils'
import './Page.css';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {MenuSection, MenuParameters, AppPage} from '../helpers/MenuGenerator';

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
  menuSections: MenuSection[],
  setMenuParams: Function,
  setMenuSections: Function,
  menuParams: MenuParameters
}

const Page: React.FC<session> = ({sessionId, setSessionId, menuSections, setMenuSections, setMenuParams, menuParams}) => {
  const history = useHistory();
  let appPages = menuSections.flatMap(e=>{
    return e.pages
  });

  const formRef = useRef<HTMLFormElement>(null);
  
  const [welcomePageFields, setWelcomePageFields] = useState<welcomePageParameters>({
    AccountType: '',
    InitialInvestment: '',
    ReferralCode: '',
    SalesRep: '',
    SpecifiedSource: '',
    CashContribution: false,
    RolloverEmployer: false,
    TransferIra: false,
    HasReadDisclosure: false
  });

  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  });

  useEffect(function(){
    let formParams = {...menuParams};
    
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
        return <Welcome initialValues={welcomePageFields} setInitialValues={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'Disclosures':
        return <Disclosures initialValues={welcomePageFields} setInitialValues={setWelcomePageFields} selectedAccountType={welcomePageFields.AccountType} updateMenuSections={updateMenuSections} formRef={formRef} />;
      case 'OwnerInformation':
        return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'Beneficiaries':
        return <Beneficiaries sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'FeeArrangement':
        return <FeeArrangement sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'AccountNotifications':
        return <AccountNotifications sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'TransferIRA':
        return <Transfers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'RolloverPlan':
        return <Rollovers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'InvestmentDetails':
        return <InitialInvestment sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'NewContribution':
        return <NewContribution sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'PaymentInformation':
        return <PaymentInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'ReviewAndSign':
        return <ReviewAndSign sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      default: 
        return <Welcome initialValues={welcomePageFields} setInitialValues={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
    }
  }


  const goToNextPage = () => {
    if (formRef !== null && formRef.current !== null) {
      formRef.current.dispatchEvent(new Event('submit'));
    }
  }


  const updateMenuSections = (page: string, isPageValid:boolean) => {
    let currentPage  = {...currentState.currentPage};
    let newPage = {...currentPage, isValid: isPageValid};
    console.log(currentPage);
    setCurrentState(prevState => {
      return {
        ...prevState,
        currentPage: newPage
      } 
    });
    
    updateMenuParams(page, isPageValid);
    
    if (isPageValid){
      let path = currentState.nextPage?.url;
      if (path){
        history.push(path);
      }
    }
  }

  const updateMenuParams = (page: string, isValid: boolean) => {
    let currentMenuParams = {...menuParams};
    currentMenuParams[page] = isValid; 
    setMenuParams(currentMenuParams);
  }

  return (
    <IonPage> 
      {/* <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
            <IonButton slot='end' routerLink={currentState.prevPage?.url} color='secondary'>
              <IonIcon icon={chevronBackCircleOutline} slot='start'/>
              Prev
            </IonButton>
              <IonButton slot='end' onClick={goToNextPage} color='secondary'>
                <IonIcon icon={chevronForwardCircleOutline} slot='end'/>
              Next
              </IonButton>
          <IonThumbnail slot="start">
            <IonImg src={midlandLogo}/>
          </IonThumbnail>
          <IonTitle>
          {currentState.currentPage.title}
          </IonTitle>
        </IonToolbar>
            
           
      </IonHeader> */}

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
