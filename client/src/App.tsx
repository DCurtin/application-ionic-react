import {Menu} from './components/Menu';
import Resume from './pages/Resume'
import Page from './pages/Page';
import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import generateAppPages, { MenuSection, MenuParameters} from './helpers/MenuGenerator';

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
import DocusignReturn from './pages/DocusignReturn';

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState('');
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const[menuParams, setMenuParams] = useState<MenuParameters>({
    planInfo: false,
    transferForm: false,
    rolloverForm: false,
    newContribution: false,
    initialInvestment: false,
    is401k: false
  });


  useEffect(()=>{
    let menuSections:MenuSection[] = generateAppPages(menuParams);
    setMenuSections(menuSections);    
  },[menuParams,sessionId]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu sessionId={sessionId} menuSections={menuSections}/>
          <IonRouterOutlet id="main">
            <Route path="/page/:name" render={(props) => <Page {...props} sessionId={sessionId} setSessionId={setSessionId} menuSections={menuSections}  setMenuSections={setMenuSections} setMenuParams={setMenuParams}/>} /> 
            <Route path='/docusignReturn' exact>
              <DocusignReturn/>
            </Route>
            <Route path="/resume/:herokuToken" render={(props) => <Resume {...props} setSessionId={setSessionId}/>}/>
            <Redirect from="/" to="/page/Welcome" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
