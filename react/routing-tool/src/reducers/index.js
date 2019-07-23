/**
 * @file index.js
 * @description Combine reducers
 * @author Denny K. Schuldt
 *
 */

import { combineReducers } from 'redux-immutable';

import routes from './routes';
import general from './general';
import polygon from './polygon';
import backgroundJobs from './backgroundJobs';


export default combineReducers({
  routes,
  general,
  polygon,
  backgroundJobs
});
