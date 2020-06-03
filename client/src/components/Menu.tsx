import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonImg,
  IonToolbar,
  IonTitle,
  isPlatform,
  getPlatforms
} from '@ionic/react';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import {AppPage} from '../helpers/MenuGenerator';


interface AppSection {
  header: string;
  pages: AppPage[]
}

let appPages: AppPage[] = [
  {
    header: 'Getting Started',
    title: 'Welcome to Midland Trust!',
    url: '/page/Welcome',
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    header: 'Getting Started',
    title: 'Disclosures',
    url: '/page/Disclosures',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    header: 'Open Account',
    title: 'Owner Information',
    url: '/page/OwnerInformation',
    iosIcon: heartOutline,
    mdIcon: heartSharp
  },
  {
    header: 'Open Account',
    title: 'Beneficiaries',
    url: '/page/Beneficiaries',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  },
  {
    header: 'Open Account',
    title: 'Fee Arrangement',
    url: '/page/FeeArrangement',
    iosIcon: trashOutline,
    mdIcon: trashSharp
  },
  {
    header: 'Open Account',
    title: 'Account Notifications',
    url: '/page/AccountNotifications',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  },
  {
    header: 'Make Investment',
    title: 'Investment Details',
    url: '/page/InvestmentDetails',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  },
  {
    header: 'Finishing Up',
    title: 'Payment Information',
    url: '/page/PaymentInformation',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  },
  {
    header: 'Finishing Up',
    title: 'Review and Sign',
    url: '/page/ReviewAndSign',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  }
];

interface session{
  sessionId: string,
  menuSections: AppSection[]
}

const Menu: React.FC<session> = ({sessionId, menuSections}) => {
  const location = useLocation();
  useEffect(() => {
    console.log(getPlatforms());
  })

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent scrollY={isPlatform('android') || isPlatform('ios')}>
        <IonList id="inbox-list">
          {menuSections.map((appSection, index) => {
            return (
              <React.Fragment key={index}>
                <IonListHeader>{appSection.header}</IonListHeader>
                 {appSection.pages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                          <IonIcon slot="start" icon={appPage.iosIcon} />
                          <IonLabel>{appPage.title}</IonLabel>
                        </IonItem>
                      </IonMenuToggle>
                    );
                 })}
              </React.Fragment>         
            )
          })}
        </IonList>
        <IonImg src="../../assets/icon/midlandSideBar.PNG"></IonImg>
        <IonToolbar color="primary">
            <IonTitle>FAQs</IonTitle>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonTitle> Contact Us </IonTitle>
        </IonToolbar>
      </IonContent>
    </IonMenu>
  );
};

export {Menu, appPages};
