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


interface session{
  sessionId: string,
  menuSections: AppSection[]
}

const Menu: React.FC<session> = ({sessionId, menuSections}) => {
  const location = useLocation();
  console.log('menu ' + sessionId);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent forceOverscroll={true}>
        <IonList id="inbox-list">
          {menuSections.map((appSection, index) => {
            return (
              <React.Fragment key={index}>
                <IonListHeader>{appSection.header}</IonListHeader>
                 {appSection.pages.map((appPage, index) => {
                    return (
                      <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={getLink(location.search, appPage.url, sessionId)} routerDirection="none" lines="none" detail={false}>
                          <IonIcon slot="start" icon={appPage.iosIcon} />
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

export {Menu };
