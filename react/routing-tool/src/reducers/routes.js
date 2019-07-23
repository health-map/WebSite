
import Immutable from 'immutable';

import { types } from './../actions/routes';

const availableColors = [
  // '#00BCD4',
  // '#03A9F4',
  '#3F51B5',
  '#8BC34A',
  '#9C27B0',
  '#259B24',
  // '#607D8B',
  '#673AB7',
  '#5677FC',
  '#009688',
  '#795548',
  // '#E62A10',	
  // '#E91E63',
  // '#CDDC39',
  '#FF5722',
  '#FF9800',
  '#FFC107'
  // '#FFEB3B'
];

const initialState = Immutable.Map({
  data: Immutable.List(),
  isLoadingRoutes: false,
  loadRoutesError: '',
  selectedRouteId: undefined,
  selectedStep: undefined,
  filteredStep: undefined,
  isBreakingRoutes: false,
  breakRoutesError: '',
  selectedRouteToReorder: undefined,
  selectedRouteToSwap: undefined,
  reorderError: '',
  selectedRouteIdToAddDeliveries: undefined,
  selectedRouteIdToDivide: undefined,
  currentPath: undefined,
  selectedPointsType: 'All'
});

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
  let routes = Immutable.fromJS(action.payload.routes);
  if (
    (routes.getIn([0, 'id']) === 'Single') &&
    (routes.getIn([0, 'schedule']).size === 0)
  ) {
    routes = routes.delete(0);
  }
  for (let i=0; i<routes.size; i++) {
    const randomColor = availableColors[
      Math.floor(Math.random() * (availableColors.length - 1))
    ];
    const route = routes.get(i)
      .set('color', randomColor)
      .set('isSelected', false)
      .set('isVisible', false);
    routes = routes.set(i, route);
  }
  return state
    .set('loadRoutesError', '')
    .set('data', routes);
};

/**
 *
 */
const loadRoutesFailure = (state) => {
  return state.set(
    'loadRoutesError',
    'Could not load the routes. Please try again'
  );
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
const toggleRouteSelection = (state, action) => {
  const routeId = action.payload.routeId;
  const isSelected = action.payload.isSelected;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    return state.set('data', routes.set(
      index,
      route.set('isSelected', isSelected)
    ));
  }
  return state;
};

/**
 *
 */
const toggleRouteVisibility = (state, action) => {
  const routeId = action.payload.routeId;
  const isVisible = action.payload.isVisible;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    return state.set('data', routes.set(
      index,
      route.set('isVisible', isVisible)
    )).set('currentPath', undefined);
  }
  return state;
};

/**
 *
 */
const loadRouteBegin = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('isLoading', true)
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set('isLoading', true)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('isLoading', true)
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteSuccess = (state, action) => {
  const routeId = action.payload.routeId;
  const routePayload = action.payload.route;
  const index = state.get('data').findIndex((r) => {
    return r.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('loadRouteError', '')
            .set('points', Immutable.List(routePayload.points))
            .set('bounds', routePayload.bounds)
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder')
            .set('loadRouteError', '')
            .set('points', Immutable.List(routePayload.points))
            .set('bounds', routePayload.bounds)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('loadRouteError', '')
        .set('points', Immutable.List(routePayload.points))
        .set('bounds', routePayload.bounds)
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteFailure = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('loadRouteError', 'Could not load the route')
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set(
            'loadRouteError',
            'Could not load the route'
          )
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('loadRouteError', 'Could not load the route')
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteEnd = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state.set('data', routes.set(
        index,
        route.set('isLoading', false)
      ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set('isLoading', false)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('isLoading', false)
    ));
  }
  return state;
};

/**
 *
 */
const toggleRoutesSelection = (state) => {
  let areAllRoutesSelected = true;
  state.get('data').map((route) => {
    if (route.get('id') !== 'Single') {
      if (!route.get('isSelected')) {
        areAllRoutesSelected = false;
      }
    }
  });
  for (let i=0; i<state.get('data').size; i++) {
    if (state.getIn(['data', i, 'id']) !== 'Single') {
      state = state.setIn(
        ['data', i],
        state.getIn(['data', i]).set('isSelected', !areAllRoutesSelected)
      );
    }
  }
  return state;
};

/**
 *
 */
const toggleRoutesVisibility = (state) => {
  let areAllRoutesVisible = true;
  state.get('data').map((route) => {
    if (!route.get('isVisible')) {
      areAllRoutesVisible = false;
    }
  });
  for (let i=0; i<state.get('data').size; i++) {
    state = state.setIn(
      ['data', i],
      state.getIn(['data', i]).set('isVisible', !areAllRoutesVisible)
    );
  }
  return state;
};

/**
 *
 */
const changeRouteColor = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    return state.set('data', routes.set(
      index,
      route.set('color', action.payload.color)
    ));
  }
  return state;
};

/**
 *
 */
const selectRoute = (state, action) => {
  if (!action.payload.routeId) {
    return state.set('selectedRouteId', undefined)
      .set('selectedRouteToReorder', undefined)
      .set('selectedStep', undefined);
  }
  return state.set('selectedRouteId', action.payload.routeId)
    .set('selectedStep', undefined)
    .setIn(
      ['data', 0, 'isVisible'],
      false
    );
};

/**
 *
 */
const loadRouteInfoBegin = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('isLoadingInfo', true)
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set('isLoadingInfo', true)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('isLoadingInfo', true)
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteInfoSuccess = (state, action) => {
  for (let i=0; i<state.get('data').size; i++) {
    state = state.setIn(
      ['data', i],
      state.getIn(['data', i]).set('isVisible', false)
    );
  }
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('isVisible', true)
            .set('loadRouteInfoError', '')
            .merge(Immutable.fromJS(action.payload.route))
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder')
            .set('isVisible', true)
            .set('loadRouteInfoError', '')
            .merge(Immutable.fromJS(action.payload.route))
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('isVisible', true)
        .set('loadRouteInfoError', '')
        .merge(Immutable.fromJS(action.payload.route))
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteInfoFailure = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('loadRouteInfoError', 'Could not load the route information')
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder')
            .set('loadRouteInfoError', 'Could not load the route information')
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('loadRouteInfoError', 'Could not load the route information')
    ));
  }
  return state;
};

/**
 *
 */
const loadRouteInfoEnd = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('isLoadingInfo', false)
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set('isLoadingInfo', false)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('isLoadingInfo', false)
    ));
  }
  return state;
};

/**
 *
 */
const updateRouteSteps = (state, action) => {
  const routeId = action.payload.routeId;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    const steps = action.payload.steps.reduce(
      (computedSteps, currentStep, idx) => {
        const reducedStep = currentStep.reduce((reducedList, fullStep) => {
          return reducedList.push(new Immutable.fromJS({
            index: idx,
            id: fullStep.get('id'),
            activityType: fullStep.get('activityType'),
            deliveryId: fullStep.get('deliveryId'),
            location: {
              latitude: fullStep.getIn(['location', 'latitude']),
              longitude: fullStep.getIn(['location', 'longitude']),
              address: fullStep.getIn(['location', 'address'])
            }
          }));
        }, Immutable.List());
        return computedSteps.push(reducedStep);
      },
      Immutable.List()
    );
    if (state.get('selectedRouteToReorder')) {
      return state
        .set('data', routes.set(
          index,
          route.set('steps', steps)
        ))
        .set(
          'selectedRouteToReorder',
          state.get('selectedRouteToReorder').set('steps', steps)
        );
    }
    return state.set('data', routes.set(
      index,
      route.set('steps', steps)
    ));
  }
  return state;
};

/**
 *
 */
const selectStep = (state, action) => {
  const { routeId, deliveryId, activityType, color } = action.payload;
  if (routeId && deliveryId && activityType) {
    return state.set('selectedStep', {
      routeId,
      deliveryId,
      activityType,
      color
    });
  }
  return state.set('selectedStep', undefined);
};

const filterStep = (state, action) => {
  if (action.payload.delivery) {
    return state.set('filteredStep', action.payload.delivery)
      .set('selectedPointsType', 'All');
  }
  return state.set('filteredStep', undefined);
};

/**
 *
 */
const updateRouteCourier = (state, action) => {
  const routeId = action.payload.routeId;
  const courier = action.payload.courier;
  const index = state.get('data').findIndex((route) => {
    return route.get('id') === routeId;
  });
  if (index >= 0) {
    const routes = state.get('data');
    const route = routes.get(index);
    return state.set('data', routes.set(
      index,
      route.set('courier', Immutable.fromJS(courier))
    ));
  }
  return state;
};

/**
 *
 */
const selectRouteToReorder = (state, action) => {
  const routeId = action.payload.routeId;
  const route = state.get('data').find(r => r.get('id') === routeId);
  return state.set('selectedRouteToReorder', route)
    .set('selectedRouteId', routeId);
};

/**
 *
 */
const selectRouteToSwap = (state, action) => {
  return state.set('selectedRouteToSwap', action.payload.route);
};

/**
 *
 */
const selectPointsType = (state, action) => {
  return state.set('selectedPointsType', action.payload.selectedPointsType);
};

/**
 *
 */
const changeStepOrder = (state, action) => {
  const newIndex = action.payload.newIndex;
  const oldIndex = action.payload.oldIndex;
  if (
    (newIndex < 0) ||
    (newIndex > (state.getIn(['selectedRouteToReorder', 'steps']).size-1))
  ) {
    return state.set('reorderError', 'The selected position is not valid');
  }
  const steps = state.getIn(['selectedRouteToReorder', 'steps']);
  if (action.payload.activityType === 'pickup') {
    for (let i=0; i<steps.size; i++) {
      for (let j=0; j<steps.get(i).size; j++) {
        const deliveryId = steps.getIn([i, j, 'deliveryId']);
        if (
          action.payload.deliveryIds.includes(deliveryId) &&
          (steps.getIn([i, j, 'activityType']) === 'dropoff')
        ) {
          if (newIndex >= steps.getIn([i, j, 'index'])) {
            return state.set(
              'reorderError',
              'The pickup step (*PICKUP*) can not be after the dropoff step (*DROPOFF*)'
                .replace('*PICKUP*', (oldIndex + 1))
                .replace('*DROPOFF*', (steps.getIn([i, j, 'index']) + 1))
            );
          }
        }
      }
    }
  }
  if (action.payload.activityType === 'dropoff') {
    for (let i=0; i<steps.size; i++) {
      for (let j=0; j<steps.get(i).size; j++) {
        const deliveryId = steps.getIn([i, j, 'deliveryId']);
        if (
          action.payload.deliveryIds.includes(deliveryId) &&
          (steps.getIn([i, j, 'activityType']) === 'pickup')
        ) {
          if (newIndex <= steps.getIn([i, j, 'index'])) {
            return state.set(
              'reorderError',
              'The dropoff step (*DROPOFF*) can not be before the pickup step (*PICKUP*)'
                .replace('*DROPOFF*', (oldIndex + 1))
                .replace('*PICKUP*', (steps.getIn([i, j, 'index']) + 1))
            );
          }
        }
      }
    }
  }
  state = state.setIn(
    ['selectedRouteToReorder', 'steps'],
    state.getIn(['selectedRouteToReorder', 'steps'])
      .delete(oldIndex)
      .splice(
        newIndex,
        0,
        state.getIn(['selectedRouteToReorder', 'steps', oldIndex])
      )
      .set('reorderError', '')
  );
  return state;
};

/**
 *
 */
const changeReorderError = (state, action) => {
  return state.set('reorderError', action.payload.error);
};

const selectRouteIdToDivide = (state, action) => {
  state = state.set('selectedRouteIdToDivide', action.payload.routeId);
  for (let i=0; i<state.get('data').size; i++) {
    if (
      (state.getIn(['data', i, 'id']) !== 'Single') &&
      (state.getIn(['data', i, 'id']) !== state.get('selectedRouteIdToDivide'))
    ) {
      state = state.setIn(
        ['data', i],
        state.getIn(['data', i])
          .set('isSelected', false)
          .set('isVisible', false)
      );
    }
    if ((state.getIn(['data', i, 'id']) === state.get('selectedRouteIdToDivide'))) {
      state = state.setIn(
        ['data', i],
        state.getIn(['data', i])
          .set('isSelected', false)
          .set('isVisible', true)
      );
    }
  }
  return state;
};

/**
 *
 */
const selectRouteIdToAddDeliveries = (state, action) => {
  state = state.set('selectedRouteIdToAddDeliveries', action.payload.routeId);
  for (let i=0; i<state.get('data').size; i++) {
    if (
      (state.getIn(['data', i, 'id']) !== 'Single') &&
      (state.getIn(['data', i, 'id']) !== state.get('selectedRouteIdToAddDeliveries'))
    ) {
      state = state.setIn(
        ['data', i],
        state.getIn(['data', i])
          .set('isSelected', false)
          .set('isVisible', false)
      );
    }
    if ((state.getIn(['data', i, 'id']) === state.get('selectedRouteIdToAddDeliveries'))) {
      state = state.setIn(
        ['data', i],
        state.getIn(['data', i])
          .set('isSelected', false)
          .set('isVisible', true)
      );
    }
  }
  return state;
};

/**
 *
 */
const loadDeliveryPathBegin = (state) => {
  return state;
};

/**
 *
 */
const loadDeliveryPathSuccess = (state, action) => {
  return state.set(
    'currentPath',
    action.payload.path.points
  );
};

/**
 *
 */
const loadDeliveryPathFailure = (state) => {
  return state.set(
    'currentPath',
    undefined
  );
};

/**
 *
 */
const loadDeliveryPathEnd = (state) => {
  return state;
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.LOAD_ROUTES_BEGIN:
    return loadRoutesBegin(state);
  case types.LOAD_ROUTES_SUCCESS:
    return loadRoutesSuccess(state, action);
  case types.LOAD_ROUTES_FAILURE:
    return loadRoutesFailure(state);
  case types.LOAD_ROUTES_END:
    return loadRoutesEnd(state);
  case types.TOGGLE_ROUTE_SELECTION:
    return toggleRouteSelection(state, action);
  case types.TOGGLE_ROUTE_VISIBILITY:
    return toggleRouteVisibility(state, action);
  case types.LOAD_ROUTE_BEGIN:
    return loadRouteBegin(state, action);
  case types.LOAD_ROUTE_SUCCESS:
    return loadRouteSuccess(state, action);
  case types.LOAD_ROUTE_FAILURE:
    return loadRouteFailure(state, action);
  case types.LOAD_ROUTE_END:
    return loadRouteEnd(state, action);
  case types.TOGGLE_ROUTES_SELECTION:
    return toggleRoutesSelection(state);
  case types.TOGGLE_ROUTES_VISIBILITY:
    return toggleRoutesVisibility(state);
  case types.CHANGE_ROUTE_COLOR:
    return changeRouteColor(state, action);
  case types.SELECT_ROUTE:
    return selectRoute(state, action);
  case types.LOAD_ROUTE_INFO_BEGIN:
    return loadRouteInfoBegin(state, action);
  case types.LOAD_ROUTE_INFO_SUCCESS:
    return loadRouteInfoSuccess(state, action);
  case types.LOAD_ROUTE_INFO_FAILURE:
    return loadRouteInfoFailure(state, action);
  case types.LOAD_ROUTE_INFO_END:
    return loadRouteInfoEnd(state, action);
  case types.UPDATE_ROUTE_STEPS:
    return updateRouteSteps(state, action);
  case types.SELECT_STEP:
    return selectStep(state, action);
  case types.FILTER_STEP:
    return filterStep(state, action);
  case types.UPDATE_ROUTE_COURIER:
    return updateRouteCourier(state, action);
  case types.SELECT_ROUTE_TO_REORDER:
    return selectRouteToReorder(state, action);
  case types.SELECT_ROUTE_TO_SWAP:
    return selectRouteToSwap(state, action);
  case types.CHANGE_STEP_ORDER:
    return changeStepOrder(state, action);
  case types.CHANGE_REORDER_ERROR:
    return changeReorderError(state, action);
  case types.SELECT_ROUTE_ID_TO_ADD_DELIVERIES:
    return selectRouteIdToAddDeliveries(state, action);
  case types.SELECT_ROUTE_ID_TO_DIVIDE:
    return selectRouteIdToDivide(state, action);
  case types.LOAD_DELIVERY_PATH_BEGIN:
    return loadDeliveryPathBegin(state);
  case types.LOAD_DELIVERY_PATH_SUCCESS:
    return loadDeliveryPathSuccess(state, action);
  case types.LOAD_DELIVERY_PATH_FAILURE:
    return loadDeliveryPathFailure(state);
  case types.LOAD_DELIVERY_PATH_END:
    return loadDeliveryPathEnd(state);
  case types.SELECT_POINTS_TYPE:
    return selectPointsType(state, action);
  default:
    return state;
  }
}
