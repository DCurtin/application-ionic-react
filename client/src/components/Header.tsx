import React from 'react';
import { useLocation } from 'react-router';
import {isPlatform } from '@ionic/react';
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import { chevronBackCircleOutline, chevronForwardCircleOutline
} from 'ionicons/icons';
import midlandLogo from '../images/midlandCrest.jpg';
import {MenuSection, MenuParameters, AppPage} from '../helpers/MenuGenerator'; 
import {saveApplication} from '../helpers/CalloutHelpers'

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

const Header: React.FC<session> = ({menuSections, setHasNextBeenClicked, setHasPrevBeenClicked, sessionId}) => {
      let appPages = menuSections.flatMap(e=>{
        return e.pages
      });

      const goToNextPage = () => {
       setHasNextBeenClicked(true);
      }

      const goToPrevPage = () => {
          setHasPrevBeenClicked(true);
      }

     let location = useLocation();

    const displayTitle = () => {
      let pathName = location.pathname.toUpperCase(); 
      if (!isMobile()) {
        if (pathName.includes('DOCUSIGN')) {
          return 'Finishing Up';
        }
        else {
          return !isMobile() && (appPages.filter(page => page.url === location.pathname))[0]?.title;
        }
      } 
    }

     const displayRoutingButtons = () => {
         let pathName = location.pathname.toUpperCase();
         return (!pathName.includes('DOCUSIGN') && !pathName.includes('RESUME') && !isMobile());
     }

     const isMobile = () => {
       return (isPlatform('iphone') || isPlatform('android') || isPlatform('ipad'));
     }
    
    return(
        <IonHeader>
        <IonToolbar> 
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
          {displayRoutingButtons() &&
          (<React.Fragment>
            <IonButton slot='end' onClick={goToPrevPage} color='secondary' disabled={location.pathname.toUpperCase().includes('WELCOME')}>
              <IonIcon icon={chevronBackCircleOutline} slot='start'/>
              Prev
            </IonButton>
            <IonButton slot='end' onClick={()=>{handleSave(sessionId)}}>
              Save & Return Later
            </IonButton>
            <IonButton slot='end' onClick={goToNextPage} color='secondary'>
              <IonIcon icon={chevronForwardCircleOutline} slot='end'/>
            Next
            </IonButton>
          </React.Fragment>)}
          <IonThumbnail slot='start'>
            <IonImg src={midlandLogo}/>
          </IonThumbnail>
          <IonTitle size='small'>
            {displayTitle()}
          </IonTitle>
        </IonToolbar>    
      </IonHeader>
    )
}

function handleSave(sessionId: string){
  console.log(`header sessionId: ${sessionId}`)
  saveApplication(sessionId).then((result)=>{
    console.log(`header save result: ${result.ok}`)
  })
}

export default Header;