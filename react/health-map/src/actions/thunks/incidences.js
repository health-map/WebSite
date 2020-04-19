
import { actions } from '../incidences';
import { 
  loadIncidences, 
  loadPointsIncidences 
} from '../../services/remoteAPI';

export const thunks = {
  loadIncidences(filters) {
    return async (dispatch, getState) => {
      if (getState().getIn(['general', 'viewType']) === 'geozone') {
        dispatch(actions.loadIncidences.begin());
        try {
          let incidences = await loadIncidences(filters, {
            apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
            apiToken: getState().getIn(['general', 'user', 'apiToken'])
          });
          dispatch(actions.loadIncidences.success(incidences));
        } catch (err) {
          console.log(err);
          dispatch(actions.loadIncidences.failure());
        }
        dispatch(actions.loadIncidences.end());
      } else { // point
        dispatch(actions.loadPointsIncidences.begin());
        try {
          let incidences = await loadPointsIncidences(filters, {
            apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
            apiToken: getState().getIn(['general', 'user', 'apiToken'])
          });
          dispatch(actions.loadPointsIncidences.success(incidences));
        } catch (err) {
          console.log(err);
          dispatch(actions.loadPointsIncidences.failure());
        }
        dispatch(actions.loadPointsIncidences.end());
      }
    };
  } 
};
