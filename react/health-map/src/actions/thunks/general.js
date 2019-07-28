
import { actions } from './../general';
import { loadIncidences } from './../../services/remoteAPI';

export const thunks = {
  loadIncidences() {
    return async (dispatch, getState) => {
      dispatch(actions.loadIncidences.begin());
      try {
        let routes = await loadIncidences({
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
