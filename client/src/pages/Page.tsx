import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonBackButton, IonItemDivider, IonButton } from '@ionic/react';
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import Welcome from '../components/Welcome';
import Disclosures from '../components/Disclosures';
import OwnerInformation from '../components/OwnerInformation';
import './Page.css';
import {AppPage, AppSection, MenuParamters} from '../helpers/MenuGenerator'
import Beneficiaries from '../components/Beneficiaries';

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
  let appPages = menuSections.flatMap(appSection => {
    return appSection.pages;
  });

  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA');
  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined, 
    currentPage: appPages[0], 
    nextPage: appPages[1]
  });
  const [TransferIra, SetTransferIra] = useState(false);
  const [RolloverEmployer, SetRolloverEmployer] = useState(false);
  const [CashContribution, SetCashContribution] = useState(false);

  const [InitialInvestment, setInitialInvestment] = useState<string>('');
  const [SalesRep, SetSalesRep] = useState<string>('');
  const [SpecifiedSource, SetSpecifiedSource] = useState<string>('');
  const [ReferralCode, SetReferralCode] = useState<string>('');

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

  const displayPageTitle = (pageName:string) => {
    switch(pageName){
      case 'Welcome':
        return 'Welcome to Midland Trust!'
      case 'OwnerInformation':
        return 'Owner Information';
      case 'FeeArrangement':
        return 'Fee Arrangement';
      case 'AccountNotifications':
        return 'Account Notifications';
      case 'InvestmentDetails':
        return 'Investment Details';
      case 'PaymentInformation':
        return 'Payment Information';
      case 'ReviewAndSign':
        return 'Review And Sign';
      default:
        return pageName;
    }
  }

  const displayPage = (pageName:string) => {
    if (!currentState.currentPage.url.includes(pageName)) {
      let updatedState = getPageStateFromPage(pageName);
      setCurrentState(updatedState);
    }

    interface AppInitializeInfo {
      AccountType: string,
      SetAccountType: Function,
      
      TransferIra: boolean,
      SetTransferIra: Function,
  
      RolloverEmployer: boolean,
      SetRolloverEmployer: Function,
  
      CashContribution: boolean,
      SetCashContribution: Function,
  
      InitialInvestment: string,
      SetInitialInvestment: Function,
  
      SalesRep: string,
      SetSalesRep: Function,
  
      SpecifiedSource: string,
      SetSpecifiedSource: Function,
  
      ReferralCode: string,
      SetReferralCode: Function
    }

    let initialValues : AppInitializeInfo = {
      AccountType: selectedAccountType,
      SetAccountType: setSelectedAccountType,
  
      TransferIra: TransferIra,
      SetTransferIra: SetTransferIra,
  
      RolloverEmployer: RolloverEmployer,
      SetRolloverEmployer: SetRolloverEmployer,
  
      CashContribution: CashContribution,
      SetCashContribution: SetCashContribution,
  
      InitialInvestment: InitialInvestment,
      SetInitialInvestment: setInitialInvestment,
  
      SalesRep: SalesRep,
      SetSalesRep: SetSalesRep,
  
      SpecifiedSource: SpecifiedSource,
      SetSpecifiedSource: SetSpecifiedSource,
  
      ReferralCode: ReferralCode,
      SetReferralCode: SetReferralCode
    }

    switch (pageName) {
      case 'Welcome': 
      return <Welcome InitialValues={initialValues} />;
    case 'Disclosures':
      return <Disclosures selectedAccountType={selectedAccountType}/>;
    case 'OwnerInformation':
      return <OwnerInformation sessionId={sessionId} setSessionId={setSessionId}/>;
    case 'Beneficiaries': 
      return <Beneficiaries/>
    default:
      return <ExploreContainer name={pageName} currentState={currentState}/>
  }
}

  useEffect(function(){
    let formParams : MenuParamters = {
      initialInvestment : false,
      newContribution : false,
      planInfo : false,
      rolloverForm : false,
      transferForm : false
    }
    let hasInitialInvestment= (InitialInvestment !== '' && !InitialInvestment.includes('Sure'));
    formParams.initialInvestment = hasInitialInvestment;
    formParams.transferForm = TransferIra;
    formParams.rolloverForm = RolloverEmployer;
    formParams.newContribution = CashContribution;
    
    setMenuParams(formParams);
  },[InitialInvestment,TransferIra, RolloverEmployer, CashContribution]);

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
