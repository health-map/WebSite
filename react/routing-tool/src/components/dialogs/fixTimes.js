/**
 * @file fixTimes.js
 * @description Fix times confirmation dialog
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from './../shared/loading';
import Error from './../shared/error';
import Successful from './../shared/successful';
import { fixTimes } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;


/**
 *
 */
class FixTimes extends React.Component {
  state = {
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
  breakRoutesRequest = () => {
    const self = this;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      fixTimes(
        { routes: this.props.selectedRoutes.toArray() },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken
        }
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
              <div className="shy-dialog-header-content">
                <img
                  className="icon-fix-times"
                  src="https://cdn.shippify.co/icons/icon-routing-fix-times-white.svg"
                  alt=""/>
                { window.translation('Fix Times') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              {
                this.state.loading &&
                <Loading/>
              }
              {
                !this.state.loading &&
                this.state.succeed &&
                <Successful
                  text={ window.translation('Times fixed successfully') }/>
              }
              {
                !this.state.loading &&
                this.state.failed &&
                <Error
                  text={window.translation('Something went wrong. Please try again')}/>
              }
              {
                !this.state.loading &&
                !this.state.succeed &&
                !this.state.failed &&
                <div>
                  <div className="shy-dialog-body-text-detail">
                    <div>
                      {
                        (this.props.selectedRoutes.size > 1) ?
                          window.translation('Are you sure that you want to fix times for these routes?') :
                          window.translation('Are you sure that you want to fix times for this route?')
                      }
                    </div>
                    <div>
                      <strong>
                        {
                          this.props.selectedRoutes
                            .map(route => route.id).join(', ')
                        }
                      </strong>
                    </div>
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-default"
                      onClick={this.props.onClose}>
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={this.breakRoutesRequest}>
                      { window.translation('YES, FIX TIMES') }
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
    selectedRoutes: state.getIn(['routes', 'data'])
      .filter(route => {
        return (route.get('id') !== 'Single') && route.get('isSelected');
      })
      .map((route) => {
        return {
          id: route.get('id')
        };
      }),
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
)(FixTimes);
