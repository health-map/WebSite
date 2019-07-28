/**
 * @file removeDelivery.js
 * @description Remove delivery dialog
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import Error from './../shared/error';
import Loading from './../shared/loading';
import Succesful from './../shared/successful';
import { removeDeliveryFromRoute } from './../../services/remoteAPI';

import './removeDeliveryFromRoute.css';

/**
 *
 */
class RemoveDelivery extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    recalculatePrice: true,
    reorderRoute: false,
    unassignShipper: false
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
  removeDeliveryRequest = () => {
    const self = this;
    const { recalculatePrice, reorderRoute, unassignShipper } = this.state;
    const { apiUrl, apiToken, routeId, deliveryId, author } = this.props;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      removeDeliveryFromRoute(
        {
          author,
          routeId,
          deliveryId,
          reorderRoute,
          unassignShipper,
          recalculatePrice,
          userId: this.props.userId
        },
        {
          apiUrl,
          apiToken
        },
      )
        .then((jobs) => {
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
          } else {
            this.props.loadRouteInfo();
          }
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
  onRecalculatePriceStateChange = () => {
    this.setState({
      recalculatePrice: !this.state.recalculatePrice
    });
  }
  onReorderRouteStateChange = () => {
    this.setState({
      reorderRoute: !this.state.reorderRoute
    });
  }
  onUnassignShipperStateChange = () => {
    this.setState({
      unassignShipper: !this.state.unassignShipper
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
                  className="icon-remove-circle"
                  src="https://cdn.shippify.co/icons/icon-remove-circle-white.svg"
                  alt=""/>
                { window.translation('Remove delivery from Route') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                onClick={this.props.onClose}
                alt=""/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              {
                this.state.loading &&
                <Loading/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Succesful text={
                  window.translation('Delivery successfully removed')
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
                  <div className="shy-dialog-body-text-detail">
                    {
                      window.translation('Are you sure you want to remove *ID* from this route?')
                        .replace('*ID*', this.props.deliveryId)
                    }
                  </div>
                  <div>
                    <div
                      className="shy-form-check"
                      onClick={this.onRecalculatePriceStateChange}>
                      <span>
                        { window.translation('Recalculate price') }
                      </span>
                      <img
                        src={
                          this.state.recalculatePrice ?
                            'https://cdn.shippify.co/dash/general/img/check-box-selected.svg' :
                            'https://cdn.shippify.co/dash/general/img/check-box-outline-blank.svg'
                        }
                        alt=""/>
                    </div>
                    <div
                      className="shy-form-check"
                      onClick={this.onReorderRouteStateChange}>
                      <span>
                        { window.translation('Reorder route') }
                      </span>
                      <img
                        src={
                          this.state.reorderRoute ?
                            'https://cdn.shippify.co/dash/general/img/check-box-selected.svg' :
                            'https://cdn.shippify.co/dash/general/img/check-box-outline-blank.svg'
                        }
                        alt=""/>
                    </div>
                    {
                      this.props.courier &&
                      <div
                        className="shy-form-check"
                        onClick={this.onUnassignShipperStateChange}>
                        <span>
                          { window.translation('Unassign Driver') }
                        </span>
                        <img
                          src={
                            this.state.unassignShipper ?
                              'https://cdn.shippify.co/dash/general/img/check-box-selected.svg' :
                              'https://cdn.shippify.co/dash/general/img/check-box-outline-blank.svg'
                          }
                          alt=""/>
                      </div>
                    }
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      onClick={this.props.onClose}
                      className="shy-btn shy-btn-default">
                      { window.translation('NO') }
                    </button>
                    <button
                      onClick={this.removeDeliveryRequest}
                      className="shy-btn shy-btn-primary">
                      { window.translation('YES, REMOVE') }
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
  const author = {
    type: (state.getIn(['general', 'user', 'companyAccess']) === 3) ?
      'operator' : 'client',
    id: state.getIn(['general', 'user', 'id'], ''),
    name: state.getIn(['general', 'user', 'name'], ''),
    email: state.getIn(['general', 'user', 'email'], '')
  };
  return {
    author,
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    accessToken: state.getIn(['general', 'user', 'accessToken']),
    companyAccess: state.getIn(['general', 'user', 'companyAccess']),
    userId: state.getIn(['general', 'user', 'id'])
  };
};

export default connect(
  mapStateToProps
)(RemoveDelivery);
