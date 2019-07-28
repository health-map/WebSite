
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  TOGGLE_ROUTE_SELECTION: 'ROUTES/TOGGLE_ROUTE_SELECTION',
  TOGGLE_ROUTE_VISIBILITY: 'ROUTES/TOGGLE_ROUTE_VISIBILITY',
  LOAD_INCIDENCES_BEGIN: 'ROUTES/LOAD_INCIDENCES_BEGIN',
  LOAD_INCIDENCES_SUCCESS: 'ROUTES/LOAD_INCIDENCES_SUCCESS',
  LOAD_INCIDENCES_FAILURE: 'ROUTES/LOAD_INCIDENCES_FAILURE',
  LOAD_INCIDENCES_END: 'ROUTES/LOAD_INCIDENCES_END',
  LOAD_ROUTE_BEGIN: 'ROUTE/LOAD_ROUTE_BEGIN',
  LOAD_ROUTE_SUCCESS: 'ROUTE/LOAD_ROUTE_SUCCESS',
  LOAD_ROUTE_FAILURE: 'ROUTE/LOAD_ROUTE_FAILURE',
  LOAD_ROUTE_END: 'ROUTE/LOAD_ROUTE_END',
  TOGGLE_ROUTES_SELECTION: 'ROUTES/TOGGLE_ROUTES_SELECTION',
  TOGGLE_ROUTES_VISIBILITY: 'ROUTES/TOGGLE_ROUTES_VISIBILITY',
  CHANGE_ROUTE_COLOR: 'ROUTES/CHANGE_ROUTE_COLOR',
  SELECT_ROUTE: 'ROUTES/SELECT_ROUTE',
  LOAD_ROUTE_INFO_BEGIN: 'ROUTES/LOAD_ROUTE_INFO_BEGIN',
  LOAD_ROUTE_INFO_SUCCESS: 'ROUTES/LOAD_ROUTE_INFO_SUCCESS',
  LOAD_ROUTE_INFO_FAILURE: 'ROUTES/LOAD_ROUTE_INFO_FAILURE',
  LOAD_ROUTE_INFO_END: 'ROUTES/LOAD_ROUTE_INFO_END',
  UPDATE_ROUTE_STEPS: 'ROUTES/UPDATE_ROUTE_STEPS',
  SELECT_STEP: 'ROUTES/SELECT_STEP',
  FILTER_STEP: 'ROUTES/FILTER_STEP',
  UPDATE_ROUTE_COURIER: 'ROUTES/UPDATE_ROUTE_COURIER',
  SELECT_ROUTE_TO_REORDER: 'ROUTES/SELECT_ROUTE_TO_REORDER',
  SELECT_ROUTE_TO_SWAP: 'ROUTES/SELECT_ROUTE_TO_SWAP',
  SELECT_POINTS_TYPE: 'ROUTES/SELECT_POINTS_TYPE',
  CHANGE_STEP_ORDER: 'ROUTES/CHANGE_STEP_ORDER',
  CHANGE_REORDER_ERROR: 'ROUTES/CHANGE_REORDER_ERROR',
  SELECT_ROUTE_ID_TO_ADD_DELIVERIES: 'ROUTES/SELECT_ROUTE_ID_TO_ADD_DELIVERIES',
  SELECT_ROUTE_ID_TO_DIVIDE: 'ROUTES/SELECT_ROUTE_ID_TO_DIVIDE',
  LOAD_DELIVERY_PATH_BEGIN: 'ROUTES/LOAD_DELIVERY_PATH_BEGIN',
  LOAD_DELIVERY_PATH_SUCCESS: 'ROUTES/LOAD_DELIVERY_PATH_SUCCESS',
  LOAD_DELIVERY_PATH_FAILURE: 'ROUTES/LOAD_DELIVERY_PATH_FAILURE',
  LOAD_DELIVERY_PATH_END: 'ROUTES/LOAD_DELIVERY_PATH_END'
};

/**
 *
 */
export const actions = {
  selectRouteIdToAddDeliveries: createAction(
    types.SELECT_ROUTE_ID_TO_ADD_DELIVERIES,
    (routeId) => ({ routeId })
  ),
  selectRouteIdToDivide: createAction(
    types.SELECT_ROUTE_ID_TO_DIVIDE,
    (routeId) => ({ routeId })
  ),
  changeReorderError: createAction(
    types.CHANGE_REORDER_ERROR,
    (error) => ({ error })
  ),
  changeStepOrder: createAction(
    types.CHANGE_STEP_ORDER,
    (deliveryIds, activityType, oldIndex, newIndex) => ({
      deliveryIds,
      activityType,
      oldIndex,
      newIndex
    })
  ),
  updateRouteCourier: createAction(
    types.UPDATE_ROUTE_COURIER,
    (routeId, courier) => ({
      routeId,
      courier
    })
  ),
  toggleRouteSelection: createAction(
    types.TOGGLE_ROUTE_SELECTION,
    (routeId, isSelected) => ({ routeId,
      isSelected })
  ),
  toggleRouteVisibility: createAction(
    types.TOGGLE_ROUTE_VISIBILITY,
    (routeId, isVisible) => ({ routeId,
      isVisible })
  ),
  loadIncidences: {
    begin: createAction(types.LOAD_INCIDENCES_BEGIN),
    success: createAction(
      types.LOAD_INCIDENCES_SUCCESS,
      routes => ({ routes })
    ),
    failure: createAction(types.LOAD_INCIDENCES_FAILURE),
    end: createAction(types.LOAD_INCIDENCES_END)
  },
  loadRoute: {
    begin: createAction(
      types.LOAD_ROUTE_BEGIN,
      routeId => ({ routeId })
    ),
    success: createAction(
      types.LOAD_ROUTE_SUCCESS,
      (routeId, route) => ({ routeId,
        route })
    ),
    failure: createAction(
      types.LOAD_ROUTE_FAILURE,
      routeId => ({ routeId })
    ),
    end: createAction(
      types.LOAD_ROUTE_END,
      routeId => ({ routeId })
    )
  },
  toggleRoutesSelection: createAction(types.TOGGLE_ROUTES_SELECTION),
  toggleRoutesVisibility: createAction(types.TOGGLE_ROUTES_VISIBILITY),
  changeRouteColor: createAction(
    types.CHANGE_ROUTE_COLOR,
    (routeId, color) => ({ routeId,
      color })
  ),
  selectRoute: createAction(
    types.SELECT_ROUTE,
    (routeId) => ({ routeId })
  ),
  loadRouteInfo: {
    begin: createAction(
      types.LOAD_ROUTE_INFO_BEGIN,
      routeId => ({ routeId })
    ),
    success: createAction(
      types.LOAD_ROUTE_INFO_SUCCESS,
      (routeId, route) => ({ routeId,
        route })
    ),
    failure: createAction(
      types.LOAD_ROUTE_INFO_FAILURE,
      routeId => ({ routeId })
    ),
    end: createAction(
      types.LOAD_ROUTE_INFO_END,
      routeId => ({ routeId })
    )
  },
  updateRouteSteps: createAction(
    types.UPDATE_ROUTE_STEPS,
    (routeId, steps) => ({ routeId,
      steps })
  ),
  selectStep: createAction(
    types.SELECT_STEP,
    (routeId, deliveryId, activityType, color) => ({
      routeId,
      deliveryId,
      activityType,
      color
    })
  ),
  filterStep: createAction(
    types.FILTER_STEP,
    (delivery) => ({ delivery })
  ),
  selectRouteToReorder: createAction(
    types.SELECT_ROUTE_TO_REORDER,
    (routeId) => ({ routeId })
  ),
  selectRouteToSwap: createAction(
    types.SELECT_ROUTE_TO_SWAP,
    (route) => ({ route })
  ),
  selectPointsType: createAction(
    types.SELECT_POINTS_TYPE,
    (selectedPointsType) => ({ selectedPointsType })
  )
};
