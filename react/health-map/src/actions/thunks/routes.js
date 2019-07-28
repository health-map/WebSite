
import { actions } from './../incidences';
import { loadIncidences } from './../../services/remoteAPI';

export const thunks = {
  loadIncidences(filters) {
    return async (dispatch, getState) => {
      dispatch(actions.loadIncidences.begin());
      try {
        let routes = await loadIncidences(filters, {
          apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
          apiToken: getState().getIn(['general', 'user', 'apiToken'])
        });
        dispatch(actions.loadIncidences.success(routes));
      } catch (err) {
        dispatch(actions.loadIncidences.failure());
      }
      dispatch(actions.loadIncidences.end());
    };
  }
};
