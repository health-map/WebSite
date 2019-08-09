
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  TOGGLE_INCIDENCE_VISIBILITY: 'INCIDENCES/TOGGLE_INCIDENCE_VISIBILITY',
  LOAD_INCIDENCES_BEGIN: 'INCIDENCES/LOAD_INCIDENCES_BEGIN',
  LOAD_INCIDENCES_SUCCESS: 'INCIDENCES/LOAD_INCIDENCES_SUCCESS',
  LOAD_INCIDENCES_FAILURE: 'INCIDENCES/LOAD_INCIDENCES_FAILURE',
  LOAD_INCIDENCES_END: 'INCIDENCES/LOAD_INCIDENCES_END',
  CHANGE_INCIDENCE_COLOR: 'INCIDENCES/CHANGE_INCIDENCE_COLOR',
  SELECT_GEOZONE: 'INCIDENCES/SELECT_GEOZONE',
  MUTATE_FILTERS: 'INCIDENCES/MUTATE_FILTERS',
  MUTATE_MANY_FILTERS: 'INCIDENCES/MUTATE_MANY_FILTERS',
  START_LOADING_MAP: 'INCIDENCES/START_LOADING_MAP',
  FINISH_LOADING_MAP: 'INCIDENCES/FINISH_LOADING_MAP',
  SET_MAP_BOUNDS: 'INCIDENCES/SET_MAP_BOUNDS'
};

/**
 *
 */
export const actions = {
  toggleIncidenceVisibility: createAction(
    types.TOGGLE_INCIDENCE_VISIBILITY,
    (incidenceId, isVisible) => ({ incidenceId,
      isVisible })
  ),
  mutateFilters: createAction(
    types.MUTATE_FILTERS,
    (filterKey, filterValue) => ({ filterKey,
      filterValue })
  ),
  setMapBounds: createAction(
    types.SET_MAP_BOUNDS,
    (bounds) => ({ bounds })
  ),
  startLoadingMap: createAction(
    types.START_LOADING_MAP,
    () => ({})
  ),
  finishLoadingMap: createAction(
    types.FINISH_LOADING_MAP,
    () => ({})
  ),
  mutateManyFilters: createAction(
    types.MUTATE_MANY_FILTERS,
    (mutations) => ({ mutations })
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
  changeIncidenceColor: createAction(
    types.CHANGE_INCIDENCE_COLOR,
    (incidenceId, color) => ({ incidenceId,
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
