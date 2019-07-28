/**
 * @file breakRoute.js
 * @description Break route confirmation dialog
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTooltip from 'react-tooltip';

import {
  CapacityParameters,
  CapacityParametersTypes
} from './../../constants';
import Loading from './../shared/loading';
import Error from './../shared/error';
import Successful from './../shared/successful';
import { clusterizeRoutes } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;

import { getCommonPoints } from './../../services/utils';

import './autorouting.css';

/**
 *
 */
class Autorouting extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    maxDeliveriesPerRoute: 20,
    maxDeliveriesValidation: '',
    minDeliveriesPerRoute: '',
    minDeliveriesValidation: '',
    maxPricePerRoute: undefined,
    maxPriceValidation: undefined,
    maxDistancePerRoute: undefined,
    maxDistanceValidation: undefined,
    maxPackagesNumberPerRoute: undefined,
    maxPackagesSizeValidation: undefined,
    maxPackagesPricePerRoute: undefined,
    maxPackagesPriceValidation: undefined,
    maxCostPerRoute: undefined,
    maxCostValidation: undefined,
    pickupPerRoute: false,
    useStrictTimeWindows: false
  }
  handleMaxDeliveriesPerRouteChange = (number) => {
    this.setState({
      maxDeliveriesPerRoute: Number(number)
    });
  }
  handleMinDeliveriesPerRouteChange = (number) => {
    this.setState({
      minDeliveriesPerRoute: Number(number)
    });
  }
  handleMaxDistancePerRouteChange = (number) => {
    this.setState({
      maxDistancePerRoute: Number(number)
    });
  }
  handlemaxPackagesNumberPerRouteChange = (number) => {
    this.setState({
      maxPackagesNumberPerRoute: Number(number)
    });
  }
  handleMaxPackagesPricePerRouteChange = (number) => {
    this.setState({
      maxPackagesPricePerRoute: Number(number)
    });
  }
  handleMaxPricePerRouteChange = (number) => {
    this.setState({
      maxPricePerRoute: Number(number)
    });
  }
  handleMaxCostPerRouteChange = (number) => {
    this.setState({
      maxCostPerRoute: Number(number)
    });
  }
  validateMaxDeliveriesPerRoute = () => {
    if (this.state.maxDeliveriesPerRoute === 0) {
      this.setState({
        maxDeliveriesValidation: 'This field is required'
      });
      return false;
    }
    this.setState({
      maxDeliveriesValidation: ''
    });
    return true;
  }
  validateMinDeliveriesPerRoute = () => {
    if (!!this.state.minDeliveriesPerRoute
      && this.state.minDeliveriesPerRoute > this.state.maxDeliveriesPerRoute) {
      this.setState({
        minDeliveriesValidation: 'Cannot be higher than the maximum number of deliveries per route'
      });
      return false;
    }
    this.setState({
      minDeliveriesValidation: undefined
    });
    return true;
  }
  validateMaxDistancePerRoute = () => {
    if (this.state.maxDistancePerRoute === 0
      || !this.state.maxDistancePerRoute) {
      this.setState({
        maxDistanceValidation: 'This field is null'
      });
      return;
    }
    this.setState({
      maxDistanceValidation: undefined
    });
  }
  validateMaxPricePerRoute = () => {
    if (this.state.maxPricePerRoute === 0 
      || !this.state.maxPricePerRoute) {
      this.setState({
        maxPriceValidation: 'This field is null'
      });
      return;
    }
    this.setState({
      maxPriceValidation: undefined
    });
  }
  validateMaxCostPerRoute = () => {
    if (this.state.maxCostPerRoute === 0
      || !this.state.maxCostPerRoute) {
      this.setState({
        maxCostValidation: 'This field is null'
      });
      return;
    }
    this.setState({
      maxCostValidation: undefined
    });
  }
  validateMaxPackagesPricePerRoute = () => {
    if (this.state.maxPackagesPricePerRoute === 0
      || !this.state.maxPackagesPricePerRoute) {
      this.setState({
        maxPackagesPriceValidation: 'This field is null'
      });
      return;
    }
    this.setState({
      maxPackagesPriceValidation: undefined
    });
  }
  validatemaxPackagesNumberPerRoute = () => {
    if (this.state.maxPackagesNumberPerRoute === 0
      || !this.state.maxPackagesNumberPerRoute) {
      this.setState({
        maxPackagesSizeValidation: 'This field is null'
      });
      return;
    }
    this.setState({
      maxPackagesSizeValidation: undefined
    });
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
  componentDidMount() {
    this.validateMaxDeliveriesPerRoute();
    this.validateMinDeliveriesPerRoute();
    this.validateMaxCostPerRoute();
    this.validateMaxDistancePerRoute();
    this.validateMaxPackagesPricePerRoute();
    this.validatemaxPackagesNumberPerRoute();
    this.validateMaxPricePerRoute();
  }
  togglePickupPerRoute = () => {
    this.setState({
      pickupPerRoute: !this.state.pickupPerRoute
    });
  }
  toggleuseStrictTimeWindows = () => {
    this.setState({
      useStrictTimeWindows: !this.state.useStrictTimeWindows
    });
  }
  clusterizeRoutesRequest = () => {
    const self = this;
    const {
      singleDeliveries
    } = this.props;
    let routesGroups = [];
    let maxCapacities = [];
    let deliveriesToUse = this.props.selectedDeliveries;

    if (!this.validateMaxDeliveriesPerRoute()
      || !this.validateMinDeliveriesPerRoute()) {
      return;
    }

    this.validateMaxCostPerRoute();
    this.validateMaxDistancePerRoute();
    this.validateMaxPackagesPricePerRoute();
    this.validatemaxPackagesNumberPerRoute();
    this.validateMaxPricePerRoute();

    if (this.state.maxDeliveriesPerRoute 
      && this.state.maxDeliveriesPerRoute !== 0) {
      maxCapacities.push({
        max: this.state.maxDeliveriesPerRoute,
        min: this.state.minDeliveriesPerRoute,
        parameter: CapacityParameters.DELIVERY,
        type: CapacityParametersTypes.STATIC
      });
    }

    if (this.state.maxPricePerRoute 
      && this.state.maxPricePerRoute !== 0) {
      maxCapacities.push({
        max: this.state.maxPricePerRoute,
        parameter: CapacityParameters.PRICE,
        type: CapacityParametersTypes.STATIC
      });
    }

    if (this.state.maxCostPerRoute 
      && this.state.maxCostPerRoute !== 0) {
      maxCapacities.push({
        max: this.state.maxCostPerRoute,
        parameter: CapacityParameters.COST,
        type: CapacityParametersTypes.STATIC
      });
    }

    if (this.state.maxPackagesNumberPerRoute 
      && this.state.maxPackagesNumberPerRoute !== 0) {
      maxCapacities.push({
        max: this.state.maxPackagesNumberPerRoute,
        parameter: CapacityParameters.PACKAGE_NUMBER,
        type: CapacityParametersTypes.STATIC
      });
    }

    if (this.state.maxPackagesPricePerRoute 
      && this.state.maxPackagesPricePerRoute !== 0) {
      maxCapacities.push({
        max: this.state.maxPackagesPricePerRoute,
        parameter: CapacityParameters.PACKAGE_PRICE,
        type: CapacityParametersTypes.STATIC
      });
    }

    if (this.state.maxDistancePerRoute
      && this.state.maxDistancePerRoute !== 0) {
      maxCapacities.push({
        max: Number(this.state.maxDistancePerRoute) * 1000,
        parameter: CapacityParameters.DISTANCE,
        type: CapacityParametersTypes.DYNAMIC
      });
    }

    if (this.state.pickupPerRoute) {
      const usedPickups = [];
      singleDeliveries
        .filter((delivery) => {
          return delivery.getIn(['data', 'activity']) === 'P';
        })
        .map((pickup) => {
          if (!usedPickups.includes(pickup.getIn(['data', 'id']))) {
            const commonPoints = getCommonPoints(singleDeliveries, {
              latitude: pickup.getIn(['data', 'location', 'geopoint', 'latitude']),
              longitude: pickup.getIn(['data', 'location', 'geopoint', 'longitude']),
              type: 'P'
            }).map((point) => {
              if (point.getIn(['data', 'activity']) === 'P') {
                usedPickups.push(point.getIn(['data', 'id']));
              }
              return point.getIn(['data', 'id']);
            }).toJSON();
            if (commonPoints.length > 1) {
              routesGroups.push({
                deliveries: commonPoints
              });
            }
          }
        });
    } else {
      if (!deliveriesToUse.length) {
        deliveriesToUse = singleDeliveries
          .filter((delivery) => {
            return delivery.getIn(['data', 'activity']) === 'P';
          })
          .map((d) => {
            return {
              id: d.getIn(['data', 'id'])
            };
          });
      }
    }
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      clusterizeRoutes(
        {
          cityId: this.props.selectedCities[0],
          userId: this.props.userId,
          maxDeliveriesPerRoute: this.state.maxDeliveriesPerRoute,
          useStrictTimeWindows: this.state.useStrictTimeWindows,
          from: this.props.from,
          to: this.props.to,
          tags: this.props.selectedTags,
          companies: this.props.selectedCompanies,
          deliveries: deliveriesToUse,
          statuses: this.props.selectedStatuses,
          routesGroups,
          maxCapacities
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken
        }
      )
        .then((jobs) => {
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
          } else {
            self.props.loadRoutes({
              from: self.props.from,
              to: self.props.to,
              tags: self.props.selectedTags,
              cities: self.props.selectedCities,
              companies: self.props.selectedCompanies,
              deliveries: self.props.selectedDeliveries,
              statuses: self.props.selectedStatuses
            });
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
  render() {
    return (
      <div className="shy-dialog" onClick={this.props.onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="icon-break"
                  src="https://cdn.shippify.co/icons/icon-new-auto-routing-white.svg"
                  alt=""/>
                { window.translation('Auto-routing') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              {
                this.state.loading &&
                <Loading/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful
                  text={
                    window.translation('Routes created successfully')
                  }/>
              }
              {
                !this.state.loading &&
                this.state.failed &&
                <Error
                  text={window.translation('Something went wrong. Please try again')}/>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                <div>
                  <div>
                    <ReactTooltip
                      place={'top'}/>
                    <span className="shy-modal-footer-description">
                      <span className="shy-modal-footer-description-required">*</span>
                      &nbsp;
                      {
                        window.translation('Fields that are required')
                      }
                    </span>
                    <div className="shy-form-field-label">
                      <div>
                        { window.translation('Maximum number of deliveries per route') }
                      </div>
                      <span className="shy-modal-footer-description-required">*</span>
                      <img
                        className="shy-autorouting-setting-help-mini"
                        src={
                          'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                        }
                        alt=""
                        data-tip={
                          window.translation('This setting create routes with a maximum number of deliveries per route.')
                        }/>
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="number"
                        className={
                          (this.state.maxDeliveriesValidation.length > 0) ?
                            'shy-form-field-input has-error' :
                            'shy-form-field-input'
                        }
                        value={this.state.maxDeliveriesPerRoute}
                        onChange={
                          (e) => {
                            this.handleMaxDeliveriesPerRouteChange(
                              e.target.value
                            );
                          }
                        }
                        onBlur={this.validateMaxDeliveriesPerRoute}/>
                    </div>
                    {
                      (this.state.maxDeliveriesValidation.length > 0) &&
                      <div className="shy-form-error">
                        {
                          window.translation(this.state.maxDeliveriesValidation)
                        }
                      </div>
                    }
                    <div className="shy-form-field-label shy-form-margin-top">
                      <div>
                        { window.translation('Minimum number of deliveries per route') }
                      </div>
                      <img
                        className="shy-autorouting-setting-help-mini"
                        src={
                          'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                        }
                        alt=""
                        data-tip={
                          window.translation('This setting create routes with a minimum number of deliveries per route. ATTENTION: Some tasks could be left out from the routes.')
                        }/>
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="number"
                        className={
                          (this.state.minDeliveriesValidation) ?
                            'shy-form-field-input has-error' :
                            'shy-form-field-input'
                        }
                        value={this.state.minDeliveriesPerRoute}
                        onChange={
                          (e) => {
                            this.handleMinDeliveriesPerRouteChange(
                              e.target.value
                            );
                          }
                        }
                        onBlur={this.validateMinDeliveriesPerRoute}/>
                    </div>
                    {
                      (this.state.minDeliveriesValidation) &&
                      <div className="shy-form-error">
                        {
                          window.translation(this.state.minDeliveriesValidation)
                        }
                      </div>
                    }
                    {
                      false && 
                      <div>
                        <div className="shy-form-field-label shy-form-margin-top">
                          <div>
                            { window.translation('Maximum company price per route') }
                          </div>
                          <img
                            className="shy-autorouting-setting-help-mini"
                            src={
                              'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                            }
                            alt=""
                            data-tip={
                              window.translation('This setting create routes with a maximum company price per route.')
                            }/>
                        </div>
                        <div className="shy-form-field">
                          <input
                            type="number"
                            className="shy-form-field-input"
                            value={this.state.maxPricePerRoute}
                            onChange={
                              (e) => {
                                this.handleMaxPricePerRouteChange(
                                  e.target.value
                                );
                              }
                            }
                            onBlur={this.validateMaxPricePerRoute}/>
                        </div>
                        <div className="shy-form-field-label shy-form-margin-top">
                          <div>
                            { window.translation('Maximum shipper price per route') }
                          </div>
                          <img
                            className="shy-autorouting-setting-help-mini"
                            src={
                              'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                            }
                            alt=""
                            data-tip={
                              window.translaton('This setting create routes with a maximum shipper price per route.')
                            }/>
                        </div>
                        <div className="shy-form-field">
                          <input
                            type="number"
                            className="shy-form-field-input"
                            value={this.state.maxCostPerRoute}
                            onChange={
                              (e) => {
                                this.handleMaxCostPerRouteChange(
                                  e.target.value
                                );
                              }
                            }
                            onBlur={this.validateMaxCostPerRoute}/>
                        </div>
                      </div>
                    }

                    <div className="shy-form-field-label shy-form-margin-top">
                      <div>
                        { window.translation('Maximum distance (km) per route') }
                      </div>
                      <img
                        className="shy-autorouting-setting-help-mini"
                        src={
                          'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                        }
                        alt=""
                        data-tip={
                          window.translation('This setting create routes with a maximum distance in kilometers to travel per route.')
                        }/>
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="number"
                        className="shy-form-field-input"
                        value={this.state.maxDistancePerRoute}
                        onChange={
                          (e) => {
                            this.handleMaxDistancePerRouteChange(
                              e.target.value
                            );
                          }
                        }
                        onBlur={this.validateMaxDistancePerRoute}/>
                    </div>

                    <div className="shy-form-field-label shy-form-margin-top">
                      <div>
                        { window.translation('Maximum packages price per route') }
                      </div>
                      <img
                        className="shy-autorouting-setting-help-mini"
                        src={
                          'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                        }
                        alt=""
                        data-tip={
                          window.translation('This setting create routes with a maximum price within all the packages to transport per route.')
                        }/>
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="number"
                        className="shy-form-field-input"
                        value={this.state.maxPackagesPricePerRoute}
                        onChange={
                          (e) => {
                            this.handleMaxPackagesPricePerRouteChange(
                              e.target.value
                            );
                          }
                        }
                        onBlur={this.validateMaxPackagesPricePerRoute}/>
                    </div>

                    <div className="shy-form-field-label shy-form-margin-top">
                      { window.translation('Maximum packages number per route') }
                      <img
                        className="shy-autorouting-setting-help-mini"
                        src={
                          'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                        }
                        alt=""
                        data-tip={
                          window.translation('This setting create routes with a maximum number of packages to transport per route.')
                        }/>
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="number"
                        className="shy-form-field-input"
                        value={this.state.maxPackagesNumberPerRoute}
                        onChange={
                          (e) => {
                            this.handlemaxPackagesNumberPerRouteChange(
                              e.target.value
                            );
                          }
                        }
                        onBlur={this.validatemaxPackagesNumberPerRoute}/>
                    </div>

                    <div
                      className="shy-form-selection-box"
                      onClick={this.togglePickupPerRoute}>
                      <div className="shy-autorouting-setting">
                        <div
                          className="shy-autorouting-setting-text">
                          { window.translation('Create one route per pickup place') }
                        </div>
                        <img
                          className="shy-autorouting-setting-help-mini"
                          src={
                            'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                          }
                          alt=""
                          data-tip={
                            window.translation('This setting creates one route per common pickup place if the place have more than one single deliveries associated')
                          }/>
                      </div>
                      <img
                        src={
                          this.state.pickupPerRoute ?
                            'https://cdn.shippify.co/images/img-checkbox-on.svg' :
                            'https://cdn.shippify.co/images/img-checkbox-off.svg'
                        }
                        alt=""/>
                    </div>

                    <div
                      className="shy-form-selection-box"
                      onClick={this.toggleuseStrictTimeWindows}>
                      <div className="shy-autorouting-setting">
                        <div
                          className="shy-autorouting-setting-text">
                          { 
                            window.translation('Use pickup and dropoff time windows') 
                          }
                        </div>
                        <img
                          className="shy-autorouting-setting-help-mini"
                          src={
                            'https://cdn.shippify.co/icons/icon-help-mini-gray.svg'
                          }
                          alt=""
                          data-tip={
                            window.translation('This setting create routes strictly using pickup and dropoff times of each task. ATTENTION: Some tasks could be left out from the routes.')
                          }/>
                      </div>
                      <img
                        src={
                          this.state.useStrictTimeWindows ?
                            'https://cdn.shippify.co/images/img-checkbox-on.svg' :
                            'https://cdn.shippify.co/images/img-checkbox-off.svg'
                        }
                        alt=""/>
                    </div>

                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-default"
                      onClick={this.props.onClose}>
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={this.clusterizeRoutesRequest}>
                      { window.translation('APPLY') }
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
const mapStateToProps = (state) => {
  return {
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    singleDeliveries: state.getIn(['routes', 'data'])
      .filter((r) => (r.get('id') === 'Single'))
      .first()
      .getIn(['schedule'])
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
)(Autorouting);
