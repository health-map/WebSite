/**
 * @file moveDeliveryToAnotherRoute.js
 * @description Move delivery to another route modal.
 *
 */


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';

import Loading from '../shared/loading';
import Error from '../shared/error';
import Successful from '../shared/successful';
import { moveDeliveryToAnotherRoute } from '../../services/remoteAPI';
import { thunks } from '../../actions/thunks/routes';
import { actions } from './../../actions/routes';
import { StatusesMapping, DeliveryStatusLabel } from '../../constants';
const { loadRoutes: loadRoutesRequest } = thunks;

import './moveDeliveryToAnotherRoute.css';

/**
 *
 */
class RouteMoveRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      route
    } = this.props;

    const companies = route.get('companies').map((company, idx) => {
      return (
        <span
          key={idx}>
          {company.get('name')}
        </span>
      );
    });

    const tags = route.get('schedule').reduce((computedTags, stop) => {
      let stopTags = stop.getIn(['data', 'tags']);
      if (stopTags && stopTags.size) {
        stopTags = stopTags.filter((tag) => {
          if (computedTags.size) { // filter repeated tags
            return !computedTags.some((ctag) => {
              return tag.get('name') === ctag.get('name');
            });
          } 
          return true;
        });
        return computedTags.concat(stopTags);
      }
      return computedTags;
    }, List());

    let tagsDisplayed = [];
    if (tags && tags.size) {
      tagsDisplayed = tags.map((t, idx) => {
        return (
          <span
            key={idx}
            className="shy-route-tag"
            style={{ 'backgroundColor': t.get('color') }}>
            {t.get('name')}
          </span>
        );
      });
      if (tagsDisplayed.size > 3) {
        tagsDisplayed = tagsDisplayed.slice(0, 3);
        tagsDisplayed = tagsDisplayed.concat(
          <span
            key={'3'}
            className="shy-route-tag"
            style={{ 'backgroundColor': '#757575' }}>
            ...
          </span>
        );
      }
    }
    return (
      <div 
        className={`automerge-item ${this.props.selectRouteToMove ? this.props.selectRouteToMove : 'item-disabled'}`}
        onClick={() => { 
          if (this.props.selectRouteToMove) {
            this.props.selectRouteToMove(route.get('id')); 
          }
        }}>
        <div className="automerge-item-routeid">
          <span className="icon marginless v1-margin-left-lg automerge-checkbox">
            <img
              className="icon-person-add"
              src= {
                this.props.selected ? 
                  'https://cdn.shippify.co/images/img-checkbox-on.svg' :
                  'https://cdn.shippify.co/images/img-checkbox-off.svg'
              }
              alt=""/>
          </span>
          <span className="full-width">
            <div className="full-width automerge-route-id">
              <span>{route.get('id')}</span>
              <span>
                <img
                  className="automerge-holder-icon"
                  src="https://cdn.shippify.co/icons/icon-notes-holder-gray-mini.svg"
                  alt=""/>
                {
                  `${route.get('schedule').size / 2}  ${window.translation('deliveries')}`
                }
              </span>
            </div>
          </span>
        </div>
        <div className="automerge-item-companies">
          <span className="automerge-companies">
            { 
              companies
            }
          </span>
        </div>
        <div className="automerge-item-tags">
          {
            !!tagsDisplayed.size &&
            <div className='flex'>
              <div className="shy-route-tags">
                {
                  tagsDisplayed
                }
              </div>
            </div>
          }
        </div>
        <div className="automerge-item-status">
          { 
            window.translation(route.get('routeStatus'))
          }
        </div>
      </div>
    );
  }
}


/**
 *
 */
class MoveDeliveryToAnotherRouteDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      succeed: false,
      failed: false,
      routeTo: []
    };
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
  moveDeliveryRequest = () => {
    const self = this;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      moveDeliveryToAnotherRoute(
        {
          movements: [
            {
              deliveries: [this.props.selectedDeliveryIdToMoveToAnotherRoute],
              routeFrom: this.props.routeFrom,
              routeTo: this.state.routeTo.join(',')
            }
          ],
          userId: this.props.userId
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken
        }
      )
        .then((job) => {
          if (job) {
            window.onSubscribeBackgroundJob(job.id, 'Routing.jsprit');
          } else {
            self.props.loadRouteInfo();
          }
          self.setState({
            loading: false,
            succeed: true
          });
        })
        .catch(() => {
          self.setState({
            loading: false,
            failed: true
          });
        });
    });
  }
  selectRouteToMove(id) {
    this.setState({
      routeTo: [id]
    });
  }
  isRouteSelected(id) {
    return this.state.routeTo.includes(id);
  }
  render() {
    const self = this;
    const {
      routes, selectedDeliveryIdToMoveToAnotherRoute, selectedRouteId
    } = this.props;

    const availableRoutes = routes
      .map((route) => {
        const isProcessing = route.get('schedule').every((step) => {
          return step.getIn(['data', 'status']) === StatusesMapping.processing;
        });
        const routeStatus = 
          isProcessing ? 
            DeliveryStatusLabel.processing : 
            DeliveryStatusLabel.broadcasting;
        return route.set('routeStatus', routeStatus);
      })
      .filter((r) => {
        return r.get('id') != selectedRouteId;
      });

    return (

      <div
        className="shy-dialog"
        onClick={this.props.onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content automerge-dialog"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <span className="shy-dialog-header-content">
                <img
                  className="icon-error"
                  src="https://cdn.shippify.co/icons/icon-change-status-white.svg"
                  alt=""/>
                {
                  window.translation('Move to another route')
                }
              </span>
              <img
                src="https://cdn.shippify.co/dash/general/img/close-gray.svg"
                className="shy-dialog-close"
                alt="Close"
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body">
              {
                this.state.loading &&
                <Loading mini/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful text={
                  window.translation('Delivery moved')
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
                  {
                    !!availableRoutes.size &&
                    <div className="tags-message">
                      <img src="https://cdn.shippify.co/icons/icon-info-outline-gray.svg"/>
                      <span>
                        { 
                          window.translation('Select the route on which the delivery ID will be moved:')
                            .replace('ID', selectedDeliveryIdToMoveToAnotherRoute)
                        }
                      </span>
                    </div>
                  }
                  <div className={
                    availableRoutes.size === 0 ?
                      'assign-courier-body shy-v1-center' :
                      'assign-courier-body'}>
                    {
                      !availableRoutes.size &&
                      <div
                        className="automerge-not-found">
                        {
                          window.translation('No routes were found')
                        }
                      </div>
                    }
                    {
                      !!availableRoutes.size &&
                      <div className="assign-courier">
                        <div className="assign-courier-header">
                          <span className="automerge-header-routeid">
                            {
                              window.translation('Route')
                            }
                          </span>
                          <span  className="automerge-header-companies">
                            {
                              window.translation('Companies')
                            }
                          </span>
                          <span className="automerge-header-tags">
                            {
                              window.translation('Tags')
                            }
                          </span>
                          <span className="automerge-header-status"> 
                            {
                              window.translation('Status')
                            }
                          </span>
                        </div>
                        <div className="assign-courier-body">
                          {
                            availableRoutes.map((route, idx) => {
                              return <RouteMoveRow
                                key={idx + 1}
                                route={route}
                                selected={
                                  self.isRouteSelected(route.get('id'))
                                }
                                selectRouteToMove={
                                  self.selectRouteToMove.bind(self)
                                }
                              />;
                            }).toArray()
                          }
                        </div>
                        <div className="shy-dialog-body-buttons">
                          <button
                            className="shy-btn shy-btn-default"
                            onClick={this.props.onClose}>
                            { window.translation('CANCEL') }
                          </button>
                          <button
                            className="shy-btn shy-btn-primary"
                            onClick={() => { this.moveDeliveryRequest(); }}>
                            { window.translation('MOVE') }
                          </button>
                        </div>
                      </div>
                    }
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
const mapStateToProps = (state) => {
  const selectedRoute = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteId'])))
    .first();
  return {
    selectRoute: actions.selectRoute,
    routes: state.getIn(['routes', 'data'])
      .filter(route => {
        return (route.get('id') !== 'Single');
      }),
    selectedRouteId: selectedRoute.get('id'),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    userId: state.getIn(['general', 'user', 'id'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  loadRoutes: loadRoutesRequest
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoveDeliveryToAnotherRouteDialog);
