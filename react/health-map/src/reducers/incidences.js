
import Immutable from 'immutable';

import { types } from '../actions/incidences';

const initialState = Immutable.Map({
  data: Immutable.Map({
    init: true,
    features: []
  }),
  isLoadingMap: false,
  isLoadingIncidences: false,
  mapBounds: Immutable.Map(),
  loadIncidencesError: '',
  selectedGeozone: undefined,
  filters: Immutable.Map({
    institution: Immutable.Map({
      id: 1,
      name: 'HOSPITAL LEON BECERRA' 
    }),
    gender: Immutable.Map({
      id: 3,
      name: 'TODOS'
    }),
    startDate: undefined,
    endDate: undefined,
    season: undefined,
    city: Immutable.Map({
      id: 1,
      name: 'GUAYAQUIL' 
    }),
    disease: undefined,
    geogroup: undefined,
    age: Immutable.Map({
      id: 1,
      name: 'TODOS'
    }),
    type: 'absolute',
    department: Immutable.Map({
      id: 1,
      name: 'GENERAL'
    }),
    division: Immutable.Map({
      id: 1,
      name: 'SECTORES URBANOS'
    })
  })
});

/**
 *
 */
const setMapBounds = (state, action) => {
  console.log(action.payload.bounds);
  if (action.payload.bounds) {
    return state.set('mapBounds', action.payload.bounds);
  }
  return state;
};

/**
 *
 */
const loadIncidencesBegin = (state) => {
  return state.set('isLoadingIncidences', true);
};

/**
 *
 */
const startLoadingMap = (state) => {
  return state.set('isLoadingMap', true);
};

/**
 *
 */
const finishLoadingMap = (state) => {
  return state.set('isLoadingMap', false);
};

/**
 *
 */
const loadIncidencesSuccess = (state, action) => {
  let incidencesGeojson = Immutable.fromJS(action.payload.incidences.geojson);
  return state
    .set('loadIncidencesError', '')
    .set('data', incidencesGeojson);
};

/**
 *
 */
const loadIncidencesFailure = (state) => {
  return state.set(
    'loadIncidencesError',
    'Ha ocurrido un error al cargas las incidencias.'
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
  const incidenceId = action.payload.incidenceId;
  const isVisible = action.payload.isVisible;
  const index = state.getIn(['data', 'features']).findIndex((incidence) => {
    return incidence.getIn(['properties', 'id']) === incidenceId;
  });
  if (index >= 0) {
    const incidences = state.get('data');
    const incidence = incidences.getIn(['features', index]);
    return state.set(
      'data', 
      incidences.setIn(
        ['features', index],
        incidence.setIn(
          ['properties', 'isVisible'], 
          isVisible
        )
      )
    );
  }
  return state;
};


/**
 *
 */
const changeIncidenceColor = (state, action) => {
  const incidenceId = action.payload.incidenceId;
  const color = action.payload.color;
  const index = state.get('data').findIndex((incidence) => {
    return incidence.get('id') === incidenceId;
  });
  if (index >= 0) {
    const incidences = state.get('data');
    const incidence = incidences.get(index);
    return state.set('data', incidences.set(
      index,
      incidence.set('color', color)
    ));
  }
  return state;
};

/**
 *
 */
const selectGeozone = (state, action) => {
  if (action) {
    return state.set('selectedGeozone', {});
  }
  return state.set('selectedGeozone', undefined);
};

/**
 *
 */
const mutateFilters = (state, action) => {
  const key = action.payload.filterKey;
  const value = action.payload.filterValue;
  const filters = state.get('filters');
  return state.set(
    'filters', 
    filters.set(key, value)
  );
};

/**
 *
 */
const mutateManyFilters = (state, action) => {
  const mutations = action.payload.mutations;
  const mutatedKeys = Object.keys(mutations);
  mutatedKeys.map((key) => {
    state = state.setIn(['filters', key], mutations[key]);
  });
  return state;
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.MUTATE_FILTERS:
    return mutateFilters(state, action);
  case types.MUTATE_MANY_FILTERS:
    return mutateManyFilters(state, action);
  case types.START_LOADING_MAP:
    return startLoadingMap(state, action);
  case types.FINISH_LOADING_MAP:
    return finishLoadingMap(state, action);
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
  case types.CHANGE_INCIDENCE_COLOR:
    return changeIncidenceColor(state, action);
  case types.SELECT_GEOZONE:
    return selectGeozone(state, action);
  case types.SET_MAP_BOUNDS:
    return setMapBounds(state, action);
  default:
    return state;
  }
}
