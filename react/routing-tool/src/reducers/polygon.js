
import Immutable from 'immutable';
import * as turfHelpers from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import { areCommonPoints } from './../services/utils';
import { types } from './../actions/polygon';

const availableColors = [
  '#00BCD4',
  '#03A9F4',
  '#3F51B5',
  '#8BC34A',
  '#9C27B0',
  '#259B24',
  '#607D8B',
  '#673AB7',
  '#5677FC',
  '#009688',
  '#795548',
  '#CDDC39',
  '#E91E63',
  '#E62A10',
  '#FF5722',
  '#FF9800',
  '#FFC107',
  '#FFEB3B'
];


const groupTypes = {
  PICKUP: 'pickup',
  DROPOFF: 'dropoff'
};

const initialState = Immutable.Map({
  steps: Immutable.List(),
  polygons: Immutable.OrderedMap(),
  groupType: groupTypes.DROPOFF,
  originalColor: '',
  selectedDeliveryTypes: [],
  areRemainingDeliveriesVisible: false
});


/**
 *
 */
const setSteps = (state, action) => {
  const steps = action.payload.steps;
  state = state.set('steps', Immutable.fromJS(action.payload.steps));
  if (steps && steps.length > 0) {
    state = state.set('originalColor', action.payload.steps[0].color);
  }
  return state.set('selectedDeliveryTypes', []);
};

/**
 *
 */
const selectGroupType = (state, action) => {
  state = state.set('groupType', action.payload.groupType)
    .set('polygons', Immutable.OrderedMap());
  for (let i=0; i<state.get('steps').size; i++) {
    state = state
      .deleteIn(['steps', i, 'polygonId'])
      .setIn(['steps', i, 'color'], state.get('originalColor'));
  }
  return state;
};

/**
 *
 */
const createOrUpdatePolygon = (state, action) => {
  const id = action.payload.id;
  const coordinates = action.payload.coordinates;
  const filteredStep = action.payload.filteredStep;
  let filteredStepActivityType = undefined;
  let commonPointsIds = [];
  if (filteredStep) {
    filteredStepActivityType = (filteredStep.get('activityType') === 'P') ?
      'pickup' : 'dropoff';
    state.get('steps')
      .map(s => {
        if (
          areCommonPoints(
            {
              latitude: filteredStep.getIn([filteredStepActivityType, 'location', 'latitude']),
              longitude: filteredStep.getIn([filteredStepActivityType, 'location', 'longitude']),
              type: filteredStepActivityType
            },
            {
              longitude: s.getIn([s.get('activityType'), 'location', 'longitude']),
              latitude: s.getIn([s.get('activityType'), 'location', 'latitude']),
              type: s.getIn(['activityType'])    
            })
        ) {
          commonPointsIds.push(s.get('id'));
        }
      });
  }
  if (state.hasIn(['polygons', id])) {
    state = state.setIn(
      ['polygons', id, 'coordinates'],
      Immutable.List(coordinates)
    );
  } else {
    const randomColor = availableColors[
      Math.floor(Math.random() * (availableColors.length - 1))
    ];
    state = state.setIn(
      ['polygons', id],
      Immutable.fromJS({
        color: randomColor,
        coordinates
      })
    );
  }
  for (let i=0; i<state.get('steps').size; i++) {
    state = state
      .deleteIn(['steps', i, 'polygonId'])
      .setIn(['steps', i, 'color'], state.get('originalColor'));
    if (
      (state.get('groupType') === state.getIn(['steps', i, 'activityType'])) &&
      (
        (state.get('selectedDeliveryTypes').length > 0) ?
          (state.get('selectedDeliveryTypes').filter(dt => dt.id === state.getIn(['steps', i, 'deliveryType'])).length > 0) :
          true
      ) && 
      (
        (filteredStep) ? 
          commonPointsIds.includes(state.getIn(['steps', i, 'id'])) :
          true
      )
    ) {
      const pt = turfHelpers.point([
        state.getIn(['steps', i, state.get('groupType'), 'location', 'longitude']),
        state.getIn(['steps', i, state.get('groupType'), 'location', 'latitude'])
      ]);
      state.get('polygons').reverse().map((polygon, idx) => {
        const poly = turfHelpers.polygon([
          polygon.get('coordinates').toJSON()
        ]);
        if (booleanPointInPolygon(pt, poly)) {
          state = state
            .setIn(
              ['steps', i, 'color'],
              polygon.get('color')
            )
            .setIn(
              ['steps', i, 'polygonId'],
              idx
            );
        }
      });
    }
  }
  return state;
};

/**
 *
 */
const deletePolygon = (state, action) => {
  const polygonId = action.payload.polygonId;
  const filteredStep = action.payload.filteredStep;
  let filteredStepActivityType = undefined;
  let commonPointsIds = [];
  if (filteredStep) {
    filteredStepActivityType = (filteredStep.get('activityType') === 'P') ?
      'pickup' : 'dropoff';
    state.get('steps')
      .map(s => {
        if (
          areCommonPoints(
            {
              latitude: filteredStep.getIn([filteredStepActivityType, 'location', 'latitude']),
              longitude: filteredStep.getIn([filteredStepActivityType, 'location', 'longitude']),
              type: filteredStepActivityType
            },
            {
              longitude: s.getIn([s.get('activityType'), 'location', 'longitude']),
              latitude: s.getIn([s.get('activityType'), 'location', 'latitude']),
              type: s.getIn(['activityType'])    
            })
        ) {
          commonPointsIds.push(s.get('id'));
        }
      });
  }
  state = state.deleteIn(['polygons', polygonId]);
  for (let i=0; i<state.get('steps').size; i++) {
    state = state
      .deleteIn(['steps', i, 'polygonId'])
      .setIn(['steps', i, 'color'], state.get('originalColor'));
    if (
      (state.get('groupType') === state.getIn(['steps', i, 'activityType'])) &&
      (
        (state.get('selectedDeliveryTypes').length > 0) ?
          (state.get('selectedDeliveryTypes').filter(dt => dt.id === state.getIn(['steps', i, 'deliveryType'])).length > 0) :
          true
      ) && 
      (
        (filteredStep) ? 
          commonPointsIds.includes(state.getIn(['steps', i, 'id'])) :
          true
      )
    ) {
      const pt = turfHelpers.point([
        state.getIn(['steps', i, state.get('groupType'), 'location', 'longitude']),
        state.getIn(['steps', i, state.get('groupType'), 'location', 'latitude'])
      ]);
      state.get('polygons').reverse().map((polygon, idx) => {
        const poly = turfHelpers.polygon([
          polygon.get('coordinates').toJSON()
        ]);
        if (booleanPointInPolygon(pt, poly)) {
          state = state
            .setIn(
              ['steps', i, 'color'],
              polygon.get('color')
            )
            .setIn(
              ['steps', i, 'polygonId'],
              idx
            );
        }
      });
    }
  }
  return state;
};

/**
 *
 */
const clearPolygons = (state) => {
  return state.set('polygons', Immutable.OrderedMap())
    .set('steps', Immutable.List())
    .set('groupType', groupTypes.DROPOFF);
};

/**
 *
 */
const changeColor = (state, action) => {
  const color = action.payload.color;
  const polygonId = action.payload.polygonId;
  state = state.setIn(
    ['polygons', polygonId, 'color'],
    color
  );
  for (let i=0; i<state.get('steps').size; i++) {
    if (state.getIn(['steps', i, 'polygonId'], '') === polygonId) {
      state = state.setIn(['steps', i, 'color'], color);
    }
  }
  return state;
};

/**
 *
 */
const removeDeliveryFromPolygon = (state, action) => {
  const polygonId = action.payload.polygonId;
  const deliveryId = action.payload.deliveryId;
  for (let i=0; i<state.get('steps').size; i++) {
    const step = state.getIn(['steps', i]);
    if (
      (step.get('id') === deliveryId) &&
      (step.get('polygonId') === polygonId)
    ) {
      state = state.setIn(
        ['steps', i],
        step.delete('polygonId').set('color', state.get('originalColor'))
      );
    }
  }
  if (state.get('steps').filter(s => s.get('polygonId') === polygonId).size === 0) {
    state = state.deleteIn(['polygons', polygonId]);
  }
  return state;
};

/**
 *
 */
const selectDeliveryType = (state, action) => {
  const { deliveryTypes } = action.payload;
  state = state.set('selectedDeliveryTypes', deliveryTypes);
  for (let i=0; i<state.get('steps').size; i++) {
    state = state
      .deleteIn(['steps', i, 'polygonId'])
      .setIn(['steps', i, 'color'], state.get('originalColor'));
    if (
      (state.get('groupType') === state.getIn(['steps', i, 'activityType'])) &&
      (
        (deliveryTypes.length > 0) ?
          (deliveryTypes.filter(dt => dt.id === state.getIn(['steps', i, 'deliveryType'])).length > 0) :
          true
      )
    ) {
      const pt = turfHelpers.point([
        state.getIn(['steps', i, state.get('groupType'), 'location', 'longitude']),
        state.getIn(['steps', i, state.get('groupType'), 'location', 'latitude'])
      ]);
      state.get('polygons').reverse().map((polygon, idx) => {
        const poly = turfHelpers.polygon([
          polygon.get('coordinates').toJSON()
        ]);
        if (booleanPointInPolygon(pt, poly)) {
          state = state
            .setIn(
              ['steps', i, 'color'],
              polygon.get('color')
            )
            .setIn(
              ['steps', i, 'polygonId'],
              idx
            );
        }
      });
    }
  }
  return state;
};

/**
 *
 */
const toggleRemainingSingleDeliveriesVisibility = (state) => {
  return state.set(
    'areRemainingDeliveriesVisible',
    !state.get('areRemainingDeliveriesVisible')
  );
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.SET_STEPS:
    return setSteps(state, action);
  case types.SELECT_GROUP_TYPE:
    return selectGroupType(state, action);
  case types.CREATE_OR_UPDATE_POLYGON:
    return createOrUpdatePolygon(state, action);
  case types.DELETE_POLYGON:
    return deletePolygon(state, action);
  case types.CLEAR_POLYGONS:
    return clearPolygons(state);
  case types.CHANGE_COLOR:
    return changeColor(state, action);
  case types.REMOVE_DELIVERY_FROM_POLYGON:
    return removeDeliveryFromPolygon(state, action);
  case types.SELECT_DELIVERY_TYPE:
    return selectDeliveryType(state, action);
  case types.TOGGLE_REMAINING_SINGLE_DELIVERIES_VISIBILITY:
    return toggleRemainingSingleDeliveriesVisibility(state);
  default:
    return state;
  }
}
