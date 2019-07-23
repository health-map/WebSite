/**
 * @file automerge.js
 * @description Merge Routes modal.
 *
 */


import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';

import Loading from './../shared/loading';
import Error from './../shared/error';
import Successful from './../shared/successful';
import { areCommonPoints } from './../../services/utils';
import { mergeRoutes } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
import { StatusesMapping, DeliveryStatusLabel } from './../../constants';
const { loadRoutes: loadRoutesRequest } = thunks;

import './automergeRoutes.css';

/**
 *
 */
class RouteMergeRow extends React.Component {
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
        className={`automerge-item ${this.props.selectRoute ? this.props.selectRoute : 'item-disabled'}`}
        onClick={() => { 
          if (this.props.selectRoute) {
            this.props.selectRoute(route.get('id')); 
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
class AutoMergeRoutesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      succeed: false,
      failed: false,
      routesToMerge: [props.selectedRouteIdToAutoMerge]
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
  mergeRoutesRequest = () => {
    const self = this;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      mergeRoutes(
        {
          routeIds: this.state.routesToMerge.join(',')
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken,
          userId: this.props.userId
        }
      )
        .then(() => {
          self.props.loadRoutes({
            from: self.props.from,
            to: self.props.to,
            tags: self.props.selectedTags,
            cities: self.props.selectedCities,
            companies: self.props.selectedCompanies,
            deliveries: self.props.selectedDeliveries,
            statuses: self.props.selectedStatuses
          });
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
  selectRoute(id) {
    if (!this.state.routesToMerge.includes(id)) {
      this.setState({
        routesToMerge: this.state.routesToMerge.concat(id)
      });
    } else {
      this.setState({
        routesToMerge: this.state.routesToMerge.filter((routeId) => {
          return routeId != id;
        })
      });
    }
  }
  isRouteSelected(id) {
    return this.state.routesToMerge.includes(id);
  }
  render() {
    const self = this;
    const {
      routes, selectedRouteIdToAutoMerge
    } = this.props;

    let selectedRoute = routes.filter((route) => {
      return route.get('id') === selectedRouteIdToAutoMerge;
    }).first();

    const isSelectedRouteProcessing = selectedRoute.get('schedule').every((step) => {
      return step.getIn(['data', 'status']) === StatusesMapping.processing;
    });
    const selectedRouteStatus = 
      isSelectedRouteProcessing ? 
        DeliveryStatusLabel.processing : 
        DeliveryStatusLabel.broadcasting;
    selectedRoute = selectedRoute.set('routeStatus', selectedRouteStatus);

    const availableRoutes = routes
      .filter((route) => {
        const isSingleRoute = route.get('id') !== 'Single';
        const notSelectedRoute = route.get('id') !== selectedRoute.get('id');
        const areCommonStartingPoint = areCommonPoints(
          {
            latitude: 
              selectedRoute.getIn([
                'schedule', 0, 'data', 'location', 'geopoint', 'latitude'
              ]), 
            longitude: 
              selectedRoute.getIn([
                'schedule', 0, 'data', 'location', 'geopoint', 'longitude'
              ]), 
            type: 'P'
          },
          {
            latitude:  
              route.getIn([
                'schedule', 0, 'data', 'location', 'geopoint', 'latitude'
              ]),
            longitude: 
              route.getIn([
                'schedule', 0, 'data', 'location', 'geopoint', 'longitude'
              ]),
            type: 'P'
          }
        );
        return (isSingleRoute && areCommonStartingPoint && notSelectedRoute);
      })
      .map((route) => {
        const isProcessing = route.get('schedule').every((step) => {
          return step.getIn(['data', 'status']) === StatusesMapping.processing;
        });
        const routeStatus = 
          isProcessing ? 
            DeliveryStatusLabel.processing : 
            DeliveryStatusLabel.broadcasting;
        return route.set('routeStatus', routeStatus);
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
                  src="https://cdn.shippify.co/icons/icon-person-add-white.svg"
                  alt=""/>
                {
                  window.translation('Merge Recommendation')
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
                  window.translation('Routes merged')
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
                          `${window.translation('The recommended routes share first pickup point with ')}
                          ${selectedRoute.get('id')}. 
                          ${window.translation('Select the routes you would like to merge')}` 
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
                          window.translation('No routes were found to merge')
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
                          <RouteMergeRow 
                            key={0}
                            route={selectedRoute}
                            selected={true}
                            selectRoute={undefined}
                          />
                          {
                            availableRoutes.map((route, idx) => {
                              return <RouteMergeRow
                                key={idx + 1}
                                route={route}
                                selected={self.isRouteSelected(route.get('id'))}
                                selectRoute={self.selectRoute.bind(self)} />;
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
                            onClick={() => { this.mergeRoutesRequest(); }}>
                            { window.translation('MERGE') }
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
  return {
    routes: state.getIn(['routes', 'data'])
      .filter(route => {
        return (route.get('id') !== 'Single');
      }),
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
)(AutoMergeRoutesDialog);
