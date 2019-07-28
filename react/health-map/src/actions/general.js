
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
  LOAD_INCIDENCES_BEGIN: 'GENERAL/LOAD_INCIDENCES_BEGIN',
  LOAD_INCIDENCES_SUCCESS: 'GENERAL/LOAD_INCIDENCES_SUCCESS',
  LOAD_INCIDENCES_FAILURE: 'GENERAL/LOAD_INCIDENCES_FAILURE',
  LOAD_INCIDENCES_END: 'GENERAL/LOAD_INCIDENCES_END',
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
  loadStatuses: createAction (
    types.LOAD_STATUSES,
    statuses => ({ statuses })
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
