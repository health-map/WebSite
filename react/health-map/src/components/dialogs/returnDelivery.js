/**
 * @file returnDelivery.js
 * @description Return delivery dialog. Creates a delivery with the last and
 *              first stops of a route.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Error from './../shared/error';
import Loading from './../shared/loading';
import Successful from './../shared/successful';
import { createReturnDelivery } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;


import './returnDelivery.css';


/**
 *
 */
class ReturnDelivery extends React.Component {
  state = {
    productName: '',
    productSize: 3,
    productQuantity: 1,
    productPrice: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    loading: false,
    succeed: false,
    failed: false
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
  handleProductNameChange = (name) => {
    this.setState({
      productName: name
    });
  }
  handleProductSizeChange = (size) => {
    this.setState({
      productSize: ((Number(size)/25) + 1)
    });
  }
  handleProductQuantityChange = (quantity) => {
    this.setState({
      productQuantity: quantity
    });
  }
  handleProductPriceChange = (price) => {
    this.setState({
      productPrice: price
    });
  }
  handleRecipientNameChange = (name) => {
    this.setState({
      recipientName: name
    });
  }
  handleRecipientEmailChange = (email) => {
    this.setState({
      recipientEmail: email
    });
  }
  handleRecipientPhoneChange = (phone) => {
    this.setState({
      recipientPhone: phone
    });
  }
  createReturnDeliveryRequest = () => {
    const { apiUrl, apiToken, routeId } = this.props;
    const self = this;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      createReturnDelivery(
        {
          routeId,
          receiver: {
            name: this.state.recipientName,
            email: this.state.recipientEmail,
            phone: this.state.recipientPhone
          },
          products: [{
            name: this.state.productName,
            qty: this.state.productQuantity,
            size: this.state.productSize,
            price: this.state.productPrice
          }]
        },
        {
          apiUrl,
          apiToken
        },
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
            succeed: true,
            failed: false
          });
        })
        .catch(() => {
          self.setState({
            loading: false,
            succeed: false,
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
                  className="icon-return-delivery"
                  src="https://cdn.shippify.co/icons/icon-return-delivery-write.svg"
                  alt=""/>
                { window.translation('Return delivery') }
              </div>
              <img
                onClick={this.props.onClose}
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""/>
            </div>
            <div className="shy-dialog-body shy-return-delivery-dialog">
              {
                this.state.loading &&
                <Loading mini/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful text={
                  window.translation('Return delivery created successfully')
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
                <div>
                  <div className="shy-return-delivery-dialog-alert">
                    { window.translation('The pickup location will be taken from the last dropoff location of the last step in the route. The dropoff location will be taken from the pickup location of the first step in the route.') }
                  </div>
                  <div>
                    <div className="shy-form-field-label">
                      { window.translation('Choose the package size') }
                    </div>
                    <div className="shy-package-size">
                      <div className="shy-selected-package-size">
                        {
                          (this.state.productSize === 1) &&
                          <img
                            src="https://cdn.shippify.co/dash/import/img/import-x-s.svg"
                            alt=""
                            className="shy-selected-package-size-image"/>
                        }
                        {
                          (this.state.productSize === 2) &&
                          <img
                            src="https://cdn.shippify.co/dash/import/img/import-s.svg"
                            alt=""
                            className="shy-selected-package-size-image"/>
                        }
                        {
                          (this.state.productSize === 3) &&
                          <img
                            src="https://cdn.shippify.co/dash/import/img/import-m.svg"
                            alt=""
                            className="shy-selected-package-size-image"/>
                        }
                        {
                          (this.state.productSize === 4) &&
                          <img
                            src="https://cdn.shippify.co/dash/import/img/import-l.svg"
                            alt=""
                            className="shy-selected-package-size-image"/>
                        }
                        {
                          (this.state.productSize === 5) &&
                          <img
                            src="https://cdn.shippify.co/dash/import/img/import-x-l.svg"
                            alt=""
                            className="shy-selected-package-size-image"/>
                        }
                        <div className="shy-selected-package-size-content">
                          <div className="shy-selected-package-size-title">
                            {
                              (this.state.productSize === 1) &&
                              window.translation('Extra Small')
                            }
                            {
                              (this.state.productSize === 2) &&
                              window.translation('Small')
                            }
                            {
                              (this.state.productSize === 3) &&
                              window.translation('Medium')
                            }
                            {
                              (this.state.productSize === 4) &&
                              window.translation('Large')
                            }
                            {
                              (this.state.productSize === 5) &&
                              window.translation('Extra Large')
                            }
                          </div>
                          <div className="shy-selected-package-size-description">
                            {
                              (this.state.productSize === 1) &&
                              window.translation('Looks like a box that you can hold with one hand')
                            }
                            {
                              (this.state.productSize === 2) &&
                              window.translation('Is about the size of a shoe box')
                            }
                            {
                              (this.state.productSize === 3) &&
                              window.translation('A box that is as big as the length of your arm')
                            }
                            {
                              (this.state.productSize === 4) &&
                              window.translation('A box that is as high as your waist')
                            }
                            {
                              (this.state.productSize === 5) &&
                              window.translation('Boxes that are bigger than your open arms')
                            }
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        step="25"
                        min="0"
                        max="100"
                        onChange={(e) => {
                          this.handleProductSizeChange(e.target.value);
                        }}
                        value={((this.state.productSize - 1)*25)}
                        className="shy-package-size-picker"
                        style={{
                          backgroundImage: '-webkit-gradient(linear, left top, right top, ' +
                            'color-stop(' +
                            ((this.state.productSize-1)*0.25) +
                            ', #ef404b), ' +
                            'color-stop(' +
                            ((this.state.productSize-1)*0.25) +
                            ', #C5C5C5)' +
                            ')'
                        }}/>
                      <div className="shy-package-sizes">
                        <span>
                          { window.translation('Extra Small') }
                        </span>
                        <span>
                          { window.translation('Small') }
                        </span>
                        <span>
                          { window.translation('Medium') }
                        </span>
                        <span>
                          { window.translation('Large') }
                        </span>
                        <span>
                          { window.translation('Extra Large') }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="margin-top-16">
                    <div className="shy-form-field-label">
                      { window.translation('Type the package name') }
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="text"
                        value={this.state.productName}
                        className="shy-form-field-input"
                        onChange={(e) => {
                          this.handleProductNameChange(e.target.value);
                        }}/>
                    </div>
                    <div className="shy-form-field-help">
                      <img
                        src="https://cdn.shippify.co/icons/icon-help-mini-gray.svg"
                        alt=""/>
                      { window.translation('You can use this field for: product name') }
                    </div>
                  </div>
                  <div className="flex margin-top-16">
                    <div className="full-width margin-right-8">
                      <div className="shy-form-field-label">
                        { window.translation('Package quantity') }
                      </div>
                      <div className="shy-form-field">
                        <input
                          type="number"
                          value={this.state.productQuantity}
                          className="shy-form-field-input"
                          onChange={(e) => {
                            this.handleProductQuantityChange(e.target.value);
                          }}/>
                      </div>
                      <div className="shy-form-field-help">
                        <img
                          src="https://cdn.shippify.co/icons/icon-help-mini-gray.svg"
                          alt=""/>
                        { window.translation('Quantity is the number of packages of the order (not the number of products inside the packages).') }
                      </div>
                    </div>
                    <div className="full-width margin-left-8">
                      <div className="shy-form-field-label">
                        { window.translation('Package price') }
                      </div>
                      <div className="shy-form-field">
                        <input
                          type="number"
                          value={this.state.productPrice}
                          className="shy-form-field-input"
                          onChange={(e) => {
                            this.handleProductPriceChange(e.target.value);
                          }}/>
                      </div>
                      <div className="shy-form-field-help">
                        <img
                          src="https://cdn.shippify.co/icons/icon-help-mini-gray.svg"
                          alt=""/>
                        { window.translation('Unit price x quantity') }
                      </div>
                    </div>
                  </div>
                  <div className="shy-recipient-information">
                    <div>
                      <div className="shy-form-field-label">
                        { window.translation('Recipient info') }
                      </div>
                      <div className="flex">
                        <div className="full-width margin-right-8">
                          <div className="shy-form-field">
                            <input
                              type="text"
                              className="shy-form-field-input"
                              value={this.state.recipientEmail}
                              onChange={  (e) => {
                                this.handleRecipientEmailChange(e.target.value);
                              }}
                              placeholder={window.translation('Email')}/>
                          </div>
                        </div>
                        <div className="full-width margin-left-8">
                          <div className="shy-form-field">
                            <input
                              type="text"
                              className="shy-form-field-input"
                              value={this.state.recipientPhone}
                              onChange={(e) => {
                                this.handleRecipientPhoneChange(e.target.value);
                              }}
                              placeholder={window.translation('Phone with city code')}/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="margin-top-16">
                      <div className="shy-form-field">
                        <input
                          type="text"
                          value={this.state.recipientName}
                          className="shy-form-field-input"
                          onChange={(e) => {
                            this.handleRecipientNameChange(e.target.value);
                          }}
                          placeholder={window.translation('Name')}/>
                      </div>
                    </div>
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-default"
                      onClick={this.props.onClose}>
                      { window.translation('CANCEL')}
                    </button>
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={this.createReturnDeliveryRequest}>
                      { window.translation('CREATE') }
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
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken'])
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
)(ReturnDelivery);
