/**
 *
 */

import React from 'react';


import Canvas from './canvas/canvasContainer';
import ErrorBoundaryGeneral from './shared/errorBoundaryGeneral';

import './app.css';
import './../styles/icons.css';
import './../styles/dialog.css';
import './../styles/button.css';
import './../styles/form.css';

/**
 *
 */
const App = () => {
  return (
    <div className="app">
      <ErrorBoundaryGeneral>
        <Canvas/>
      </ErrorBoundaryGeneral>
    </div>
  );
};

export default App;
