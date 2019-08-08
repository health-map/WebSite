
import { Map, fromJS } from 'immutable';

import { types } from './../actions/general';


const initialState = Map({
  user: undefined,
  locale: 'es',
  message: '',
  selectedGeozoneGroup: undefined,
  selectedDisease: undefined,
  selectedGeozonesForGroup: [],
  isGeozoneSelectionModeOn: false
});

/**
 *
 */
const removeSelectedGeofenceOnGroup = (state, action) => {
  return state.set(
    'selectedGeozonesForGroup', 
    state.get('selectedGeozonesForGroup').filter((geozone) => {
      return geozone.id != action.payload.geofence.id;
    }));
};

/**
 *
 */
const addSelectedGeofenceOnGroup = (state, action) => {
  return state.set(
    'selectedGeozonesForGroup', 
    state.get('selectedGeozonesForGroup').push(action.payload.geofence));
};

/**
 *
 */
const toggleGeozoneSelectionMode = (state, action) => {
  return state.set('isGeozoneSelectionModeOn', action.payload.selectionMode);
};

/**
 *
 */
const setDisease = (state, action) => {
  return state.set('selectedDisease', action.payload.disease);
};

/**
 *
 */
const setGeozoneGroup = (state, action) => {
  return state.set('selectedGeozoneGroup', action.payload.geozoneGroup);
};

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
  case types.SHOW_MESSAGE:
    return showMessage(state, action);
  case types.SET_GEOZONE_GROUP:
    return setGeozoneGroup(state, action);
  case types.SET_DISEASE:
    return setDisease(state, action);
  case types.TOGGLE_GEOZONE_SELECTION_MODE:
    return toggleGeozoneSelectionMode(state, action);
  case types.REMOVE_SELECTED_GEOFENCE_ON_GROUP:
    return removeSelectedGeofenceOnGroup(state, action);
  case types.ADD_SELECTED_GEOFENCE_ON_GROUP:
    return addSelectedGeofenceOnGroup(state, action);
  default: 
    return state;
  }
}
