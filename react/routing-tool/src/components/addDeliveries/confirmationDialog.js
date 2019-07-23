/**
 * @file confirmationDialog.js
 * @description Confirmation dialog to add deliveries to a route
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import Error from './../shared/error';
import Loading from './../shared/loading';
import Successful from './../shared/successful';
import { addDeliveriesToRoute } from './../../services/remoteAPI';

import './confirmationDialog.css';


/**
 *
 */
class ConfirmationDialog extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    recalculatePrice: true,
    reorderRoute: false
  }
  componentDidUpdate() {
    if (!this.state.loading && this.state.succeed) {
      setTimeout(() => {
        this.props.onComplete();
      }, 2000);
    }
    if (!this.state.loading && this.state.failed) {
      setTimeout(() => this.setState({
        loading: false,
        succeed: false,
        failed: false
      }), 2000);
    }
  }
  onReorderRouteStateChange = () => {
    this.setState({
      reorderRoute: !this.state.reorderRoute
    });
  }
  onRecalculatePriceStateChange = () => {
    this.setState({
      recalculatePrice: !this.state.recalculatePrice
    });
  }
  addDeliveriesToRouteRequest = () => {
    const self = this;
    const { 
      author, routeId, deliveryIds, apiUrl, apiToken, userId 
    } = this.props;
    self.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      addDeliveriesToRoute(
        {
          author,
          routeId,
          deliveryId: deliveryIds.join(','),
          reorderRoute: self.state.reorderRoute,
          recalculatePrice: self.state.recalculatePrice,
          userId
        },
        {
          apiUrl,
          apiToken
        }
      )
        .then((jobs) => {
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
          }
          self.setState({
            loading: false,
            succeed: true
          });
        })
        .catch(() => {
          self.setState({
            loading: false,
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
              <span className="shy-dialog-header-content">
                <img
                  className="icon-add-circle"
                  src="https://cdn.shippify.co/icons/icon-add-circle-white.svg"
                  alt=""/>
                {
                  window.translation('Add deliveries to Route')
                }
              </span>
              <img
                src="https://cdn.shippify.co/dash/general/img/close-gray.svg"
                className="shy-dialog-close"
                alt="Close"
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body">
              {
                this.state.loading &&
                <Loading mini/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful text={
                  window.translation('Deliveries successfully added')
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
                      window.translation('Are you sure you want to add these deliveries to this route?')
                    }
                  </div>
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
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-default"
                      onClick={this.props.onClose}>
                      { window.translation('NO') }
                    </button>
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={this.addDeliveriesToRouteRequest}>
                      { window.translation('YES, ADD') }
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
    userId: state.getIn(['general', 'user', 'id'])
  };
};


export default connect(
  mapStateToProps
)(ConfirmationDialog);
