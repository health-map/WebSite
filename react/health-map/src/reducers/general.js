
import { Map, List, fromJS } from 'immutable';

import { types } from './../actions/general';


const initialState = Map({
  user: undefined,
  locale: 'en',
  cities: List(),
  statuses: [
    {
      id: 'processing',
      name: 'processing'
    },
    {
      id: 'broadcasting',
      name: 'broadcasting'
    }
  ],
  routes: List(),
  isLoadingCities: false,
  isLoadingRoutes: false,
  loadCitiesError: '',
  loadRoutesError: '',
  message: ''
});


/**
 *
 */
const updateLocale = (state, action) => {
  return state.set('locale', action.payload.locale);
};

/**
 *
 */
const updateUserInformation = (state, action) => {
  return state.set('user', fromJS(action.payload.user));
};

/**
 *
 */
const loadCitiesBegin = (state) => {
  return state.set('isLoadingCities', true);
};

/**
 *
 */
const loadCitiesSuccess = (state, action) => {
  return state.set('cities', List(action.payload.cities))
    .set('loadCitiesError', '');
};

/**
 *
 */
const loadCitiesFailure = (state) => {
  return state.set('loadCitiesError', 'Could not load the cities. Please try again');
};

/**
 *
 */
const loadCitiesEnd = (state) => {
  return state.set('isLoadingCities', false);
};

/**
 *
 */
const loadStatuses = (state, action) => {
  return state.set('statuses', List(action.payload.statuses));
};

/**
 *
 */
const loadRoutesBegin = (state) => {
  return state.set('isLoadingRoutes', true);
};

/**
 *
 */
const loadRoutesSuccess = (state, action) => {
  return state.set('loadRoutesError', '')
    .set('routes', fromJS(action.payload.routes));
};

/**
 *
 */
const loadRoutesFailure = (state) => {
  return state.set('loadRoutesError', 'Could not load the routes. Please try again');
};

/**
 *
 */
const loadRoutesEnd = (state) => {
  return state.set('isLoadingRoutes', false);
};

/**
 *
 */
const showMessage = (state, action) => {
  return state.set('message', action.payload.message);
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.UPDATE_LOCALE:
    return updateLocale(state, action);
  case types.UPDATE_USER_INFORMATION:
    return updateUserInformation(state, action);
  case types.LOAD_CITIES_BEGIN:
    return loadCitiesBegin(state);
  case types.LOAD_CITIES_SUCCESS:
    return loadCitiesSuccess(state, action);
  case types.LOAD_STATUSES:
    return loadStatuses(state);
  case types.LOAD_CITIES_FAILUTE:
    return loadCitiesFailure(state);
  case types.LOAD_CITIES_END:
    return loadCitiesEnd(state);
  case types.LOAD_ROUTES_BEGIN:
    return loadRoutesBegin(state);
  case types.LOAD_ROUTES_SUCCESS:
    return loadRoutesSuccess(state, action);
  case types.LOAD_ROUTES_FAILURE:
    return loadRoutesFailure(state);
  case types.LOAD_ROUTES_END:
    return loadRoutesEnd(state);
  case types.SHOW_MESSAGE:
    return showMessage(state, action);
  default:
    return state;
  }
}
