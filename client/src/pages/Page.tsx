import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { useParams } from 'react-router';
import Welcome from '../components/Welcome';
import {welcomePageParameters, requestBody} from '../helpers/Utils'
import './Page.css';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {MenuSection, MenuParameters, PageValidationParamters, AppPage} from '../helpers/MenuGenerator';
import {updateValidationTable} from '../helpers/CalloutHelpers'

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
  menuParams: MenuParameters,
  hasNextBeenClicked: boolean, 
  setHasNextBeenClicked: Function,
  hasPrevBeenClicked: boolean, 
  setHasPrevBeenClicked: Function
}

const Page: React.FC<session> = ({sessionId, setSessionId, menuSections, setMenuParams, menuParams, hasNextBeenClicked, setHasNextBeenClicked,hasPrevBeenClicked,setHasPrevBeenClicked }) => {
  const history = useHistory();
  let appPages = menuSections.flatMap(e=>{
    return e.pages
  });

  const formRef = useRef<HTMLFormElement>(null);
  
  const [welcomePageFields, setWelcomePageFields] = useState<welcomePageParameters>({
    account_type: '',
    investment_type: '',
    referral_code: '',
    sales_rep: '',
    referred_by: '',
    cash_contribution_form: false,
    rollover_form: false,
    transfer_form: false,
    has_read_diclosure: false
  });

  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  });

  useLayoutEffect(function(){
    let formParams = {...menuParams};

    
    formParams.transferForm = welcomePageFields.transfer_form;
    formParams.rolloverForm = welcomePageFields.rollover_form;
    formParams.newContribution = welcomePageFields.cash_contribution_form;
    formParams.planInfo = welcomePageFields.account_type.includes('SEP');
    formParams.is401k = welcomePageFields.account_type.includes('401k');

    formParams.initialInvestment = (welcomePageFields.investment_type !== "I'm Not Sure" && welcomePageFields.investment_type !== '')
    
    setMenuParams(formParams);
  },[welcomePageFields]) //setMenuParams is this a required dependency?
  
  useLayoutEffect(function(){
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
        setWelcomePageFields(data.data);
      })
    })

    let urlValidation = '/getValidatedPages'
    let bodyValidation : requestBody ={
        session: {sessionId: sessionId, page: 'rootPage'},
        data: undefined
    }
    let optionsValidation = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bodyValidation)
    }
    fetch(urlValidation, optionsValidation).then((response)=>{
      response.json().then((data:any)=>{
        console.log(data);
        let validationParamters : PageValidationParamters = data.data;
        let menuParamsUpdate :MenuParameters = {...menuParams, ...validationParamters
        }
        console.log(menuParamsUpdate);
        setMenuParams(menuParamsUpdate)
      })
    })
  },[sessionId])

  const { name } = useParams<{ name: string; }>();

  useEffect(() => {    
    let updatedState = getPageStateFromPage(name);
    setCurrentState(updatedState);
  }, [name,menuSections]);

  useEffect(() => {
    if (hasNextBeenClicked) {
      goToNextPage();
      setHasNextBeenClicked(false);
    }
  }, [hasNextBeenClicked])

  useEffect(() => {
    if (hasPrevBeenClicked) {
      goToPrevPage();
      setHasPrevBeenClicked(false);
    }
  }, [hasPrevBeenClicked])

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
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
      case 'Disclosures':
        return <Disclosures welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} selectedAccountType={welcomePageFields.account_type} updateMenuSections={updateMenuSections} formRef={formRef} />;
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
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef}/>;
    }
  }


  const goToNextPage = () => {
    if (formRef !== null && formRef.current !== null) {
      formRef.current.dispatchEvent(new Event('submit'));
    }
  }

  const goToPrevPage = () => {
    //add something for page validation?
    let path = currentState.prevPage?.url;
    if (path){
      history.push(path);
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
    
    if(page !== 'is_welcome_page_valid')
    {
      updateValidationTable(page, isPageValid, sessionId);
    }

    if (isPageValid){
      let path = currentState.nextPage?.url;
      if (path){
        history.push(path);
      }
    }
  }


  const updateMenuParams = (page: string, isValid: boolean) => {
    let currentMenuParams : any = {...menuParams};
    currentMenuParams[page] = isValid; 
    setMenuParams(currentMenuParams);
  }

  return (
    <IonPage> 
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
