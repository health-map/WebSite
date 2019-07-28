/**
 * @file index.js
 * @description Combine reducers
 * @author Denny K. Schuldt
 *
 */

import { combineReducers } from 'redux-immutable';

import routes from './routes';
import general from './general';


export default combineReducers({
  routes,
  general
});
