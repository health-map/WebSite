/**
 * @file routeDetailFooterMenu.js
 * @description Footer menu for the route detail component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/routes';

import './routeDetailFooterMenu.css';

/**
 *
 */
class RouteDetailFooterMenu extends React.Component {
  render() {
    const {
      routeId, toggleFooterMenu, selectRouteIdToAssign, setListWidth,
      selectRouteIdToAddDeliveries, selectRouteIdToDivide
    } = this.props;
    return (
      <div
        className="footer-menu"
        onMouseLeave={() => toggleFooterMenu()}>
        <div
          className="footer-menu-item"
          onClick={() => {
            setListWidth(0);
            toggleFooterMenu();
            selectRouteIdToAddDeliveries(routeId);
          }}>
          <img
            src="https://cdn.shippify.co/icons/icon-add-circle-gray.svg"
            className="icon-add-circle"
            alt=""/>
          <span className="footer-menu-item-label">
            {
              window.translation('Add Deliveries')
            }
          </span>
        </div>
        <div
          className="footer-menu-item"
          onClick={() => {
            toggleFooterMenu();
            selectRouteIdToAssign(routeId);
          }}>
          <img
            src="https://cdn.shippify.co/icons/icon-person-add-gray.svg"
            className="icon-person-add"
            alt=""/>
          <span className="footer-menu-item-label">
            {
              window.translation('Assign Manually')
            }
          </span>
        </div>
        <div
          className="footer-menu-item"
          onClick={() => {
            setListWidth(0);
            toggleFooterMenu();
            selectRouteIdToDivide(routeId);
          }}>
          <img
            src="https://cdn.shippify.co/icons/icon-new-polygon-gray.svg"
            className="icon-divide-route"
            alt=""/>
          <span className="footer-menu-item-label">
            {
              window.translation('Divide Route')
            }
          </span>
        </div>
      </div>
    );
  }
}


/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectRouteIdToAddDeliveries: actions.selectRouteIdToAddDeliveries,
  selectRouteIdToDivide: actions.selectRouteIdToDivide
}, dispatch);

/**
 *
 */
export default connect(
  null,
  mapDispatchToProps
)(RouteDetailFooterMenu);
