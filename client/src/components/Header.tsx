import React from 'react';
import { useLocation } from 'react-router';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import { chevronBackCircleOutline, chevronForwardCircleOutline
} from 'ionicons/icons';
import midlandLogo from '../images/midlandCrest.jpg';
import {MenuSection, MenuParameters, AppPage} from '../helpers/MenuGenerator'; 

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

const Header: React.FC<session> = ({menuSections, setHasNextBeenClicked, setHasPrevBeenClicked}) => {
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
         return (appPages.filter(page => page.url === location.pathname))[0]?.title;
     }

     const displayRoutingButtons = () => {
         let pathName = location.pathname.toUpperCase();
         return (!pathName.includes('DOCUSIGN') && !pathName.includes('RESUME'));
     }
    

    return(
        <IonHeader>
        <IonToolbar> 
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {displayRoutingButtons() &&
          (<React.Fragment>
            <IonButton slot='end' onClick={goToPrevPage} color='secondary'>
              <IonIcon icon={chevronBackCircleOutline} slot='start'/>
              Prev
            </IonButton>
              <IonButton slot='end' onClick={goToNextPage} color='secondary'>
                <IonIcon icon={chevronForwardCircleOutline} slot='end'/>
              Next
              </IonButton>
          </React.Fragment>)}
          <IonThumbnail slot="start">
            <IonImg src={midlandLogo}/>
          </IonThumbnail>
          <IonTitle>
            {displayTitle()}
          </IonTitle>
        </IonToolbar>
            
           
      </IonHeader>
    )
}

export default Header;