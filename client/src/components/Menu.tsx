import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
  IonFooter,
  IonText,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import './Menu.css';
import { AppPage } from '../helpers/MenuGenerator';
import {  checkmarkCircle, alertCircleOutline } from 'ionicons/icons';

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
    <IonMenu contentId="main" type="overlay" hidden={location.pathname.toUpperCase().includes('DOCUSIGN') || location.pathname.toUpperCase().includes('RESUME')}>
      <IonContent forceOverscroll={false}>
        <IonList id="inbox-list">
          {menuSections.map((menuSection, index) => {
            return (
              <React.Fragment key={index}>
                <IonListHeader>{menuSection.header}</IonListHeader>
                 {menuSection.pages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={getLink( appPage.url, appPages)} routerDirection="none" lines="none" detail={false}>
                          <IonIcon slot="start" color={appPage.isValid ? 'success' : 'primary'} icon={appPage.isValid ? checkmarkCircle : alertCircleOutline} />
                          <IonLabel className='ion-text-wrap'>{appPage.title}</IonLabel>
                        </IonItem>
                      </IonMenuToggle>
                    );
                 })}
              </React.Fragment>         
            )
          })}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar color="primary">
            <IonText color='light' className='ion-padding-start ion-text-center'>
              <strong>
                Contact Us <br/>
              </strong>
            </IonText>
              <IonText color='light' className='ion-padding-start'>
                  (239) 333-1032 
              </IonText> <br/>
              <IonText color='light' className='ion-padding-start'>
                  newaccounts@midlandira.com <br/>
              </IonText>
              <IonText color='light' className='ion-padding-start'>
                www.midlandtrust.com
              </IonText>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

function getLink( url:string, appPagesInOrder:Array<AppPage>){
  let appPagesArr = [...appPagesInOrder];
  let currentPageIndex = appPagesArr.findIndex(appPage => (appPage.url === url));
  
  if (currentPageIndex >= 0 && !appPagesArr[currentPageIndex].isValid){
    let lastValidPageIndex = appPagesArr.reverse().findIndex(appPage => appPage.isValid);

    if (lastValidPageIndex === -1) {
      url = appPagesInOrder[0].url;  
    } else {
      url = appPagesInOrder[appPagesInOrder.length-lastValidPageIndex].url;
    }
  }
  return url;
}

export {Menu };
