import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonThumbnail, IonItem, IonButton, IonList } from '@ionic/react';
import {AppPage} from '../components/Menu';
import React, {useState, useEffect} from 'react';
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
import {AppSection, MenuParamters} from '../helpers/MenuGenerator'

export interface userState {
  prevPage?:AppPage, 
  currentPage: AppPage, 
  nextPage?: AppPage
}

export interface userState{
  prevPage?: AppPage,
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
  let appPages = menuSections.flatMap(e=>{
    return e.pages
  })

  console.log(appPages);
  //console.log(setSessionId);
  const [selectedAccountType, setSelectedAccountType] = useState<string>('Traditional IRA'); 
  
  const [TransferIra, SetTransferIra] = useState(false);
  const [RolloverEmployer, SetRolloverEmployer] = useState(false);
  const [CashContribution, SetCashContribution] = useState(false);

  const [InitialInvestment, setInitialInvestment] = useState<string>('');
  const [SalesRep, SetSalesRep] = useState<string>('');
  const [SpecifiedSource, SetSpecifiedSource] = useState<string>('');
  const [ReferralCode, SetReferralCode] = useState<string>('');

  useEffect(function(){
    let formParams : MenuParamters = {
      initialInvestment : false,
      newContribution : false,
      planInfo : false,
      rolloverForm : false,
      transferForm : false
    }
    console.log('use effect on page');
    console.log(TransferIra);
    
    formParams.transferForm = TransferIra;
    formParams.rolloverForm = RolloverEmployer;
    formParams.newContribution = CashContribution;
    
    setMenuParams(formParams);
  },[TransferIra, RolloverEmployer, CashContribution])

  //const [sessionId, setSessionId] = useState<string>('');
  const [currentState, setCurrentState] = useState<userState>({
    prevPage: undefined,
    currentPage: appPages[0],
    nextPage: appPages[1]
  })

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
