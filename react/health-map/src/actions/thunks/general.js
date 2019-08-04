
import { actions } from './../general';
import { loadIncidences } from './../../services/remoteAPI';

export const thunks = {
  loadIncidences() {
    return async (dispatch, getState) => {
      dispatch(actions.loadIncidences.begin());
      try {
        let incidences = await loadIncidences({
          apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
          apiToken: getState().getIn(['general', 'user', 'apiToken'])
        });
        dispatch(actions.loadIncidences.success(incidences));
      } catch (err) {
        dispatch(actions.loadIncidences.failure());
      }
      dispatch(actions.loadIncidences.end());
    };
  }
};
