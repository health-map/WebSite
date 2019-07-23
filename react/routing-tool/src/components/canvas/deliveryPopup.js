/**
 * @file deliveryPopup.js
 * @description Delivery Popup. Used por pickups and dropoffs
 *
 */

import React from 'react';
import Immutable from 'immutable';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { Popup } from 'react-mapbox-gl';
import { bindActionCreators } from 'redux';

import { PackageLabel } from './../../constants';
import { actions } from './../../actions/routes';
import { thunks } from './../../actions/thunks/routes';
const { loadDeliveryPath: loadDeliveryPathRequest } = thunks;

import { getCommonPoints } from './../../services/utils';

import './deliveryPopup.css';


/**
 *
 */
const getDeliveryType = (key) => {
  switch (key) {
  case 'slot':
    return 'Regular';
  case 'express':
    return 'Express';
  case 'flex':
    return 'Flex';
  default:
    return 'Regular';
  }
};


/**
 *
 */
class DeliveryPopup extends React.Component {
  componentDidMount() {
    const { delivery, loadDeliveryPath } = this.props;
    if (!delivery.has('path') && delivery.get('routeId') === 'Single') {
      loadDeliveryPath(
        delivery.get('id'),
        [
          {
            latitude: delivery.getIn(['pickup', 'location', 'latitude']),
            longitude: delivery.getIn(['pickup', 'location', 'longitude'])
          },
          {
            latitude: delivery.getIn(['dropoff', 'location', 'latitude']),
            longitude: delivery.getIn(['dropoff', 'location', 'longitude'])
          }
        ]
      );
    }
  }
  applyCommonLocationFilter = (delivery) => {
    this.props.filterStep(delivery);
    const deliveryActivityType = (delivery.get('activityType') === 'P') ?
      'pickup' : 'dropoff';
    const deliveries = getCommonPoints(
      this.props.deliveries,
      {
        latitude: delivery.getIn([deliveryActivityType, 'location', 'latitude']),
        longitude: delivery.getIn([deliveryActivityType, 'location', 'longitude']),
        type: delivery.get('activityType')
      },
    ).map((point) => {
      const pointId = point.getIn(['data', 'id']);
      const pointReferenceId = point.getIn(['data', 'orderId']);
      return {
        id: pointId,
        name: pointReferenceId ? `${pointId} - ${pointReferenceId}` : pointId
      };
    }).toArray();
    this.props.applyFilters(
      {
        cities: this.props.selectedCities,
        companies: this.props.selectedCompanies,
        deliveries: deliveries,
        tags: this.props.selectedTags,
        from: this.props.from,
        to: this.props.to,
        statuses: this.props.selectedStatuses
      }
    );
    this.props.selectStep();
  }
  render() {
    const {
      delivery, selectStep, routeColor, stepColor, selectedRouteToReorder,
      selectedRouteIdToAddDeliveries, selectedRoute
    } = this.props;
    const color = (stepColor === routeColor) ? routeColor : stepColor;
    return (
      <Popup
        coordinates={
          (delivery.get('activityType') === 'P') ?
            [
              delivery.getIn(['pickup', 'location', 'longitude']),
              delivery.getIn(['pickup', 'location', 'latitude'])
            ] :
            [
              delivery.getIn(['dropoff', 'location', 'longitude']),
              delivery.getIn(['dropoff', 'location', 'latitude'])
            ]
        }
        className="delivery-popup">
        <div
          className="delivery-popup-header"
          style={{
            backgroundColor: selectedRouteIdToAddDeliveries ? '#ef404b' : color
          }}>
          <ReactTooltip
            place={'top'}/>
          <span className="delivery-popup-id">
            {
              (delivery.get('activityType') === 'P') ?
                window.translation('Pickup') :
                window.translation('Dropoff')
            }
          </span>
          {
            !selectedRouteToReorder &&
            !selectedRoute &&
            !selectedRouteIdToAddDeliveries &&
            (delivery.get('routeId') === 'Single') &&
            <span
              className="delivery-popup-filter"
              data-tip={
                window.translation('Click here to filter all the deliveries with common place of') +
                ((delivery.get('activityType') === 'P') ?
                  ` ${window.translation('Pickup')} ` :
                  ` ${window.translation('Dropoff')} `) +
                window.translation('on this point')
              }
              onClick={() => {
                this.applyCommonLocationFilter(delivery);
              } }>
              <img
                src="https://cdn.shippify.co/icons/icon-filter-gray.svg"
                alt=""/>
            </span>
          }
          <span
            className="delivery-popup-close"
            onClick={() => selectStep()}>
            <img
              src="https://cdn.shippify.co/icons/icon-close-gray.svg"
              alt=""/>
          </span>
        </div>
        <div className="delivery-popup-body">
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-paste-gray.svg"
              alt=""
              className="icon-paste"/>
            <div className="delivery-popup-double">
              <div>
                <div className="delivery-popup-detail">
                  { delivery.get('id') }
                </div>
                <div className="delivery-popup-label">
                  { window.translation('Delivery ID') }
                </div>
              </div>
              {
                delivery.get('referenceId', '') &&
                <div className="text-align-right">
                  <div className="delivery-popup-detail">
                    { delivery.get('referenceId') }
                  </div>
                  <div className="delivery-popup-label">
                    { window.translation('Reference Id') }
                  </div>
                </div>
              }
            </div>
          </div>
          {
            (delivery.get('routeId') !== 'Single') &&
            <div className="delivery-popup-content">
              <img
                src="https://cdn.shippify.co/icons/icon-routing-merge-gray.svg"
                alt=""
                className="icon-routing-merge"/>
              <div>
                <div className="delivery-popup-detail">
                  { delivery.get('routeId') }
                </div>
                <div className="delivery-popup-label">
                  { window.translation('Route ID') }
                </div>
              </div>
            </div>
          }
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-company-gray.svg"
              alt=""
              className="icon-company"/>
            <div className="delivery-popup-double">
              <div>
                <div className="delivery-popup-detail">
                  { delivery.getIn(['company', 'name'])}
                </div>
                <div className="delivery-popup-label">
                  { window.translation('Company') }
                </div>
              </div>
              <div className="text-align-right">
                <div className="delivery-popup-detail">
                  { delivery.getIn(['company', 'id'])}
                </div>
                <div className="delivery-popup-label">
                  { window.translation('Company ID') }
                </div>
              </div>
            </div>
          </div>
          {
            delivery.get('deliveryType') &&
            <div className="delivery-popup-content">
              <img
                src="https://cdn.shippify.co/icons/icon-shopping-basket-gray.svg"
                alt=""
                className="icon-shopping-basket"/>
              <div>
                <div className="delivery-popup-detail">
                  {
                    window.translation(
                      getDeliveryType(delivery.get('deliveryType'))
                    )
                  }
                </div>
                <div className="delivery-popup-label">
                  { window.translation('Delivery type') }
                </div>
              </div>
            </div>
          }
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-place-gray.svg"
              alt=""
              className="icon-location"/>
            <div>
              <div className="delivery-popup-detail">
                {
                  (delivery.get('activityType') === 'P') ?
                    delivery.getIn(['pickup', 'location', 'address']) :
                    delivery.getIn(['dropoff', 'location', 'address'])
                }
              </div>
              <div className="delivery-popup-label">
                {
                  (delivery.get('activityType') === 'P') ?
                    window.translation('Pickup address') :
                    window.translation('Dropoff address')
                }
              </div>
            </div>
          </div>
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-bookmark-gray.svg"
              alt=""
              className="icon-note"/>
            <div>
              <div className="delivery-popup-detail">
                {
                  (delivery.get('activityType') === 'P') ?
                    delivery.getIn(
                      ['pickup', 'location', 'instructions'],
                      window.translation('No Instructions')
                    ) :
                    delivery.getIn(
                      ['dropoff', 'location', 'instructions'],
                      window.translation('No Instructions')
                    )
                }
              </div>
              <div className="delivery-popup-label">
                {
                  window.translation('Notes')
                }
              </div>
            </div>
          </div>
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-user-gray.svg"
              alt=""
              className="icon-contact"/>
            <div>
              <div>
                <div className="delivery-popup-detail">
                  {
                    (delivery.get('activityType') === 'P') ?
                      delivery.getIn(['pickup', 'contact', 'name']) :
                      delivery.getIn(['dropoff', 'contact', 'name'])
                  }
                </div>
                {
                  (delivery.get('activityType') === 'P') &&
                  delivery.getIn(['pickup', 'contact', 'email'], '') &&
                  <div className="delivery-popup-detail">
                    {
                      delivery.getIn(['pickup', 'contact', 'email'], '')
                    }
                  </div>
                }
                {
                  (delivery.get('activityType') === 'P') &&
                  delivery.getIn(['pickup', 'contact', 'phonenumber'], '') &&
                  <div className="delivery-popup-detail">
                    {
                      delivery.getIn(['pickup', 'contact', 'phonenumber'], '')
                    }
                  </div>
                }
                {
                  (delivery.get('activityType') === 'P') &&
                  delivery.getIn(['dropoff', 'contact', 'email'], '') &&
                  <div className="delivery-popup-detail">
                    {
                      delivery.getIn(['dropoff', 'contact', 'email'], '')
                    }
                  </div>
                }
                {
                  (delivery.get('activityType') === 'P') &&
                  delivery.getIn(['dropoff', 'contact', 'phonenumber'], '') &&
                  <div className="delivery-popup-detail">
                    {
                      delivery.getIn(['dropoff', 'contact', 'phonenumber'], '')
                    }
                  </div>
                }
              </div>
              <div className="delivery-popup-label">
                {
                  (delivery.get('activityType') === 'P') ?
                    window.translation('Sender') :
                    window.translation('Recipient')
                }
              </div>
            </div>
          </div>
          {
            delivery.get('packages') &&
            <div className="delivery-popup-content">
              <img
                src="https://cdn.shippify.co/icons/icon-package-gray.svg"
                alt=""
                className="icon-packages"/>
              <div className="full-width">
                {
                  delivery.get('packages').map((p, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          'backgroundColor': (idx % 2)
                            ? '#f7f7f7' : '#fff'
                        }}
                        className="popup-package">
                        <span className="package-name">
                          { p.get('name') }
                        </span>
                        <span className="package-size">
                          { PackageLabel[p.get('size')] }
                        </span>
                        <span className="package-quantity">
                          { p.get('quantity')}
                        </span>
                        <span className="package-weight">
                          {
                            p.get('weight') ?
                              `${p.get('weight')} Kg` :
                              '---'
                          }
                        </span>
                        <span className="package-price">
                          {
                            p.get('price') ?
                              `${delivery.get('currencyCode')} ${p.get('price')}` :
                              '---'
                          }
                        </span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          }
        </div>
      </Popup>
    );
  }
}

/**
 *
 */
const mapStateToProps = (state) => {
  const selectedStep = state.getIn(['routes', 'selectedStep']);
  const route = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === selectedStep.routeId))
    .first();
  let delivery;
  const deliveries = route.get('schedule');
  if (route.get('deliveries')) {
    for (var i=0; i<route.get('deliveries').size; i++) {
      if (route.getIn(['deliveries', i, 'id']) === selectedStep.deliveryId) {
        const d = route.getIn(['deliveries', i]);
        delivery = Immutable.fromJS({
          id: d.get('id'),
          routeId: route.get('id'),
          referenceId: d.get('referenceId'),
          pickup: {
            location: {
              address: d.getIn(['pickup', 'location', 'address']),
              instructions: d.getIn(
                ['pickup', 'extras'],
                Immutable.List()
              ).toJSON().join(', '),
              latitude: d.getIn(['pickup', 'location', 'latitude']),
              longitude: d.getIn(['pickup', 'location', 'longitude'])
            },
            contact: {
              email: d.getIn(['pickup', 'contact', 'email']),
              name: d.getIn(['pickup', 'contact', 'name']),
              phonenumber: d.getIn(['pickup', 'contact', 'phonenumber'])
            }
          },
          dropoff: {
            location: {
              address: d.getIn(['dropoff', 'location', 'address']),
              instructions: d.getIn(
                ['dropoff', 'extras'],
                Immutable.List()
              ).toJSON().join(', '),
              latitude: d.getIn(['dropoff', 'location', 'latitude']),
              longitude: d.getIn(['dropoff', 'location', 'longitude'])
            },
            contact: {
              email: d.getIn(['dropoff', 'contact', 'email']),
              name: d.getIn(['dropoff', 'contact', 'name']),
              phonenumber: d.getIn(['dropoff', 'contact', 'phonenumber'])
            }
          },
          company: {
            id: d.getIn(['company', 'id']),
            name: d.getIn(['company', 'name'])
          },
          activityType: selectedStep.activityType,
          packages: d.getIn(['packages', 'contents']),
          currencyCode: d.getIn(['fare', 'currencyCode'])
        });
        break;
      }
    }
  } else {
    for (var j=0; j<route.get('schedule').size; j++) {
      if (
        route.getIn(['schedule', j, 'data', 'id']) ===
        selectedStep.deliveryId
      ) {
        const d = route.getIn(['schedule', j, 'data']);
        if (!delivery) {
          delivery = Immutable.fromJS({
            id: d.get('id'),
            routeId: route.get('id'),
            referenceId: d.get('orderId'),
            company: {
              id: d.getIn(['company', 'id']),
              name: d.getIn(['company', 'name'])
            },
            activityType: selectedStep.activityType,
            deliveryType: d.get('deliveryType')
          });
        }
        if (route.getIn(['schedule', j, 'data', 'activity']) === 'P') {
          delivery = delivery.set('pickup', Immutable.fromJS({
            location: {
              address: d.getIn(['location', 'address']),
              instructions: d.get('extra'),
              latitude: d.getIn(['location', 'geopoint', 'latitude']),
              longitude: d.getIn(['location', 'geopoint', 'longitude'])
            },
            contact: {
              email: d.getIn(['contact', 'email']),
              name: d.getIn(['contact', 'name']),
              phonenumber: d.getIn(['contact', 'phone'])
            }
          }));
        }
        if (route.getIn(['schedule', j, 'data', 'activity']) === 'D') {
          delivery = delivery.set('dropoff', Immutable.fromJS({
            location: {
              address: d.getIn(['location', 'address']),
              instructions: d.get('extra'),
              latitude: d.getIn(['location', 'geopoint', 'latitude']),
              longitude: d.getIn(['location', 'geopoint', 'longitude'])
            },
            contact: {
              email: d.getIn(['contact', 'email']),
              name: d.getIn(['contact', 'name']),
              phonenumber: d.getIn(['contact', 'phone'])
            }
          }));
        }
      }
    }
  }
  let stepColor = selectedStep.color ? selectedStep.color : route.get('color');
  const stepsInsidePolygons = state.getIn(['polygon', 'steps'])
    .filter(s => s.get('polygonId'));
  if (stepsInsidePolygons.size) {
    for (let x=0; x<stepsInsidePolygons.size; x++) {
      if (stepsInsidePolygons.getIn([x, 'id']) === delivery.get('id')) {
        stepColor = stepsInsidePolygons.getIn([x, 'color']);
        break;
      }
    }
  }

  return {
    delivery,
    deliveries,
    stepColor,
    routeColor: route.get('color'),
    selectedRouteIdToAddDeliveries: state.getIn(
      ['routes', 'selectedRouteIdToAddDeliveries']
    )
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectStep: actions.selectStep,
  loadDeliveryPath: loadDeliveryPathRequest,
  filterStep: actions.filterStep
}, dispatch);

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryPopup);
