
import Immutable from 'immutable';

import { types } from '../actions/incidences';

const initialState = Immutable.Map({
  data: [],
  isLoadingIncidences: false,
  loadIncidencesError: '',
  selectedGeozone: undefined,
  filters: {
    institution: 1,
    gender: undefined,
    startDate: '01-01-2018',
    endDate: '01-01-2019',
    season: undefined,
    city: 1,
    disease: undefined,
    geogroup: undefined,
    age: undefined,
    type: 'absolute',
    department: undefined
  }
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
  let incidences = action.payload.incidences;
  for (let i=0; i<incidences.length; i++) {
    incidences[i].isVisible = false;
    incidences[i].isSelected = false;
  }
  console.log('seteando incidencias sucess');
  return state
    .set('loadIncidencesError', '')
    .set('data', incidences);
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
  const index = state.get('data').findIndex((incidence) => {
    return incidence.id === incidenceId;
  });
  if (index >= 0) {
    let incidences = state.get('data');
    incidences[index].isVisible = isVisible;  
    return state.set('data', incidences);
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
    return incidence.id === incidenceId;
  });
  if (index >= 0) {
    let incidences = state.get('data');
    incidences[index].color = color;  
    return state.set('data', incidences);
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
  const actualFilters = state.get('filters');
  const newFilters = Object.assign({}, actualFilters, { [key]: value });
  return state.set(
    'filters', 
    newFilters
  );
};


/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export default function general(state = initialState, action) {
  switch (action.type) {
  case types.MUTATE_FILTERS:
    return mutateFilters(state, action);
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
  default:
    return state;
  }
}
