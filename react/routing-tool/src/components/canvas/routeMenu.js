/**
 * @file routeMenu.cs
 * @description Menu for the route component
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/routes';

import './routeMenu.css';


/**
 *
 */
class RouteMenu extends React.Component {
  isAddDeliveriesToRouteEnabled = () => {
    return (this.props.routeId !== 'Single');
  }
  isAssignManuallyEnabled = () => {
    return (this.props.routeId !== 'Single');
  }
  render() {
    const {
      routeId, selectRouteIdToAssign, toggleRouteMenu, setListWidth,
      selectRouteIdToAddDeliveries, selectRouteIdToDivide, selectRoute,
      selectRouteIdToAutoMerge
    } = this.props;
    return (
      <div
        className="route-menu"
        onMouseLeave={() => toggleRouteMenu()}>
        <div
          className={
            this.isAddDeliveriesToRouteEnabled() ?
              'route-menu-item' :
              'route-menu-item route-menu-item-disabled'
          }
          onClick={
            this.isAddDeliveriesToRouteEnabled() ?
              (e) => {
                setListWidth(0);
                toggleRouteMenu();
                selectRouteIdToAddDeliveries(routeId);
                e.stopPropagation();
              } :
              () => {}
          }>
          <img
            src="https://cdn.shippify.co/icons/icon-add-circle-gray.svg"
            className="icon-add-circle"
            alt=""/>
          <span className="route-menu-item-label">
            {
              window.translation('Add Deliveries')
            }
          </span>
        </div>
        <div
          className={
            this.isAssignManuallyEnabled() ?
              'route-menu-item' :
              'route-menu-item route-menu-item-disabled'
          }
          onClick={
            this.isAssignManuallyEnabled() ?
              (e) => {
                toggleRouteMenu();
                selectRouteIdToAssign(routeId);
                e.stopPropagation();
              } :
              () => {}
          }>
          <img
            src="https://cdn.shippify.co/icons/icon-person-add-gray.svg"
            className="icon-person-add"
            alt=""/>
          <span className="route-menu-item-label">
            {
              window.translation('Assign Manually')
            }
          </span>
        </div>
        <div
          className={
            this.isAddDeliveriesToRouteEnabled() ?
              'route-menu-item' :
              'route-menu-item route-menu-item-disabled'
          }
          onClick={
            this.isAddDeliveriesToRouteEnabled() ?
              (e) => {
                setListWidth(0);
                toggleRouteMenu();
                selectRoute(routeId);
                selectRouteIdToDivide(routeId);
                e.stopPropagation();
              } :
              () => {}
          }>
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
        <div
          className={
            this.isAddDeliveriesToRouteEnabled() ?
              'route-menu-item' :
              'route-menu-item route-menu-item-disabled'
          }
          onClick={
            this.isAddDeliveriesToRouteEnabled() ?
              (e) => {
                selectRouteIdToAutoMerge(routeId);
                e.stopPropagation();
              } :
              () => {}
          }>
          <img
            src="https://cdn.shippify.co/icons/icon-routing-merge-gray.svg"
            className="icon-divide-route"
            alt=""/>
          <span className="footer-menu-item-label">
            {
              window.translation('Merge Recommendation')
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
  selectRouteIdToDivide: actions.selectRouteIdToDivide,
  selectRoute: actions.selectRoute
}, dispatch);

/**
 *
 */
export default connect(
  null,
  mapDispatchToProps
)(RouteMenu);
