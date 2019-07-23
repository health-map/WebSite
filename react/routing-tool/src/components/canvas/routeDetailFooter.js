/**
 * @file routeDetailFooter.js
 * @description Footer for the Route Detail section
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import RouteDetailFooterMenu from './routeDetailFooterMenu';
import { UserRole, CompanyAccess } from './../../constants';

import './routeDetailFooter.css';

const vehicles = {
  'x-small': 'https://cdn.shippify.co/icons/icon-bike-gray.svg',
  'small': 'https://cdn.shippify.co/icons/icon-moto-gray.svg',
  'medium': 'https://cdn.shippify.co/icons/icon-car-side-gray.svg',
  'large': 'https://cdn.shippify.co/icons/icon-van-gray.svg',
  'x-large': 'https://cdn.shippify.co/icons/icon-truck-gray.svg'
};

/**
 *
 */
class RouteDetailFooter extends React.Component {
  state = {
    isFooterMenuVisible: false
  }
  toggleFooterMenu = () => {
    this.setState({
      isFooterMenuVisible: !this.state.isFooterMenuVisible
    });
  }
  render() {
    const {
      totalRouteDistance, totalChargedDistance, totalDeliveryCost,
      totalServiceCost, currencyCode, minimumCapacity, companyAccess,
      userRole, routeId, selectRouteIdToAssign, containerWidth,
      setListWidth
    } = this.props;
    return (
      <div className="route-detail-footer">
        <div className="route-detail-footer-content">
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (companyAccess !== CompanyAccess.COURIER) &&
            (userRole !== UserRole.VIEWER) &&
            <div className="footer-element">
              <div className="footer-element-value">
                {
                  Number(totalServiceCost).toLocaleString([], {
                    style: 'currency',
                    currency: currencyCode
                  })
                }
              </div>
              <div className="footer-element-label">
                {
                  window.translation('Company price')
                }
              </div>
            </div>
          }
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (companyAccess !== CompanyAccess.COURIER) &&
            (userRole !== UserRole.VIEWER) &&
            <span className="footer-separator"></span>
          }
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (userRole !== UserRole.VIEWER) &&
            <div className="footer-element">
              <div className="footer-element-value">
                {
                  Number(totalDeliveryCost).toLocaleString([], {
                    style: 'currency',
                    currency: currencyCode
                  })
                }
              </div>
              <div className="footer-element-label">
                {
                  window.translation('Driver price')
                }
              </div>
            </div>
          }
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (userRole !== UserRole.VIEWER) &&
            <span className="footer-separator"></span>
          }
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (companyAccess !== CompanyAccess.COURIER) &&
            (userRole !== UserRole.VIEWER) &&
            <div className="footer-element">
              <div className="footer-element-value">
                { `${Math.round10(totalRouteDistance, -2)} km` }
              </div>
              <div className="footer-element-label">
                {
                  window.translation('Total Distance')
                }
              </div>
            </div>
          }
          {
            (companyAccess !== CompanyAccess.BASIC) &&
            (companyAccess !== CompanyAccess.COURIER) &&
            (userRole !== UserRole.VIEWER) &&
            <span className="footer-separator"></span>
          }
          {
            (companyAccess !== CompanyAccess.SAAS) &&
            (userRole !== UserRole.VIEWER) &&
            <div className="footer-element">
              <div className="footer-element-value">
                { `${Math.round10(totalChargedDistance, -2)} km` }
              </div>
              <div className="footer-element-label">
                {
                  window.translation('Total Charged Distance')
                }
              </div>
            </div>
          }
          {
            (userRole !== UserRole.VIEWER) &&
            <span className="footer-separator"></span>
          }
        </div>
        <div className="route-detail-footer-actions">
          <div className="footer-element">
            <img src={vehicles[minimumCapacity]} alt=""/>
          </div>
          <img
            src="https://cdn.shippify.co/icons/icon-vertical-menu-gray.svg"
            alt=""
            className="icon-vertical-menu"
            onClick={() => this.toggleFooterMenu()}/>
          {
            this.state.isFooterMenuVisible &&
            <RouteDetailFooterMenu
              routeId={routeId}
              setListWidth={setListWidth}
              containerWidth={containerWidth}
              toggleFooterMenu={this.toggleFooterMenu}
              selectRouteIdToAssign={selectRouteIdToAssign}/>
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
  const route = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteId'])))
    .first();
  const totalRouteDistance = route.getIn(['distances', 'routeDistances'], [])
    .reduce((computedRouteDistance, distance) => {
      return computedRouteDistance + distance;
    }, 0);
  const totalChargedDistance = route.getIn(
    ['distances', 'chargedDistances'], []
  )
    .reduce((computedChargedDistance, distance) => {
      return computedChargedDistance + distance;
    }, 0);
  const totalDeliveryCost = route.get('deliveries', [])
    .map(delivery => delivery.getIn(['fare', 'delivery']))
    .reduce((computedDeliveryCost, delivery) =>  {
      return computedDeliveryCost + delivery;
    }, 0);
  const totalServiceCost = route.get('deliveries', [])
    .map(delivery => delivery.getIn(['fare', 'service']))
    .reduce((computedServiceCost, serviceCost) =>  {
      return computedServiceCost + serviceCost;
    }, 0);
  return {
    totalRouteDistance,
    totalChargedDistance,
    totalDeliveryCost,
    totalServiceCost,
    currencyCode: route.getIn(['deliveries', 0, 'fare', 'currency'], 'USD'),
    minimumCapacity: route.get('minimumCapacity', 'x-small'),
    companyAccess: state.getIn(['general', 'user', 'companyAccess']),
    userRole: state.getIn(['general', 'user', 'role'])
  };
};

/**
 *
 */
export default connect(
  mapStateToProps
)(RouteDetailFooter);
