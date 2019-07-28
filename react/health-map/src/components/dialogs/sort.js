/**
 * @file sort.js
 * @description Sort component
 *
 */


import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from './../shared/loading';
import Error from './../shared/error';
import Successful from './../shared/successful';
import { sortRoute } from './../../services/remoteAPI';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;


/**
 *
 */
class Sort extends React.Component {
  state = {
    loading: false,
    succeed: false,
    failed: false,
    criteria: {
      key: 'distance',
      label: window.translation('Distance')
    }
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
  sortRouteRequest = () => {
    const self = this;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      sortRoute(
        {
          routeId: this.props.routeId,
          criteria: this.state.criteria.key,
          author: this.props.author
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken
        }
      )
        .then((jobs) => {
          if (jobs) {
            for (let i=0; i<jobs.length; i++) {
              window.onSubscribeBackgroundJob(jobs[i].id, 'Routing.jsprit');
            }
          } else {
            self.props.loadRoutes({
              from: self.props.from,
              to: self.props.to,
              tags: self.props.selectedTags,
              cities: self.props.selectedCities,
              companies: self.props.selectedCompanies,
              deliveries: self.props.selectedDeliveries,
              statuses: self.props.selectedStatuses
            });
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
  changeCriteria = (criteria) => {
    this.setState({
      criteria
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
                  className="icon-reorder"
                  src="https://cdn.shippify.co/icons/icon-reorder-white.svg"
                  alt=""/>
                { window.translation('Sort') }
              </div>
              <img
                className="shy-dialog-close"
                onClick={this.props.onClose}
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
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
                <Successful
                  text={ window.translation('Sorted successfully') }/>
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
                  <div>
                    <div className="shy-form-field-label">
                      <div>
                        {
                          `${window.translation('How would you like to sort the route?')} `
                        }
                        <strong>
                          {
                            this.props.routeId
                          }
                        </strong>
                      </div>
                    </div>
                    <Select
                      value={this.state.criteria}
                      onChange={this.changeCriteria}
                      options={[
                        {
                          key: 'distance',
                          label: window.translation('Distance')
                        },
                        {
                          key: 'scheduled_date',
                          label: window.translation('Date')
                        }
                      ]}/>
                  </div>
                  <div className="shy-dialog-body-buttons">
                    <button
                      className="shy-btn shy-btn-default"
                      onClick={this.props.onClose}>
                      { window.translation('CANCEL') }
                    </button>
                    <button
                      className="shy-btn shy-btn-primary"
                      onClick={this.sortRouteRequest}>
                      { window.translation('APPLY') }
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
)(Sort);
