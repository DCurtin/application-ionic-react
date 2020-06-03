import React from 'react';
import './ExploreContainer.css';
import {userState} from '../pages/Page';

interface ContainerProps {
  name: string,
  currentState: userState
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, currentState }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </div>
  );
};

export default ExploreContainer;
