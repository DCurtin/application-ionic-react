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
import './Menu.css';
import { AppPage } from '../helpers/MenuGenerator';
import { checkmarkCircleSharp, checkmarkCircle, alertCircleOutline, alertCircleSharp } from 'ionicons/icons';

interface AppSection {
  header: string;
  pages: AppPage[]
}


interface session{
  sessionId: string,
  menuSections: AppSection[]
}

const Menu: React.FC<session> = ({sessionId, menuSections}) => {
  const location = useLocation();
  let appPages = menuSections.flatMap(menuSection => menuSection.pages);
  return (
    <IonMenu contentId="main" type="overlay" hidden={location.pathname.toUpperCase().includes('DOCUSIGN')}>
      <IonContent forceOverscroll={true}>
        <IonList id="inbox-list">
          {menuSections.map((menuSection, index) => {
            return (
              <React.Fragment key={index}>
                <IonListHeader>{menuSection.header}</IonListHeader>
                 {menuSection.pages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={getLink( appPage.url, appPages)} routerDirection="none" lines="none" detail={false}>
                          <IonIcon slot="start" icon={appPage.isValid ? checkmarkCircle : alertCircleOutline} />
                          <IonLabel className='ion-text-wrap'>{appPage.title}</IonLabel>
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

function getLink( url:string, appPagesInOrder:Array<AppPage>){
  let appPagesArr = [...appPagesInOrder];
  let currentPageIndex = appPagesArr.findIndex(appPage => (appPage.url === url));
  
  if (currentPageIndex >= 0 && !appPagesArr[currentPageIndex].isValid){
    let lastValidPageIndex = appPagesArr.reverse().findIndex(appPage => appPage.isValid);

    if (lastValidPageIndex == -1) {
      url = appPagesInOrder[0].url;  
    } else {
      url = appPagesInOrder[appPagesInOrder.length-lastValidPageIndex].url;
    }
  }
  return url;
}

export {Menu };
