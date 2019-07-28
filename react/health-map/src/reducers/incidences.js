
import Immutable from 'immutable';

import { types } from '../actions/incidences';

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
  isLoadingIncidences: false,
  loadIncidencesError: '',
  selectedGeozone: undefined
});

/**
 *
 */
const loadIncidencesBegin = (state) => {
  return state.set('isLoadingIncidences', true);
};

/**
 *
 */
const loadIncidencesSuccess = (state, action) => {
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
    .set('loadIncidencesError', '')
    .set('data', routes);
};

/**
 *
 */
const loadIncidencesFailure = (state) => {
  return state.set(
    'loadIncidencesError',
    'Could not load the routes. Please try again'
  );
};

/**
 *
 */
const loadIncidencesEnd = (state) => {
  return state.set('isLoadingIncidences', false);
};


/**
 *
 */
const toggleIncidenceVisibility = (state, action) => {
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
    ));
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
const selectGeozone = (state, action) => {
  const { routeId, deliveryId, activityType, color } = action.payload;
  if (routeId && deliveryId && activityType) {
    return state.set('selectedGeozone', {
      routeId,
      deliveryId,
      activityType,
      color
    });
  }
  return state.set('selectedGeozone', undefined);
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.LOAD_INCIDENCES_BEGIN:
    return loadIncidencesBegin(state);
  case types.LOAD_INCIDENCES_SUCCESS:
    return loadIncidencesSuccess(state, action);
  case types.LOAD_INCIDENCES_FAILURE:
    return loadIncidencesFailure(state);
  case types.LOAD_INCIDENCES_END:
    return loadIncidencesEnd(state);
  case types.TOGGLE_INCIDENCE_VISIBILITY:
    return toggleIncidenceVisibility(state, action);
  case types.CHANGE_ROUTE_COLOR:
    return changeRouteColor(state, action);
  case types.SELECT_GEOZONE:
    return selectGeozone(state, action);
  default:
    return state;
  }
}
