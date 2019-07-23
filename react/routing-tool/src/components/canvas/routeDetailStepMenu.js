/**
 * @file routeDetailStepMenu.js
 * @description Menu for a step in Route Detail
 *
 */

import React from 'react';

import './routeDetailStepMenu.css';


/**
 *
 */
export default class RouteDetailStepMenu extends React.Component {
  render() {
    const {
      deliveryId, toggleMenu, selectDeliveryIdToRemoveFromRoute,
      selectDeliveryIdToMoveToAnotherRoute
    } = this.props;
    return (
      <div
        className="route-delivery-menu"
        onMouseLeave={() => toggleMenu()}>
        <div
          className="route-delivery-menu-item"
          onClick={(e) => {
            selectDeliveryIdToRemoveFromRoute(deliveryId);
            e.stopPropagation();
          }}>
          <img
            className="icon-remove-circle"
            src="https://cdn.shippify.co/icons/icon-remove-gray.svg"
            alt=""/>
          <span className="route-delivery-menu-item-label">
            { window.translation('Remove from route') }
          </span>
        </div>
        <div
          className="route-delivery-menu-item"
          onClick={(e) => {
            selectDeliveryIdToMoveToAnotherRoute(deliveryId);
            e.stopPropagation();
          }}>
          <img
            className="icon-remove-circle"
            src="https://cdn.shippify.co/icons/icon-change-status-gray.svg"
            alt=""/>
          <span className="route-delivery-menu-item-label">
            { window.translation('Move to another route') }
          </span>
        </div>
      </div>
    );
  }
}
