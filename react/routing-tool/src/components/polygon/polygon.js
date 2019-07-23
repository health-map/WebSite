/**
 * @file polygon.js
 * @description Polygon Component
 *
 */

import React from 'react';
import Select from 'react-select';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Error from './../shared/error';
import Loading from './../shared/loading';
import Successful from './../shared/successful';
import PolygonRow from './polygonRow';
import { actions } from './../../actions/polygon';
import { actions as generalActions } from './../../actions/general';
import { areCommonPoints } from './../../services/utils';
import { createRoutes } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;

import './polygon.css';


/**
 *
 */
const ConfirmChangeGroupType = (props) => {
  return (
    <div className="shy-dialog" onClick={props.onClose}>
      <div className="shy-dialog-content-wrapper">
        <div
          className="shy-dialog-content"
          onClick={(e) => e.stopPropagation()}>
          <div className="shy-dialog-header">
            <div className="shy-dialog-header-content">
              <img
                className="icon-info"
                src="https://cdn.shippify.co/icons/icon-info-outline-white.svg"
                alt=""/>
              { window.translation('Change grouping type') }
            </div>
            <img
              className="shy-dialog-close"
              src="https://cdn.shippify.co/icons/icon-close-gray.svg"
              onClick={props.onClose}
              alt=""/>
          </div>
          <div className="shy-dialog-body shy-dialog-body-sm">
            <div className="shy-dialog-body-text-detail">
              { window.translation('If you change the group type, the polygons you just created will be lost. Are you sure that you want to continue?') }
            </div>
            <div className="shy-dialog-body-buttons">
              <button
                onClick={props.onClose}
                className="shy-btn shy-btn-default">
                { window.translation('CANCEL') }
              </button>
              <button
                onClick={() => {
                  props.selectGroupType(props.selectedGroupType);
                  props.onClose();
                }}
                className="shy-btn shy-btn-primary">
                { window.translation('YES, CHANGE') }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 *
 */
class ConfirmCreateRoutes extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    reconfirm: false,
    inconsistentTaks: undefined
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
  createRoutesRequest = () => {
    const self = this;
    const {
      apiUrl, apiToken, userId, groups, onComplete, onCloseTool
    } = this.props;
    let routes = [];
    groups.map((deliveries) => {
      routes.push({
        deliveries: deliveries.reduce((computedDeliveries, delivery) => {
          computedDeliveries.push(delivery.get('id'));
          return computedDeliveries;
        }, [])
      });
    });
    if (this.state.inconsistentTaks) {
      routes = routes.map((route) => {
        return {
          deliveries: route.deliveries.filter((task) => {
            return !this.state.inconsistentTaks.includes(task);
          })
        };
      }).filter((route) => (route.deliveries.length > 1));
    }
    this.setState({
      loading: true,
      succeed: false,
      failed: false,
      reconfirm: false,
      inconsistentTaks: undefined
    }, () => {
      createRoutes({ userId,
        routes }, { apiUrl,
        apiToken })
        .then((jobs) => {
          self.setState({
            loading: false,
            succeed: true,
            failed: false,
            reconfirm: false
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
        .catch((e) => {
          if (e.tasks) {
            return self.setState({
              loading: false,
              succeed: false,
              failed: false,
              reconfirm: true,
              inconsistentTaks: e.tasks
            });
          }
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
                {
                  (groups.size === 1) ?
                    window.translation('Create route') :
                    window.translation('Create routes')
                }
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
                !this.state.reconfirm &&
                this.state.succeed &&
                <Successful text={
                  (groups.size === 1) ?
                    window.translation('Route successfully created') :
                    window.translation('Routes successfully created')
                }/>
              }
              {
                !this.state.loading &&
                !this.state.reconfirm &&
                this.state.failed &&
                <Error text={
                  window.translation('Something went wrong. Please try again')
                }/>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                !this.state.reconfirm &&
                <div className="full-width">
                  <div className="shy-dialog-body-text-detail">
                    {
                      (groups.size === 1) ?
                        window.translation('Do you really want to create this route?') :
                        window.translation('Do you really want to create these routes?')
                    }
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      onClick={onClose}
                      className="shy-btn shy-btn-default">
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      onClick={this.createRoutesRequest}
                      className="shy-btn shy-btn-primary">
                      { window.translation('YES, CREATE') }
                    </button>
                  </div>
                </div>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                this.state.reconfirm &&
                <div className="full-width">
                  <div className="shy-dialog-body-text-detail">
                    {
                      window.translation('Some of your routes cannot be created due to recent changes on the following tasks:') +
                      this.state.inconsistentTaks.join(', ') +
                      `. ${window.translation('Do you want to try again without these tasks?')}`
                    }
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      onClick={onClose}
                      className="shy-btn shy-btn-default">
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      onClick={this.createRoutesRequest}
                      className="shy-btn shy-btn-primary">
                      { window.translation('YES, RETRY') }
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
class Polygon extends React.Component {
  state = {
    isPolygonHovered: false,
    selectedGroupType: this.props.groupType,
    isChangeGroupTypeDialogVisible: false,
    isConfirmationDialogVisible: false
  }
  componentDidUpdate(prevProps) { 
    if (!prevProps.isPolygonToolOpened && this.props.isPolygonToolOpened) {
      const steps = this.props.deliveries.get('schedule')
        .reduce((computedDeliveries, delivery) => {
          const payload = {
            id: delivery.getIn(['data', 'id']),
            deliveryType: delivery.getIn(['data', 'deliveryType']),
            color: this.props.deliveries.get('color')
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
            for (let i=0; i<this.props.deliveries.get('schedule').size; i++) {
              const d = this.props.deliveries.getIn(['schedule', i]);
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
  }
  handleMouseEnter = () => {
    this.setState({
      isPolygonHovered: true
    });
  }
  handleMouseLeave = () => {
    this.setState({
      isPolygonHovered: false
    });
  }
  render() {
    const {
      isPolygonToolOpened, togglePolygonTool, setListWidth, groupType,
      clearPolygons, selectGroupType, steps, polygons, apiUrl, apiToken, userId,
      addRoutes, showMessage, backgroundJobsSize, isLoadingRoutes, firstRouteId,
      selectedDeliveryTypes, selectDeliveryTypes, areRemainingDeliveriesVisible,
      toggleRemainingSingleDeliveriesVisibility
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
      isPolygonToolOpened ?
        <div className="polygon-opened">
          <div className="polygon-opened-header">
            <div>
              { window.translation('Polygon Tool') }
            </div>
            <img
              src="https://cdn.shippify.co/icons/icon-close-gray.svg"
              alt=""
              onClick={() => {
                clearPolygons();
                setListWidth(504);
                togglePolygonTool(false);
              }}/>
          </div>
          <div className="polygon-opened-body">
            <div className="delivery-types-container">
              <div>
                <div className="shy-form-field-label">
                  { window.translation('Select a delivery type') }
                </div>
                <div className="shy-form-field">
                  <Select
                    multi
                    valueKey="id"
                    labelKey="name"
                    value={selectedDeliveryTypes}
                    options={[
                      {
                        id: 'slot',
                        name: window.translation('Regular')
                      },
                      {
                        id: 'flex',
                        name: window.translation('Flex')
                      },
                      {
                        id: 'express',
                        name: window.translation('Express')
                      }
                    ]}
                    placeholder={
                      window.translation('Type a delivery type')
                    }
                    onChange={(e) => selectDeliveryTypes(e)}/>
                </div>
              </div>
            </div>
            <div className="group-type-container">
              <div className="shy-form-field-label">
                { window.translation('What would you like to group?') }
              </div>
              <div className="polygon-group-types">
                <div
                  className="polygon-group-type"
                  onClick={() => {
                    if (polygons.size > 0) {
                      this.setState({
                        selectedGroupType: 'dropoff',
                        isChangeGroupTypeDialogVisible: true
                      });
                    } else {
                      selectGroupType('dropoff');
                    }
                  }}>
                  <img
                    src={
                      (groupType === 'dropoff') ?
                        'https://cdn.shippify.co/images/img-radio-on.svg' :
                        'https://cdn.shippify.co/images/img-radio-off.svg'
                    }/>
                  <span>
                    { window.translation('Dropoffs') }
                  </span>
                </div>
                <div
                  className="polygon-group-type"
                  onClick={() => {
                    if (polygons.size > 0) {
                      this.setState({
                        selectedGroupType: 'pickup',
                        isChangeGroupTypeDialogVisible: true
                      });
                    } else {
                      selectGroupType('pickup');
                    }
                  }}>
                  <img
                    src={
                      (groupType === 'pickup') ?
                        'https://cdn.shippify.co/images/img-radio-on.svg' :
                        'https://cdn.shippify.co/images/img-radio-off.svg'
                    }/>
                  <span>
                    { window.translation('Pickups') }
                  </span>
                </div>
              </div>
            </div>
            <div
              className="single-deliveries-counter"
              onClick={toggleRemainingSingleDeliveriesVisibility}>
              <div className="flex flex-center">
                <img
                  className="single-deliveries-alert-icon"
                  src="https://cdn.shippify.co/icons/icon-error-gray-mini.svg"/>
                {
                  window.translation('*NUMBER* Single Deliveries')
                    .replace(
                      '*NUMBER*',
                      (
                        (steps.size/2) -
                        steps.filter(step => step.get('polygonId')).size
                      )
                    )
                }
              </div>
              <img
                src={
                  areRemainingDeliveriesVisible ?
                    'https://cdn.shippify.co/icons/icon-visibility-on-gray.svg' :
                    'https://cdn.shippify.co/icons/icon-visibility-off-gray.svg'
                }
                className="icon-visibility"/>
            </div>
            <div className="polygons">
              {
                polygonRows
              }
            </div>
          </div>
          <div className="polygon-opened-footer">
            <button
              className="shy-btn shy-btn-primary"
              onClick={() => {
                this.setState({ isConfirmationDialogVisible: true });
              }}>
              { window.translation('CREATE') }
            </button>
          </div>
          {
            this.state.isChangeGroupTypeDialogVisible &&
            <ConfirmChangeGroupType
              onClose={() => this.setState({
                isChangeGroupTypeDialogVisible: false
              })}
              selectedGroupType={this.state.selectedGroupType}
              selectGroupType={selectGroupType}/>
          }
          {
            this.state.isConfirmationDialogVisible &&
            <ConfirmCreateRoutes
              addRoutes={addRoutes}
              userId={userId}
              apiUrl={apiUrl}
              apiToken={apiToken}
              onClose={() => {
                this.setState({
                  isConfirmationDialogVisible: false
                });
              }}
              onCloseTool={() => {
                clearPolygons();
                setListWidth(504);
                togglePolygonTool(false);
              }}
              onComplete={() => {
                clearPolygons();
                setListWidth(504);
                togglePolygonTool(false);
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
        </div> :
        <div
          className="polygon-closed"
          onClick={() => {
            this.setState({
              isPolygonHovered: false
            });
            if (
              (backgroundJobsSize === 0) &&
              !isLoadingRoutes &&
              (firstRouteId === 'Single')
            ) {
              setListWidth(0);
              togglePolygonTool(true);
            } else {
              if (backgroundJobsSize > 0) {
                showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
              }
              if (isLoadingRoutes) {
                showMessage(`${window.translation('Please wait until the routes are loaded.')}`);
              }
              if (firstRouteId !== 'Single') {
                showMessage(`${window.translation('You do not have single deliveries to group.')}`);
              }
            }
          }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          style={{
            left: (this.props.listWidth + 16)
          }}>
          <img
            src="https://cdn.shippify.co/icons/icon-new-polygon-white.svg"
            className="icon-polygon"/>
          {
            this.state.isPolygonHovered &&
            <span>
              {
                window.translation('POLYGON')
              }
            </span>
          }
        </div>
    );
  }
}


/**
 *
 */
const mapStateToProps = state => {
  const selectedDeliveryTypes = state.getIn(['polygon', 'selectedDeliveryTypes']);
  const filteredStep = state.getIn(['routes', 'filteredStep']);
  let filteredStepActivityType = undefined;
  let commonPointsIds = [];
  if (filteredStep) {
    filteredStepActivityType = (filteredStep.get('activityType') === 'P') ?
      'pickup' : 'dropoff';
    state.getIn(['polygon', 'steps'])
      .map(s => {
        if (
          areCommonPoints(
            {
              latitude: filteredStep.getIn([filteredStepActivityType, 'location', 'latitude']),
              longitude: filteredStep.getIn([filteredStepActivityType, 'location', 'longitude']),
              type: filteredStepActivityType
            },
            {
              longitude: s.getIn([s.get('activityType'), 'location', 'longitude']),
              latitude: s.getIn([s.get('activityType'), 'location', 'latitude']),
              type: s.getIn(['activityType'])    
            })
        ) {
          commonPointsIds.push(s.get('id'));
        }
      });
  }

  return {
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    deliveries: state.getIn(['routes', 'data', 0]),
    firstRouteId: state.getIn(['routes', 'data', 0, 'id']),
    groupType: state.getIn(['polygon', 'groupType']),
    steps: state.getIn(['polygon', 'steps'])
      .filter(s => {
        if (selectedDeliveryTypes.length > 0) {
          return (
            selectedDeliveryTypes
              .filter(dt => dt.id === s.get('deliveryType'))
              .length > 0
          );
        }
        return true;
      })
      .filter(s => {
        if (filteredStep) {
          return commonPointsIds.includes(s.get('id'));
        }
        return true;
      }),
    polygons: state.getIn(['polygon', 'polygons']),
    selectedDeliveryTypes: state.getIn(['polygon', 'selectedDeliveryTypes']),
    backgroundJobsSize: state.getIn(['backgroundJobs', 'jobs']).size,
    isLoadingRoutes: state.getIn(['routes', 'isLoadingRoutes']),
    areRemainingDeliveriesVisible: state.getIn(
      ['polygon', 'areRemainingDeliveriesVisible']
    )
  };
};


/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  setSteps: actions.setSteps,
  clearPolygons: actions.clearPolygons,
  selectGroupType: actions.selectGroupType,
  selectDeliveryTypes: actions.selectDeliveryTypes,
  showMessage: generalActions.showMessage,
  loadRoutes: loadRoutesRequest,
  toggleRemainingSingleDeliveriesVisibility:
  actions.toggleRemainingSingleDeliveriesVisibility
}, dispatch);


/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Polygon);
