
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  UPDATE_LOCALE: 'GENERAL/UPDATE_LOCALE',
  UPDATE_USER_INFORMATION: 'GENERAL/UPDATE_USER_INFORMATION',
  LOAD_STATUSES: 'GENERAL/LOAD_STATUSES',
  LOAD_INCIDENCES_BEGIN: 'GENERAL/LOAD_INCIDENCES_BEGIN',
  LOAD_INCIDENCES_SUCCESS: 'GENERAL/LOAD_INCIDENCES_SUCCESS',
  LOAD_INCIDENCES_FAILURE: 'GENERAL/LOAD_INCIDENCES_FAILURE',
  LOAD_INCIDENCES_END: 'GENERAL/LOAD_INCIDENCES_END',
  SHOW_MESSAGE: 'GENERAL/SHOW_MESSAGE',
  SET_GEOZONE_GROUP: 'GENERAL/SET_GEOZONE_GROUP',
  SET_DISEASE: 'GENERAL/SET_DISEASE',
  TOGGLE_GEOZONE_SELECTION_MODE: 'GENERAL/TOGGLE_GEOZONE_SELECTION_MODE',
  REMOVE_SELECTED_GEOFENCE_ON_GROUP: 'GENERAL/REMOVE_SELECTED_GEOFENCE_ON_GROUP',
  ADD_SELECTED_GEOFENCE_ON_GROUP: 'GENERAL/ADD_SELECTED_GEOFENCE_ON_GROUP'
};

/**
 *
 */
export const actions = {
  showMessage: createAction(
    types.SHOW_MESSAGE,
    message => ({ message })
  ),
  removeSelectedGeofenceOnGroup: createAction(
    types.REMOVE_SELECTED_GEOFENCE_ON_GROUP,
    geofence => ({ geofence })    
  ),
  addSelectedGeofenceOnGroup: createAction(
    types.ADD_SELECTED_GEOFENCE_ON_GROUP,
    geofence => ({ geofence })    
  ),
  toggleGeozoneSelectionMode: createAction(
    types.TOGGLE_GEOZONE_SELECTION_MODE,
    selectionMode => ({ selectionMode })
  ),
  updateLocale: createAction(
    types.UPDATE_LOCALE,
    locale => ({ locale })
  ),
  updateUserInformation: createAction(
    types.UPDATE_USER_INFORMATION,
    user => ({ user })
  ),
  loadStatuses: createAction (
    types.LOAD_STATUSES,
    statuses => ({ statuses })
  ),
  setGeozoneGroup: createAction (
    types.SET_GEOZONE_GROUP,
    geozoneGroup => ({ geozoneGroup })
  ),
  setDisease: createAction(
    types.SET_DISEASE,
    disease => ({ disease })
  ),
  loadIncidences: {
    begin: createAction(types.LOAD_INCIDENCES_BEGIN),
    success: createAction(
      types.LOAD_INCIDENCES_SUCCESS,
      incidences => ({ incidences })
    ),
    failure: createAction(types.LOAD_INCIDENCES_FAILURE),
    end: createAction(types.LOAD_INCIDENCES_END)
  }
};
