
import Immutable from 'immutable';

import { types } from '../actions/incidences';

const initialState = Immutable.Map({
  data: Immutable.List(),
  isLoadingIncidences: false,
  loadIncidencesError: '',
  selectedGeozone: undefined,
  filters: Immutable.Map({
    institution: Inmmutable.map({
      id: 1,
      value: 'Hospital Leon Becerra' 
    }),
    gender: undefined,
    startDate: '01-01-2018',
    endDate: '01-01-2019',
    season: undefined,
    city: Inmmutable.map({
      id: 1,
      value: 'Guayaquil' 
    }),
    disease: undefined,
    geogroup: undefined,
    age: undefined,
    type: 'absolute',
    department: undefined
  })
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
  let incidences = Immutable.fromJS(action.payload.incidences);
  for (let i=0; i<incidences.size; i++) {
    const incidence = incidences.get(i)
      .set('isSelected', false)
      .set('isVisible', false);
    incidences = incidences.set(i, incidence);
  }
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
    return incidence.get('id') === incidenceId;
  });
  if (index >= 0) {
    const incidences = state.get('data');
    const incidence = incidences.get(index);
    return state.set('data', incidences.set(
      index,
      incidence.set('isVisible', isVisible)
    ));
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
  let filters = state.get('filters');
  mutatedKeys.map((key) => {
    filters.set(
      key,
      mutations[key]
    );
  });
  return state.set(
    'filters', 
    filters
  );
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
