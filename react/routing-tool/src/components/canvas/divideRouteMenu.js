/**
 * @file timer.js
 * @description Timer component
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Error from '../shared/error';
import Loading from '../shared/loading';
import Successful from '../shared/successful';
import PolygonRow from '../polygon/polygonRow';
import { actions } from '../../actions/routes';
import { actions as polygonActions } from '../../actions/polygon';
import { splitRoute } from '../../services/remoteAPI';

import './divideRouteMenu.css';


/**
 *
 */
class ConfirmDivideRoutes extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false
  }
  componentDidUpdate() {
    if (!this.state.loading && this.state.succeed) {
      setTimeout(() => this.props.onClose(), 2000);
    }
    if (!this.state.loading && this.state.failed) {
      setTimeout(() => this.setState({
        loading: false,
        succeed: false,
        failed: false
      }), 2000);
    }
  }
  splitRouteRequest = () => {
    const self = this;
    const {
      apiUrl, apiToken, userId, groups, onComplete, onCloseTool,
      selectedRouteId
    } = this.props;
    let routes = [];
    let deliveriesToRemove = [];
    groups.map((deliveries) => {
      routes.push({
        deliveries: deliveries.reduce((computedDeliveries, delivery) => {
          computedDeliveries.push(delivery.get('id'));
          deliveriesToRemove.push(delivery.get('id'));
          return computedDeliveries;
        }, [])
      });
    });
    
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      splitRoute({ 
        userId,
        deliveries: deliveriesToRemove,
        routeId: selectedRouteId,
        routes 
      }, { apiUrl,
        apiToken })
        .then((jobs) => {
          self.setState({
            loading: false,
            succeed: true,
            failed: false
          });
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
            onCloseTool();
          } else {
            setTimeout(() => onComplete(), 2000);
          }
        })
        .catch(() => {
          self.setState({
            loading: false,
            succeed: false,
            failed: true
          });
        });
    });
  }
  render() {
    const { groups, onClose } = this.props;
    return (
      <div className="shy-dialog" onClick={onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="icon-polygon"
                  src="https://cdn.shippify.co/icons/icon-new-polygon-white.svg"
                  alt=""/>
                { window.translation('Divide Route') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                onClick={onClose}
                alt=""/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              {
                this.state.loading &&
                <Loading mini/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful text={
                  (groups.size === 1) ?
                    window.translation('Route successfully created') :
                    window.translation('Routes successfully created')
                }/>
              }
              {
                !this.state.loading &&
                this.state.failed &&
                <Error text={
                  window.translation('Something went wrong. Please try again')
                }/>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                <div className="full-width">
                  <div className="shy-dialog-body-text-detail">
                    { window.translation('Do you really want to divide this route?') } 
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      onClick={onClose}
                      className="shy-btn shy-btn-default">
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      onClick={this.splitRouteRequest}
                      className="shy-btn shy-btn-primary">
                      { window.translation('YES, DIVIDE') }
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


/**
 *
 */
class DivideRouteMenu extends React.Component {
  state = {
    isConfirmationDialogVisible: false
  }
  componentDidMount() {
    const steps = this.props.selectedRoute.get('schedule')
      .reduce((computedDeliveries, delivery) => {
        const payload = {
          id: delivery.getIn(['data', 'id']),
          deliveryType: delivery.getIn(['data', 'deliveryType']),
          color: this.props.selectedRoute.get('color')
        };
        if (delivery.getIn(['data', 'activity']) === 'P') {
          
          payload.pickup = {
            location: {
              address: delivery.getIn(['data', 'location', 'address']),
              latitude: delivery.getIn(['data', 'location', 'geopoint', 'latitude']),
              longitude: delivery.getIn(['data', 'location', 'geopoint', 'longitude'])
            }
          };
          payload.activityType = 'pickup';
          for (let i=0; i<this.props.selectedRoute.get('schedule').size; i++) {
            const d = this.props.selectedRoute.getIn(['schedule', i]);
            if (
              (d.getIn(['data', 'id']) === payload.id) &&
              (d.getIn(['data', 'activity']) === 'D')
            ) {
              payload.dropoff = {
                location: {
                  address: d.getIn(['data', 'location', 'address']),
                  latitude: d.getIn(['data', 'location', 'geopoint', 'latitude']),
                  longitude: d.getIn(['data', 'location', 'geopoint', 'longitude'])
                }
              };
              break;
            }
          }
        }
        if (delivery.getIn(['data', 'activity']) === 'D') {
          payload.dropoff = {
            location: {
              address: delivery.getIn(['data', 'location', 'address']),
              latitude: delivery.getIn(['data', 'location', 'geopoint', 'latitude']),
              longitude: delivery.getIn(['data', 'location', 'geopoint', 'longitude'])
            }
          };
          payload.activityType = 'dropoff';
        }
        computedDeliveries.push(payload);
        return computedDeliveries;
      }, []);
    this.props.setSteps(steps);
  }
  toggleConfirmationDialog = () => {
    this.setState({
      isConfirmationDialogVisible: true
    });
  }
  render() {
    const {
      polygons, steps, apiUrl, apiToken, userId,
      selectRoute, selectedRouteId, clearPolygons,
      selectRouteIdToDivide, setListWidth
    } = this.props;
    let groups = Immutable.OrderedMap();
    polygons.map((polygon, polygonId) => {
      for (let i=0; i<steps.size; i++) {
        const list = groups.get(polygonId, Immutable.List());
        if (steps.getIn([i, 'polygonId']) === polygonId) {
          groups = groups.set(polygonId, list.push(steps.get(i)));
        }
      }
    });
    const polygonRows = [];
    groups.map((groupSteps, polygonId) => {
      polygonRows.push(
        <PolygonRow
          key={polygonId}
          steps={groupSteps}
          polygonId={polygonId}/>
      );
    });
    return (
      <div>
        <div
          className="polygon-opened">
          <div className="polygon-opened-header">
            <div> { `${window.translation('Divide')}  ${selectedRouteId}` }</div>
            <img
              src="https://cdn.shippify.co/icons/icon-close-gray.svg"
              alt=""
              onClick={() => {
                clearPolygons();
                setListWidth(504);
                selectRouteIdToDivide();
              }}/>
          </div>
          <div className="polygon-opened-body">
            <div className="group-type-container">
              {
                !groups.size &&
                <div>
                  <div className="shy-form-field-label">
                    { window.translation('Draw polygons to create a new route from the tasks on this route') }
                  </div>
                </div>
              }
              {
                !!groups.size &&
                <div>
                  <div className="shy-form-field-label shy-form-field-label-no-margin">
                    { window.translation('The following deliveries are going to be removed, and new routes are going to be created: ') }
                  </div>
                </div>
              }
            </div>     
            <div className="polygons">
              {
                polygonRows
              }
            </div>    
          </div>
          {
            !!groups.size &&
            <div className="polygon-opened-footer">
              <button
                className="shy-btn shy-btn-primary"
                onClick={() => {
                  this.toggleConfirmationDialog();
                }}>
                { window.translation('DIVIDE ROUTE') }
              </button>
            </div>
          }
        </div>
        {
          this.state.isConfirmationDialogVisible &&
            <ConfirmDivideRoutes
              userId={userId}
              apiUrl={apiUrl}
              apiToken={apiToken}
              selectedRouteId={selectedRouteId}
              onClose={() => {
                this.setState({
                  isConfirmationDialogVisible: false
                });
              }}
              onCloseTool={() => {
                clearPolygons();
                setListWidth(504);
                selectRouteIdToDivide();
                selectRoute();
              }}
              onComplete={() => {
                clearPolygons();
                setListWidth(504);
                selectRoute();
                this.props.loadRoutes({
                  from: this.props.from,
                  to: this.props.to,
                  tags: this.props.selectedTags,
                  cities: this.props.selectedCities,
                  companies: this.props.selectedCompanies,
                  deliveries: this.props.selectedDeliveries,
                  statuses: this.props.selectedStatuses
                });
              }}
              groups={groups}/>
        }
      </div>
    );
  }
}

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  setSteps: polygonActions.setSteps,
  loadRoutes: actions.loadRoutes,
  selectRoute: actions.selectRoute,
  selectRouteIdToDivide: actions.selectRouteIdToDivide,
  clearPolygons: polygonActions.clearPolygons
}, dispatch);

/**
 *
 */
const mapStateToProps = (state) => {
  return {
    polygons: state.getIn(['polygon', 'polygons']),
    steps: state.getIn(['polygon', 'steps']),
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken'])
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DivideRouteMenu);