
import { actions } from './../general';
import { loadCities } from './../../services/localAPI';
import { loadRoutes } from './../../services/remoteAPI';

export const thunks = {
  loadCities() {
    return async (dispatch, getState) => {
      dispatch(actions.loadCities.begin());
      try {
        let cities = await loadCities({
          accessToken: getState().getIn(['general', 'user', 'accessToken']),
          companyAccess: getState().getIn(['general', 'user', 'companyAccess'])
        });
        dispatch(actions.loadCities.success(cities));
      } catch (err) {
        dispatch(actions.loadCities.failure());
      }
      dispatch(actions.loadCities.end());
    };
  },
  loadRoutes() {
    return async (dispatch, getState) => {
      dispatch(actions.loadRoutes.begin());
      try {
        let routes = await loadRoutes({
          apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
          apiToken: getState().getIn(['general', 'user', 'apiToken'])
        });
        dispatch(actions.loadRoutes.success(routes));
      } catch (err) {
        dispatch(actions.loadRoutes.failure());
      }
      dispatch(actions.loadRoutes.end());
    };
  }
};
