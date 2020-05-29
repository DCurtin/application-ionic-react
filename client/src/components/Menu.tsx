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
} from '@ionic/react';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';

export interface AppPage {
  header?: string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

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

let appSections : AppSection[] = [
  {
    header: 'Getting Started',
    pages: [...appPages.filter(page => page.header === 'Getting Started')]
  },
  {
    header: 'Open Account',
    pages: [...appPages.filter(page => page.header === 'Open Account')]
  },
  {
    header: 'Make Investment', 
    pages: [...appPages.filter(page => page.header === 'Make Investment')]
  },
  {
    header: 'Finishing Up',
    pages: [...appPages.filter(page => page.header === 'Finishing Up')]
  }
]

interface session{
  sessionId: string
}

const Menu: React.FC<session> = ({sessionId}) => {
  const location = useLocation();
  console.log('menu ' + sessionId);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent forceOverscroll={true}>
        <IonList id="inbox-list">
          {appSections.map((appSection, index) => {
            return (
              <React.Fragment key={index}>
                <IonListHeader>{appSection.header}</IonListHeader>
                 {appSection.pages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={getLink(location.search, appPage.url, sessionId)} routerDirection="none" lines="none" detail={false}>
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

function getLink(location:string, url:string, sessionId:string){
  /*console.log(location);
  if(location.includes('id'))
  {
    var parameters = location.replace('?','').split('&');
    var id = parameters.find(e=>{return e.includes('id')});
    if(id === undefined){
      return url
    }else{
      return url + '?' + id;
    }
  }

  if(sessionId !== '')
  {
    return url +'?id=' +sessionId
  }*/

  return url;
  //appPage.url
}

export {Menu, appPages};
