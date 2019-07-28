/**
 * @file routeDetail.js
 * @description Route Detail component
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AutoSizer, List } from 'react-virtualized';

import Error from './../shared/error';
import Loading from './../shared/loading';
import ErrorDialog from './../dialogs/errorDialog';
import SuccessDialog from './../dialogs/successDialog';
import RemoveDeliveryFromRouteDialog from './../dialogs/removeDeliveryFromRoute';
import MoveDeliveryToAnotherRouteDialog from './../dialogs/moveDeliveryToAnotherRoute';
import NotAvailable from './../shared/notAvailable';
import RouteDetailStep from './routeDetailStep';
import RouteDetailFooter from './RouteDetailFooter';
import { actions } from './../../actions/routes';
import { actions as polygonActions } from './../../actions/polygon';
import { thunks } from './../../actions/thunks/routes';
const { loadRouteInfo: loadRouteInfoRequest } = thunks;
import { reorderRouteRequest } from './../../services/remoteAPI';

import './routeDetail.css';

/**
 *
 */
function createNoRowsRenderer(loading) {
  return function noRowsRenderer() {
    return loading ?
      (
        <Loading/>
      ) :
      (
        <NotAvailable
          title={
            window.translation('This route was not found.')
          }
        />
      );
  };
}

/**
 *
 */
class RouteDetail extends React.Component {
  state = {
    errorMessage: '',
    successMessage: '',
    reorderingRoute: false,
    selectedStepIdToReorder: undefined
  }
  componentDidMount() {
    this.loadRouteInfo();
  }
  loadRouteInfo = () => {
    this.props.loadRouteInfo(this.props.route.get('id'))
      .then(() => {
        this.props.updateRouteSteps(
          this.props.route.get('id'),
          this.props.steps
        );
      });
  }
  reorderRouteRequest = () => {
    const self = this;
    const steps = [];
    const routeId = this.props.route.get('id');
    this.props.steps.map((stepList) => {
      stepList.map((step) => {
        steps.push({
          id: step.get('deliveryId'),
          activity: (step.get('activityType') === 'pickup') ?
            'pickup' : 'delivery'
        });
      });
    });
    this.setState({
      reorderingRoute: true,
      errorMessage: '',
      successMessage: '',
      selectedStepIdToReorder: undefined
    }, () => {
      reorderRouteRequest(
        {
          routeId,
          steps
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken,
          userId: this.props.userId
        }
      )
        .then((jobs) => {
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
          }
          self.setState({
            reorderingRoute: false,
            successMessage: 'Route reordered successfully'
          });
        })
        .catch(() => {
          self.setState({
            reorderingRoute: false,
            errorMessage: 'Something went wrong. Please try again'
          });
        });
    });
  }
  selectStepIdToReorder = (id) => {
    this.setState({
      selectedStepIdToReorder: id
    });
  }
  render() {
    const selectStepIdToReorder = this.selectStepIdToReorder;
    const { selectedStepIdToReorder } = this.state;
    const {
      steps, route, width: containerWidth, selectRoute, loadRouteInfo,
      selectedStep, selectRouteIdToAssign, isResponsive,
      selectedRouteToReorder, reorderError, changeReorderError,
      selectedRouteIdToAddDeliveries, setListWidth, clearPolygons,
      selectDeliveryIdToRemoveFromRoute, selectDeliveryIdToMoveToAnotherRoute,
      selectedRouteIdToDivide, selectedDeliveryIdToRemoveFromRoute,
      selectedDeliveryIdToMoveToAnotherRoute
    } = this.props;
    const rowRenderer = ({ index, key, style }) => {
      return (
        <div key={key} style={style}>
          <RouteDetailStep
            index={index}
            data={steps.get(index)}
            isResponsive={isResponsive}
            selectedStep={selectedStep}
            containerWidth={containerWidth}
            selectStepIdToReorder={selectStepIdToReorder}
            selectedStepIdToReorder={selectedStepIdToReorder}
            selectedRouteToReorder={selectedRouteToReorder}
            selectDeliveryIdToRemoveFromRoute={
              selectDeliveryIdToRemoveFromRoute
            }
            selectDeliveryIdToMoveToAnotherRoute={
              selectDeliveryIdToMoveToAnotherRoute
            }/>
        </div>
      );
    };
    const noRowsRenderer = createNoRowsRenderer(route.get('isLoadingInfo'));
    return (
      ( selectedRouteIdToAddDeliveries || selectedRouteIdToDivide ) ?
        <div></div> :
        <div
          className="route-detail-container"
          style={{
            width: isResponsive ? '100%' : containerWidth
          }}>
          {
            !isResponsive &&
          <div
            className="route-detail-header"
            style={{
              backgroundColor: route.get('color')
            }}>
            <div className="flex flex-align-center">
              <img
                src="https://cdn.shippify.co/icons/icon-arrow-back-white.svg"
                className="icon-back margin-right-16"
                alt=""
                onClick={() => {
                  clearPolygons();
                  selectRoute();
                }}/>
              {
                selectedRouteToReorder ?
                  `${window.translation('Reorder')} ${route.get('id')}` :
                  route.get('id')
              }
            </div>
            <div className="flex flex-align-center">
              {
                route.get('courier') &&
                <div className="route-detail-courier">
                  <div className="courier-name-container">
                    <div className="courier-name">
                      {
                        route.getIn(['courier', 'name'])
                      }
                    </div>
                    <div className="courier-id">
                      {
                        route.getIn(['courier', 'id'])
                      }
                    </div>
                  </div>
                  <img
                    src="https://cdn.shippify.co/icons/icon-user-white.svg"
                    className="icon-person"/>
                </div>
              }
            </div>
          </div>
          }
          <div className="route-detail-body">
            {
              route.get('isLoadingInfo') &&
            <Loading/>
            }
            {
              !route.get('isLoadingInfo') &&
            route.get('loadRouteInfoError') &&
            <Error
              text={route.get('loadRouteInfoError')}
              onRetry={() => {
                loadRouteInfo(route.get('id'));
              }}/>
            }
            {
              !route.get('isLoadingInfo') &&
            !route.get('loadRouteInfoError') &&
            <div className="full-height flex flex-column">
              <div className="full-height">
                <AutoSizer>
                  {
                    ({ width, height }) => (
                      <List
                        width={width}
                        height={height}
                        rowCount={steps.count()}
                        rowHeight={isResponsive ? 100 : 76}
                        rowRenderer={rowRenderer}
                        noRowsRenderer={noRowsRenderer}
                        style={{ outline: 0 }}
                      />
                    )
                  }
                </AutoSizer>
              </div>
              {
                !selectedRouteToReorder &&
                <RouteDetailFooter
                  routeId={route.get('id')}
                  setListWidth={setListWidth}
                  containerWidth={containerWidth}
                  selectRouteIdToAssign={selectRouteIdToAssign}/>
              }
              {
                selectedRouteToReorder &&
                <div className="shy-reorder-footer">
                  <button
                    className="shy-btn shy-btn-primary full-width"
                    onClick={this.reorderRouteRequest}
                    disabled={this.state.reorderingRoute}>
                    {
                      this.state.reorderingRoute ?
                        `${window.translation('SAVING CHANGES')}...` :
                        window.translation('SAVE CHANGES')
                    }
                    {
                      this.state.reorderingRoute &&
                      <img
                        className="spin"
                        src="https://cdn.shippify.co/images/img-loading.svg"
                        alt=""/>
                    }
                  </button>
                </div>
              }
            </div>
            }
            {
              (this.state.errorMessage || reorderError) &&
            <ErrorDialog
              text={this.state.errorMessage || reorderError}
              onClose={() => {
                this.setState({
                  errorMessage: ''
                }, () => {
                  changeReorderError('');
                });
              }}/>
            }
            {
              this.state.successMessage &&
            <SuccessDialog
              text={this.state.successMessage}
              onClose={() => {
                this.setState({
                  successMessage: ''
                }, () => {
                  this.props.selectRouteToReorder();
                  this.props.selectRoute(this.props.route.get('id'));
                  this.loadRouteInfo();
                });
              }}/>
            }
            {
              selectedDeliveryIdToRemoveFromRoute &&
              <RemoveDeliveryFromRouteDialog
                routeId={route.get('id')}
                courier={route.get('courier')}
                loadRouteInfo={this.loadRouteInfo}
                deliveryId={selectedDeliveryIdToRemoveFromRoute}
                onClose={() => selectDeliveryIdToRemoveFromRoute()}/>
            }
            {
              selectedDeliveryIdToMoveToAnotherRoute &&
              <MoveDeliveryToAnotherRouteDialog
                routeFrom={route.get('id')}
                selectedDeliveryIdToMoveToAnotherRoute={
                  selectedDeliveryIdToMoveToAnotherRoute
                }
                loadRouteInfo={this.loadRouteInfo}
                onClose={() => selectDeliveryIdToMoveToAnotherRoute()}/>
            }
          </div>
        </div>
    );
  }
}

/**
 *
 */
const mapStateToProps = (state) => {
  const notCollapsedReasons = {};
  const selectedRouteToReorder =
  state.getIn(['routes', 'selectedRouteToReorder']);
  let route;
  if (state.getIn(['routes', 'selectedRouteToReorder'])) {
    route = state.getIn(['routes', 'selectedRouteToReorder']);
  } else {
    route = state.getIn(['routes', 'data'])
      .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteId'])))
      .first();
  }
  let steps;
  if (route.get('steps') && selectedRouteToReorder) {
    steps = route.get('steps');
  } else {
    const uncollapsedSteps =  route.get('stepIds', Immutable.List())
      .map(stepId => {
        const { deliveryId, activityType } = stepId.toObject();
        const delivery = route.get('deliveries').find(d => {
          return (d.get('id') === deliveryId);
        });
        return delivery.set('activityType', activityType);
      }).map((step, index) => {
        const {
          id, activityType, pickup, dropoff, substatus, state: stateNumber,
          referenceId, chargedDistance, routeDistance, packages, fare, company,
          tags
        } = step.toObject();
        let contact = pickup.get('contact');
        let location = pickup.get('location');
        let timeWindow = pickup.get('timeWindow');
        if (activityType === 'dropoff') {
          contact = dropoff.get('contact');
          location = dropoff.get('location');
          timeWindow = dropoff.get('timeWindow');
        }
        return Immutable.Map([
          ['index', index],
          ['id', `${id}-${activityType}`],
          ['location', location],
          ['contact', contact],
          ['substatus', substatus],
          ['state', stateNumber],
          ['deliveryId', id],
          ['timeWindow', timeWindow],
          ['referenceId', referenceId],
          ['activityType', activityType],
          ['chargedDistance', chargedDistance],
          ['routeDistance', routeDistance],
          ['items', packages.get('contents')],
          ['cash', fare.get('cash')],
          ['price', fare.get('delivery')],
          ['service', fare.get('service')],
          ['currency', fare.get('currency')],
          ['company', company],
          ['tags', tags]
        ]);
      });
    let lastLocation;
    let lastActivityType;
    let lastContact;
    let areStepsCollapsed = true;
    steps = uncollapsedSteps.reduce(
      (computedCollapsedSteps, step) => {
        const newContact = step.get('contact');
        const newLocation = step.get('location');
        const newActivityType = step.get('activityType');
        if (areStepsCollapsed) {
          if (lastContact &&
                lastLocation &&
                lastContact.equals(newContact) &&
                lastLocation.equals(newLocation)) {
            if (lastActivityType === newActivityType) {
              const insertionIndex = computedCollapsedSteps.count() - 1;
              computedCollapsedSteps = computedCollapsedSteps.update(
                insertionIndex,
                (computedSteps) => computedSteps.push(step)
              );
            } else {
              computedCollapsedSteps = computedCollapsedSteps.push(
                new Immutable.List([step])
              );
            }
          } else {
            computedCollapsedSteps = computedCollapsedSteps.push(
              new Immutable.List([step])
            );
            if (
              lastLocation &&
                newLocation &&
                (lastLocation.get('address') === newLocation.get('address'))
            ) {
              if (lastLocation.get('latitude') !== newLocation.get('latitude')) {
                notCollapsedReasons['Latitude is different'] = 1;
              }
              if (
                lastLocation.get('longitude') !==
                newLocation.get('longitude')
              ) {
                notCollapsedReasons['Longitude is different'] = 1;
              }
              if (
                lastContact &&
                  newContact &&
                  (
                    lastContact.get('phonenumber') !==
                    newContact.get('phonenumber')
                  )
              ) {
                if (newActivityType === 'pickup') {
                  notCollapsedReasons['Sender phone number is different'] = 1;
                }
                if (newActivityType === 'dropoff') {
                  notCollapsedReasons['Recipient phone number is different'] = 1;
                }
              }
              if (
                lastContact &&
                  newContact &&
                  (lastContact.get('email') !== newContact.get('email'))
              ) {
                if (newActivityType === 'pickup') {
                  notCollapsedReasons['Sender email is different'] = 1;
                }
                if (newActivityType === 'dropoff') {
                  notCollapsedReasons['Recipient email is different'] = 1;
                }
              }
              if (
                lastContact &&
                  newContact &&
                  (lastContact.get('name') !== newContact.get('name'))
              ) {
                if (newActivityType === 'pickup') {
                  notCollapsedReasons['Sender name is different'] = 1;
                }
                if (newActivityType === 'dropoff') {
                  notCollapsedReasons['Recipient name is different'] = 1;
                }
              }
            }
          }
        } else {
          computedCollapsedSteps = computedCollapsedSteps.push(
            new Immutable.List([step])
          );
        }
        lastContact      = newContact;
        lastLocation     = newLocation;
        lastActivityType = newActivityType;
        return computedCollapsedSteps;
      },
      new Immutable.List()
    );
  }
  const selectedStep = state.getIn(['routes', 'selectedStep']);
  const reorderError = state.getIn(['routes', 'reorderError']);
  return {
    route,
    selectedStep,
    steps,
    reorderError,
    selectedRouteToReorder,
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    userId: state.getIn(['general', 'user', 'id']),
    notCollapsedReasons: Object.keys(notCollapsedReasons),
    selectedRouteIdToAddDeliveries: state.getIn(['routes', 'selectedRouteIdToAddDeliveries']),
    selectedRouteIdToDivide: state.getIn(['routes', 'selectedRouteIdToDivide'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectRoute: actions.selectRoute,
  updateRouteSteps: actions.updateRouteSteps,
  changeReorderError: actions.changeReorderError,
  selectRouteToReorder: actions.selectRouteToReorder,
  clearPolygons: polygonActions.clearPolygons,
  loadRouteInfo: loadRouteInfoRequest
}, dispatch);

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteDetail);
