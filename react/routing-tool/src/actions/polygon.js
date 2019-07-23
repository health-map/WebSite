
import { createAction } from 'redux-actions';

/**
 *
 */
export const types = {
  SET_STEPS: 'POLYGON/SET_STEPS',
  SELECT_GROUP_TYPE: 'POLYGON/SELECT_GROUP_TYPE',
  CREATE_OR_UPDATE_POLYGON: 'POLYGON/CREATE_OR_UPDATE_POLYGON',
  DELETE_POLYGON: 'POLYGON/DELETE_POLYGON',
  CLEAR_POLYGONS: 'POLYGON/CLEAR_POLYGONS',
  CHANGE_COLOR: 'POLYGON/CHANGE_COLOR',
  REMOVE_DELIVERY_FROM_POLYGON: 'POLYGON/REMOVE_DELIVERY_FROM_POLYGON',
  SELECT_DELIVERY_TYPE: 'POLYGON/SELECT_DELIVERY_TYPE',
  TOGGLE_REMAINING_SINGLE_DELIVERIES_VISIBILITY: 'POLYGON/TOGGLE_REMAINING_SINGLE_DELIVERIES_VISIBILITY'
};

/**
 *
 */
export const actions = {
  selectDeliveryTypes: createAction(
    types.SELECT_DELIVERY_TYPE,
    (deliveryTypes) => ({ deliveryTypes })
  ),
  removeDeliveryFromPolygon: createAction(
    types.REMOVE_DELIVERY_FROM_POLYGON,
    (polygonId, deliveryId) => ({ polygonId,
      deliveryId })
  ),
  changeColor: createAction(
    types.CHANGE_COLOR,
    (polygonId, color) => ({ polygonId,
      color })
  ),
  clearPolygons: createAction(
    types.CLEAR_POLYGONS
  ),
  deletePolygon: createAction(
    types.DELETE_POLYGON,
    (polygonId, filteredStep) => ({ 
      polygonId,
      filteredStep
    })
  ),
  createOrUpdatePolygon: createAction(
    types.CREATE_OR_UPDATE_POLYGON,
    (id, coordinates, filteredStep) => ({ id,
      coordinates,
      filteredStep })
  ),
  setSteps: createAction(
    types.SET_STEPS,
    (steps) => ({ steps })
  ),
  selectGroupType: createAction(
    types.SELECT_GROUP_TYPE,
    (groupType) => ({ groupType })
  ),
  toggleRemainingSingleDeliveriesVisibility: createAction(
    types.TOGGLE_REMAINING_SINGLE_DELIVERIES_VISIBILITY
  )
};
