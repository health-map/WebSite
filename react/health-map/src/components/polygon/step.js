/**
 * @file step.js
 * @description Polygon step component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/polygon';
import { actions as routesActions } from './../../actions/routes';

import './step.css';


/**
 *
 */
class Step extends React.Component {
  render() {
    const {
      data, color, polygonId, removeDeliveryFromPolygon, selectStep
    } = this.props;
    return (
      <div
        className="step"
        style={{
          border: `2px solid ${color}`
        }}
        onClick={(e) => {
          selectStep(
            'Single',
            data.get('id'),
            (data.get('activityType') === 'pickup') ?
              'P' :
              'D'
          );
          e.stopPropagation();
        }}>
        <div className="step-header">
          <div className="step-header-id">
            { data.get('id') }
          </div>
          <img
            className="icon-close"
            src="https://cdn.shippify.co/icons/icon-close-gray.svg"
            alt=""
            onClick={(e) => {
              removeDeliveryFromPolygon(polygonId, data.get('id'));
              e.stopPropagation();
            }}/>
        </div>
        <div className="step-body">
          <div className="step-body-delivery-address">
            <div className="delivery-address-label">
              { window.translation('Delivery Address') }
            </div>
            <div className="delivery-address-content">
              { data.getIn(['dropoff', 'location', 'address']) }
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
const mapDispatchToProps = dispatch => bindActionCreators({
  selectStep: routesActions.selectStep,
  removeDeliveryFromPolygon: actions.removeDeliveryFromPolygon
}, dispatch);


/**
 *
 */
export default connect(
  null,
  mapDispatchToProps
)(Step);
