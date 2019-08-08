/**
 * @file index.js
 * @description Main routing tool file.
 * @author Leonardo Kuffo R.
 *
 */

import React from 'react';
import thunk from 'redux-thunk';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './components/app';
import reducers from './reducers';
import { actions as generalActions } from './actions/general';

import 'react-select/dist/react-select.css';


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
  let userData = data.user;
  if (!userData) {
    userData = {
      apiUrl: 'http://localhost:8020',
      apiToken: 'YWJjZGU6YWJjZGU='
    };
  }
  store.dispatch(generalActions.updateUserInformation(userData));
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
