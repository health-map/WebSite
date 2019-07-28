/**
 * @file index.js
 * @description Combine reducers
 * @author Denny K. Schuldt
 *
 */

import { combineReducers } from 'redux-immutable';

import incidences from './incidences';
import general from './general';


export default combineReducers({
  incidences,
  general
});
