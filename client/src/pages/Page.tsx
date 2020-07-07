import { IonButtons, IonContent, IonPage, IonToolbar, IonButton, IonIcon, IonToast, IonLoading } from '@ionic/react';
import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {isPlatform } from '@ionic/react'
import { useParams } from 'react-router';
import Welcome from '../components/Welcome';
import {welcomePageParameters, requestBody} from '../helpers/Utils'
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import {MenuSection, MenuParameters, PageValidationParamters, AppPage} from '../helpers/MenuGenerator';
import {updateValidationTable} from '../helpers/CalloutHelpers';
import { chevronBackCircleOutline, chevronForwardCircleOutline} from 'ionicons/icons';

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

  let formRef = useRef<HTMLFormElement>(null);
  
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

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSpinner, setShowSpinner]  = useState(false); 
  const [showPageTransition, setShowPageTransition] = useState(true);

  useLayoutEffect(function(){
    let formParams = {...menuParams};
    formParams.transferForm = welcomePageFields.transfer_form;
    formParams.rolloverForm = welcomePageFields.rollover_form;
    formParams.newContribution = welcomePageFields.cash_contribution_form;
    formParams.planInfo = welcomePageFields.account_type.includes('SEP');
    formParams.is401k = welcomePageFields.account_type.includes('401k');

    formParams.initialInvestment = (welcomePageFields.investment_type !== "I'm Not Sure" && welcomePageFields.investment_type !== '')
    
    setMenuParams(formParams);
  },[welcomePageFields])
  
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
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'Disclosures':
        return <Disclosures welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} selectedAccountType={welcomePageFields.account_type} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setShowSpinner={setShowSpinner} />;
      case 'OwnerInformation':
        return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast}
        setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'Beneficiaries':
        return <Beneficiaries sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'FeeArrangement':
        return <FeeArrangement sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'AccountNotifications':
        return <AccountNotifications sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'TransferIRA':
        return <Transfers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'RolloverPlan':
        return <Rollovers sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'InvestmentDetails':
        return <InitialInvestment sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'NewContribution':
        return <NewContribution sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'PaymentInformation':
        return <PaymentInformation sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      case 'ReviewAndSign':
        return <ReviewAndSign sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
      default: 
        return <Welcome welcomePageFields={welcomePageFields} setWelcomePageFields={setWelcomePageFields} sessionId={sessionId} setSessionId={setSessionId} updateMenuSections={updateMenuSections} formRef={formRef} setShowErrorToast={setShowErrorToast} setErrorMessage={setErrorMessage} setShowSpinner={setShowSpinner}/>;
    }
  }


  const goToNextPage = () => {
    if (formRef !== null && formRef.current !== null) {
      formRef.current.dispatchEvent(new Event('submit'));
    }
  }

  const goToPrevPage = () => {
    let path = currentState.prevPage?.url;
    if (path){
      history.push(path);
    }
  }

  const isMobile = () => {
    return (isPlatform('iphone') || isPlatform('android') || isPlatform('ipad'));
  }

  const updateMenuSections = (page: string, isPageValid:boolean) => {
    let currentPage  = {...currentState.currentPage};
    let newPage = {...currentPage, isValid: isPageValid};
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
    <IonPage className={isPlatform('android') ? 'android-fit-content ion-justify-content-around' : ''}> 
      <IonContent>
        <IonToast color="danger shade" position="top" isOpen={showErrorToast} onDidDismiss={() => setShowErrorToast(false)} message={errorMessage === '' ? 'Required Fields Missing' : errorMessage} buttons={[
          {
            icon: 'close',
            role: 'cancel'
          }
        ]}/>
        <IonLoading isOpen={showSpinner} message={'Loading..'} spinner="lines"></IonLoading>
        {isMobile() && (
            <IonToolbar>
              <IonButtons className="ion-justify-content-center">
                <IonButton fill='solid' onClick={goToPrevPage} color='secondary' disabled={name.toUpperCase().includes('WELCOME')}>
                  <IonIcon icon={chevronBackCircleOutline} slot='start'/>
                  Prev
                </IonButton>
                <IonButton fill='solid'>
                  Save & Return Later
                </IonButton>
                  <IonButton fill='solid' onClick={goToNextPage} color='secondary'>
                    <IonIcon icon={chevronForwardCircleOutline} slot='end'/>
                  Next
                  </IonButton>
              </IonButtons>

            </IonToolbar>
        )}
        {/* <TransitionGroup style={{height: "100%"}}>
          <CSSTransition appear={true} key={name} timeout={500} classNames="page"> */}
              {displayPage(name)}
          {/* </CSSTransition>
        </TransitionGroup> */}
      </IonContent>
    </IonPage>
  );
};

export default Page;
