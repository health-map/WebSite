/**
 * @file index.js
 * @description Main routing tool file.
 * @author Denny K. Schuldt
 *
 */

import React from 'react';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
//import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import App from './components/app';
import reducers from './reducers';
import { thunks } from './actions/thunks/general';
import { actions as generalActions } from './actions/general';
import { actions as backgroundJobsActions } from './actions/backgroundJobs';

import 'react-select/dist/react-select.css';


let socket;

const SOCKET_CONNECT = 'connect';
const SOCKET_DISCONNECT = 'disconnect';
const SOCKET_BACKGROUND_JOB_COMPLETE = 'complete';
const SOCKET_BACKGROUND_JOB_FAILED = 'failed';
const SOCKET_BACKGROUND_JOB_UPDATE = 'progress';

/**
 *
 */
const subscribeEvents = (environment) => {
  if (socket) {
    return;
  }
  let socketDomain = 'https://live.shippify.co';
  if (environment === 'development') {
    socketDomain = 'https://localhost:3001';
  }
  if (environment === 'staging') {
    socketDomain = 'staging.shippify.co:3001';
  }
  socket = io(socketDomain);
  socket.on(SOCKET_CONNECT, () => {
    console.log('ROUTING SOCKET CONNECTED');
  });
  socket.on(SOCKET_BACKGROUND_JOB_UPDATE, (update) => {
    store.dispatch(
      backgroundJobsActions.updateBackgroundJob(
        update.jobId,
        update.progress
      )
    );
  });
  socket.on(SOCKET_BACKGROUND_JOB_COMPLETE, (result) => {
    store.dispatch(
      backgroundJobsActions.removeBackgroundJob(
        result.jobId
      )
    );
  });
  socket.on(SOCKET_BACKGROUND_JOB_FAILED, (result) => {
    store.dispatch(
      backgroundJobsActions.removeBackgroundJob(
        result.jobId
      )
    );
  });
  socket.on(SOCKET_DISCONNECT, () => {
    console.log('DISCONNECTED');
  });
};

/**
 *
 */
window.onSubscribeBackgroundJob = (jobId, type, progress = 0) => {
  socket.emit('subs_job_updates_rooms', type, jobId);
  store.dispatch(backgroundJobsActions.addBackgroundJob(jobId, type, progress));
};


/*const logger = createLogger({
  collapsed: true
});*/

const middleware = [thunk];
const store = createStore(
  reducers,
  applyMiddleware(...middleware/*, logger*/)
);

/**
 *
 */
export const init = (data, selector) => {
  store.dispatch(generalActions.updateLocale(data.locale));
  store.dispatch(generalActions.updateUserInformation(data.user));
  store.dispatch(thunks.loadCities());
  subscribeEvents(data.user.environment);
  window.translation = (text) => {
    return data.translations[text] ? data.translations[text] : text;
  };
  render (
    <Provider store={store}>
      <App/>
    </Provider>,
    selector
  );
};
