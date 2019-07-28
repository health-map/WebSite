
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  TOGGLE_INCIDENCE_VISIBILITY: 'ROUTES/TOGGLE_INCIDENCE_VISIBILITY',
  LOAD_INCIDENCES_BEGIN: 'ROUTES/LOAD_INCIDENCES_BEGIN',
  LOAD_INCIDENCES_SUCCESS: 'ROUTES/LOAD_INCIDENCES_SUCCESS',
  LOAD_INCIDENCES_FAILURE: 'ROUTES/LOAD_INCIDENCES_FAILURE',
  LOAD_INCIDENCES_END: 'ROUTES/LOAD_INCIDENCES_END',
  CHANGE_ROUTE_COLOR: 'ROUTES/CHANGE_ROUTE_COLOR',
  SELECT_GEOZONE: 'ROUTES/SELECT_GEOZONE'
};

/**
 *
 */
export const actions = {
  toggleIncidenceVisibility: createAction(
    types.TOGGLE_INCIDENCE_VISIBILITY,
    (routeId, isVisible) => ({ routeId,
      isVisible })
  ),
  loadIncidences: {
    begin: createAction(types.LOAD_INCIDENCES_BEGIN),
    success: createAction(
      types.LOAD_INCIDENCES_SUCCESS,
      incidences => ({ incidences })
    ),
    failure: createAction(types.LOAD_INCIDENCES_FAILURE),
    end: createAction(types.LOAD_INCIDENCES_END)
  },
  changeRouteColor: createAction(
    types.CHANGE_ROUTE_COLOR,
    (routeId, color) => ({ routeId,
      color })
  ),
  selectGeozone: createAction(
    types.SELECT_GEOZONE,
    (routeId, deliveryId, activityType, color) => ({
      routeId,
      deliveryId,
      activityType,
      color
    })
  )
};
