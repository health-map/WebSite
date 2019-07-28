/**
 * @file deliveryPopup.js
 * @description Delivery Popup. Used por pickups and dropoffs
 *
 */

import React from 'react';

import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { Popup } from 'react-mapbox-gl';
import { bindActionCreators } from 'redux';

import './deliveryPopup.css';

/**
 *
 */
class DeliveryPopup extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <Popup
        coordinates={
          [
            79.0000,
            -2.0000
          ] 
        }
        className="delivery-popup">
        <div
          className="delivery-popup-header"
          style={{
            backgroundColor: '#ef404b'
          }}>
          <ReactTooltip
            place={'top'}/>
          <span className="delivery-popup-id">
            {
              'Poligono'
            }
          </span>
          <span className="delivery-popup-close">
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
                  { 'id' }
                </div>
                <div className="delivery-popup-label">
                  { 'delivery ID' }
                </div>
              </div>
            </div>
          </div>
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-company-gray.svg"
              alt=""
              className="icon-company"/>
            <div className="delivery-popup-double">
              <div>
                <div className="delivery-popup-detail">
                  { 'company_'}
                </div>
                <div className="delivery-popup-label">
                  { 'company' }
                </div>
              </div>
              <div className="text-align-right">
                <div className="delivery-popup-detail">
                  { 'id_'}
                </div>
                <div className="delivery-popup-label">
                  { 'company id' }
                </div>
              </div>
            </div>
          </div>
          <div className="delivery-popup-content">
            <img
              src="https://cdn.shippify.co/icons/icon-place-gray.svg"
              alt=""
              className="icon-location"/>
            <div>
              <div className="delivery-popup-detail">
                {
                  'direccion'
                }
              </div>
              <div className="delivery-popup-label">
                {
                  'Direccion 2'
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
                  'notas'
                }
              </div>
              <div className="delivery-popup-label">
                {
                  'Notas'
                }
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

/**
 *
 */
const mapStateToProps = () => {
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch);

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryPopup);
