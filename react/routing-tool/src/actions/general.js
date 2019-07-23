
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  UPDATE_LOCALE: 'GENERAL/UPDATE_LOCALE',
  UPDATE_USER_INFORMATION: 'GENERAL/UPDATE_USER_INFORMATION',
  LOAD_CITIES_BEGIN: 'GENERAL/LOAD_CITIES_BEGIN',
  LOAD_CITIES_SUCCESS: 'GENERAL/LOAD_CITIES_SUCESS',
  LOAD_CITIES_FAILURE: 'GENERAL/LOAD_CITIES_FAILURE',
  LOAD_CITIES_END: 'GENERAL/LOAD_CITIES_END',
  LOAD_STATUSES: 'GENERAL/LOAD_STATUSES',
  LOAD_ROUTES_BEGIN: 'GENERAL/LOAD_ROUTES_BEGIN',
  LOAD_ROUTES_SUCCESS: 'GENERAL/LOAD_ROUTES_SUCCESS',
  LOAD_ROUTES_FAILURE: 'GENERAL/LOAD_ROUTES_FAILURE',
  LOAD_ROUTES_END: 'GENERAL/LOAD_ROUTES_END',
  SHOW_MESSAGE: 'GENERAL/SHOW_MESSAGE'
};

/**
 *
 */
export const actions = {
  showMessage: createAction(
    types.SHOW_MESSAGE,
    message => ({ message })
  ),
  updateLocale: createAction(
    types.UPDATE_LOCALE,
    locale => ({ locale })
  ),
  updateUserInformation: createAction(
    types.UPDATE_USER_INFORMATION,
    user => ({ user })
  ),
  loadCities: {
    begin: createAction(types.LOAD_CITIES_BEGIN),
    success: createAction(
      types.LOAD_CITIES_SUCCESS,
      cities => ({ cities })
    ),
    failure: createAction(types.LOAD_CITIES_FAILURE),
    end: createAction(types.LOAD_CITIES_END)
  },
  loadStatuses: createAction (
    types.LOAD_STATUSES,
    statuses => ({ statuses })
  ),
  loadRoutes: {
    begin: createAction(types.LOAD_ROUTES_BEGIN),
    success: createAction(
      types.LOAD_ROUTES_SUCCESS,
      routes => ({ routes })
    ),
    failure: createAction(types.LOAD_ROUTES_FAILURE),
    end: createAction(types.LOAD_ROUTES_END)
  }
};
