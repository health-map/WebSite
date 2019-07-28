/**
 * @file suggestedDelivery.js
 * @description Suggested Delivery card
 *
 */

import React from 'react';
import { Popup } from 'react-mapbox-gl';

import { PackageLabel } from './../../constants';

import './suggestedDeliveryCard.css';


/**
 *
 */
class SuggestedDeliveryCard extends React.Component {
  render() {
    const {
      data, activity, onClose, addDelivery, removeDelivery, isAdded
    } = this.props;

    return (
      <Popup
        coordinates={
          (activity === 'pickup') ?
            [
              data.getIn(['pickup', 'location', 'lng']),
              data.getIn(['pickup', 'location', 'lat'])
            ] :
            [
              data.getIn(['dropoff', 'location', 'lng']),
              data.getIn(['dropoff', 'location', 'lat'])
            ]
        }
        className="suggested-delivery-card">
        <div
          className="suggested-delivery-card-header"
          style={{
            color: '#fff',
            backgroundColor: isAdded ? '#12ce66' : '#1fb6ff'
          }}>
          <span className="delivery-card-id">
            { data.get('id') }
          </span>
          <span
            className="delivery-card-close"
            onClick={() => onClose()}>
            <img
              src="https://cdn.shippify.co/icons/icon-close-gray.svg"
              alt=""/>
          </span>
        </div>
        <div className="suggested-delivery-card-body">
          <div className="suggested-delivery-content">
            <img
              src="https://cdn.shippify.co/icons/icon-paste-gray.svg"
              alt=""
              className="icon-paste"/>
            <div>
              <div className="suggested-delivery-card-detail">
                { data.get('id') }
              </div>
              <div className="suggested-delivery-card-label">
                { window.translation('Delivery ID') }
              </div>
            </div>
          </div>
          <div className="suggested-delivery-content">
            <img
              src="https://cdn.shippify.co/icons/icon-place-gray.svg"
              alt=""
              className="icon-location"/>
            {
              (activity === 'pickup') ?
                <div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['pickup', 'location', 'address']) }
                  </div>
                  <div className="suggested-delivery-card-label">
                    { window.translation('Pickup address') }
                  </div>
                </div> :
                <div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['dropoff', 'location', 'address']) }
                  </div>
                  <div className="suggested-delivery-card-label">
                    { window.translation('Dropoff address') }
                  </div>
                </div>
            }
          </div>
          <div className="suggested-delivery-content">
            <img
              src="https://cdn.shippify.co/icons/icon-user-gray.svg"
              alt=""
              className="icon-contact"/>
            {
              (activity === 'pickup') ?
                <div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['pickup', 'contact', 'name']) }
                  </div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['pickup', 'contact', 'email'], '') }
                  </div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['pickup', 'contact', 'phonenumber'], '') }
                  </div>
                  <div className="suggested-delivery-card-label">
                    { window.translation('Sender') }
                  </div>
                </div> :
                <div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['dropoff', 'contact', 'name']) }
                  </div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['dropoff', 'contact', 'email'], '') }
                  </div>
                  <div className="suggested-delivery-card-detail">
                    { data.getIn(['dropoff', 'contact', 'phonenumber'], '') }
                  </div>
                  <div className="suggested-delivery-card-label">
                    { window.translation('Recipient') }
                  </div>
                </div>
            }
          </div>
          {
            data.has('packages') &&
            <div className="suggested-delivery-content margin-bottom-16">
              <img
                src="https://cdn.shippify.co/icons/icon-package-gray.svg"
                alt=""
                className="icon-packages"/>
              <div className="full-width">
                {
                  data.get('packages').map((p, idx) => {
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
                              p.get('price') :
                              '---'
                          }
                        </span>
                      </div>
                    );
                  }).toArray()
                }
              </div>
            </div>
          }
        </div>
        <div
          className="suggested-delivery-card-footer"
          onClick={
            isAdded ?
              () => removeDelivery(data.get('id')) :
              () => addDelivery(data.get('id'))
          }>
          {
            isAdded ?
              <span className="flex flex-vertical-center">
                <img
                  src="https://cdn.shippify.co/icons/icon-remove-gray.svg"
                  alt=""
                  className="margin-right-16"/>
                {
                  window.translation('REMOVE')
                }
              </span> :
              <span className="flex flex-vertical-center">
                <img
                  src="https://cdn.shippify.co/icons/icon-add-gray.svg"
                  alt=""
                  className="margin-right-16"/>
                {
                  window.translation('ADD')
                }
              </span>
          }
        </div>
      </Popup>
    );
  }
}


export default SuggestedDeliveryCard;
