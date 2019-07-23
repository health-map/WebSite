
import { actions } from './../routes';
import { getRoute } from './../../routing';
import { loadRoutes, loadRouteInfo } from './../../services/remoteAPI';

export const thunks = {
  loadRoutes(filters) {
    return async (dispatch, getState) => {
      dispatch(actions.loadRoutes.begin());
      try {
        let routes = await loadRoutes(filters, {
          apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
          apiToken: getState().getIn(['general', 'user', 'apiToken'])
        });
        dispatch(actions.loadRoutes.success(routes));
      } catch (err) {
        dispatch(actions.loadRoutes.failure());
      }
      dispatch(actions.loadRoutes.end());
    };
  },
  loadRoute(routeId, points) {
    return (dispatch) => {
      dispatch(actions.loadRoute.begin(routeId));
      try {
        getRoute(points)
          .then(route => {
            dispatch(actions.loadRoute.success(routeId, route));
          });
      } catch (err) {
        dispatch(actions.loadRoute.failure(routeId));
      }
      dispatch(actions.loadRoute.end(routeId));
    };
  },
  loadRouteInfo(routeId) {
    return async (dispatch, getState) => {
      dispatch(actions.loadRouteInfo.begin(routeId));
      try {
        let route = await loadRouteInfo(routeId, {
          apiUrl: getState().getIn(['general', 'user', 'apiUrl']),
          apiToken: getState().getIn(['general', 'user', 'apiToken'])
        });
        dispatch(actions.loadRouteInfo.success(routeId, route));
      } catch (err) {
        dispatch(actions.loadRouteInfo.failure(routeId));
      }
      dispatch(actions.loadRouteInfo.end(routeId));
    };
  },
  loadDeliveryPath(deliveryId, points) {
    return (dispatch) => {
      dispatch(actions.loadDeliveryPath.begin(deliveryId));
      try {
        getRoute(points).then(path => {
          dispatch(actions.loadDeliveryPath.success(deliveryId, path));
        });
      } catch (err) {
        dispatch(actions.loadDeliveryPath.failure(deliveryId));
      }
      dispatch(actions.loadDeliveryPath.end(deliveryId));
    };
  }
};
