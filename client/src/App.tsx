import {Menu} from './components/Menu';
import Page from './pages/Page';
import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import generateAppPages, { AppSection, MenuParamters} from './helpers/MenuGenerator';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/apptheme.css';

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const [appSections, setAppSections] = useState<AppSection[]>([]);
  const[menuParams, setMenuParams] = useState<MenuParamters>({
    planInfo: false,
    transferForm: false,
    rolloverForm: false,
    newContribution: false,
    initialInvestment: false
  })

  useEffect(()=>{
    let appSections:AppSection[] = generateAppPages(menuParams)
    setAppSections(appSections);    
  },[menuParams,sessionId])

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu sessionId={sessionId} menuSections={appSections}/>
          <IonRouterOutlet id="main">
            <Route path="/page/:name" render={(props) => <Page {...props} sessionId={sessionId} setSessionId={setSessionId} menuSections={appSections}  setMenuParams={setMenuParams}/>} /> 
            <Redirect from="/" to="/page/Welcome" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
