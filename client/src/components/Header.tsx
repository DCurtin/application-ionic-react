import React, {useState, useEffect, useRef} from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonImg, IonThumbnail, IonButton, IonIcon } from '@ionic/react';
import { chevronBackCircleOutline, chevronForwardCircleOutline
} from 'ionicons/icons';
import midlandLogo from '../images/midlandCrestForDarkBg.png';
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
    menuParams: MenuParameters
  }

const Header: React.FC<session> = ({menuSections, setMenuSections}) => {
    const formRef = useRef<HTMLFormElement>(null);
    let appPages = menuSections.flatMap(e=>{
        return e.pages
      });

    const [currentState, setCurrentState] = useState<userState>({
        prevPage: undefined,
        currentPage: appPages[0],
        nextPage: appPages[1]
      });

      const goToNextPage = () => {
        if (formRef !== null && formRef.current !== null) {
          formRef.current.dispatchEvent(new Event('submit'));
        }
      }

    return(
        <IonHeader translucent={true}>
        <IonToolbar> 
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
            <IonButton slot='end' routerLink={currentState.prevPage?.url} color='secondary'>
              <IonIcon icon={chevronBackCircleOutline} slot='start'/>
              Prev
            </IonButton>
              <IonButton slot='end' onClick={goToNextPage} color='secondary'>
                <IonIcon icon={chevronForwardCircleOutline} slot='end'/>
              Next
              </IonButton>
          <IonThumbnail slot="start">
            <IonImg src={midlandLogo}/>
          </IonThumbnail>
          <IonTitle>
          {/* {currentState.currentPage.title} */} TEST HEADER
          </IonTitle>
        </IonToolbar>
            
           
      </IonHeader>
    )
}

export default Header;