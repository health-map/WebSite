
import { createAction } from 'redux-actions';

/**
 *
 */
export default types = {
  LOAD_CITIES_BEGIN: 'FILTERS/LOAD_CITIES_BEGIN',
  LOAD_CITIES_SUCCESS: 'FILTERS/LOAD_CITIES_SUCCESS',
  LOAD_CITIES_FAILURE: 'FILTERS/LOAD_CITIES_FAILURE',
  LOAD_CITIES_END: 'FILTERS/LOAD_CITIES_END',
  LOAD_COMPANIES_BEGIN: 'FILTERS/LOAD_COMPANIES_BEGIN',
  LOAD_COMPANIES_SUCCESS: 'FILTERS/LOAD_COMPANIES_SUCCESS',
  LOAD_COMPANIES_FAILURE: 'FILTERS/LOAD_COMPANIES_FAILURE',
  LOAD_COMPANIES_END: 'FILTERS/LOAD_COMPANIES_END'
}

/**
 *
 */
export default actions = {
  loadCities: {
    begin: createAction(types.LOAD_CITIES_BEGIN),
    success: createAction(
      types.LOAD_CITIES_SUCCESS,
      cities => ({ cities })
    ),
    failure: createAction(types.LOAD_CITIES_FAILURE),
    end: createAction(types.LOAD_CITIES_END)
  },
  loadCompanies: {
    begin: createAction(types.LOAD_COMPANIES_BEGIN),
    success: createAction(
      types.LOAD_COMPANIES_SUCCESS,
      companies => ({ companies })
    ),
    failure: createAction(types.LOAD_COMPANIES_FAILURE),
    end: createAction(types.LOAD_COMPANIES_END)
  }
}
