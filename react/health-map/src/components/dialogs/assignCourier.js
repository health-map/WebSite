/**
 * @file assignCourier.js
 * @description Dialog to assign courier to a route
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Error from './../shared/error';
import Loading from './../shared/loading';
import Successful from './../shared/successful';
import { actions } from './../../actions/routes';
import { loadCouriersByQuery } from './../../services/localAPI';
import { assignRouteToCourier } from './../../services/remoteAPI';

import './assignCourier.css';


/**
 *
 */
const NoResultsSearch = () => {
  return (
    <div className="no-results-search">
      <img
        className="no-results-search-img"
        src="https://cdn.shippify.co/images/img-no-results-lens.svg"
        alt=""/>
      <div className="no-results-search-text">
        {
          window.translation('No results found')
        }
      </div>
    </div>
  );
};

/**
 *
 */
const IdleSearch = () => {
  return (
    <div className="idle-search">
      <img
        className="idle-search-img"
        src="https://cdn.shippify.co/images/img-lens.svg"
        alt=""/>
      <div className="idle-search-text">
        {
          window.translation('Type on the input above to search')
        }
      </div>
    </div>
  );
};

/**
 *
 */
const Courier = (props) => {
  const courier = props.courier;
  return (
    <div className="courier-item" onClick={props.onClick}>
      <div className="courier-name-wrapper">
        <div className="courier-name">
          {
            courier.get('name')
          }
        </div>
        <div className="courier-id">
          <img
            src="https://cdn.shippify.co/icons/icon-notes-holder-gray-mini.svg"
            alt=""/>
          {
            courier.get('id')
          }
        </div>
      </div>
      <div className="courier-separator"></div>
      <div className="courier-phone">
        {
          courier.get('phone')
        }
      </div>
      <div className="courier-separator"></div>
      <div className="courier-incidences">
        {
          (courier.get('incidences') > 0) ?
            <strong>
              {
                courier.get('incidences')
              }
            </strong> :
            '---'
        }
      </div>
      <img
        className="icon-person-add"
        src="https://cdn.shippify.co/icons/icon-person-add-gray.svg"
        alt=""/>
    </div>
  );
};

/**
 *
 */
class AssignCourier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      succeed: false,
      failed: false,
      searchTerm: '',
      couriers: Immutable.List(),
      isSearching: false,
      isEmptyResult: false,
      searchingError: Immutable.Map(),
      selectedCourier: undefined
    };
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
  changeSearchTerm = (e) => {
    this.setState({
      searchTerm: e.target.value
    }, () => {
      if (this.state.searchTerm.length > 2) {
        this.loadCouriers();
      }
    });
  }
  loadCouriers = () => {
    if (this.state.searchTerm.length) {
      this.setState({
        couriers: Immutable.List(),
        isSearching: true,
        isEmptyResult: false,
        searchingError: Immutable.List()
      });
      let body = {
        q: this.state.searchTerm,
        limit: 6,
        routeId: this.props.routeId,
        cityId: this.props.cityId
      };
      if (
        (this.props.companyAccess === 2) ||
        (this.props.companyAccess === 4)
      ) {
        body.companyId = this.props.companyId;
      }
      loadCouriersByQuery(
        body,
        { accessToken: this.props.accessToken }
      )
        .then((couriers) => {
          if (couriers.length == 0) {
            this.setState({
              isSearching: false,
              isEmptyResult: true,
              couriers: Immutable.List()
            });
          } else {
            this.setState({
              isSearching: false,
              couriers: Immutable.fromJS(couriers)
            });
          }
        })
        .catch((error) => {
          if (typeof error.responseJSON !== 'undefined') {
            this.setState({
              couriers: Immtable.uList(),
              isSearching: false,
              searchingError: Immutable.fromJS(error.responseJSON)
            });
          } else {
            this.setState({
              couriers: Immutable.List(),
              isSearching: false,
              searchingError: Immutable.Map({
                message: window.translation('Something went wrong. Please try again')
              })
            });
          }
        });
    }
  }
  assingCourier = (courier) => {
    const self = this;
    const { apiUrl, apiToken, routeId, author } = this.props;
    this.setState({
      loading: true,
      succeed: false,
      failed: false
    }, () => {
      assignRouteToCourier(
        {
          author,
          routeId,
          courierId: courier.get('id')
        },
        { apiUrl,
          apiToken },
      )
        .then(() => {
          self.props.updateRouteCourier(routeId, {
            id: courier.get('id'),
            name: courier.get('name')
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
    const self = this;
    return (
      <div
        className="shy-dialog"
        onClick={this.props.onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content assign-courier-dialog"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <span className="shy-dialog-header-content">
                <img
                  className="icon-person-add"
                  src="https://cdn.shippify.co/icons/icon-person-add-white.svg"
                  alt=""/>
                {
                  window.translation('Assign Manually')
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
                  window.translation('Driver successfully assigned')
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
                <div className="full-width">
                  <div>
                    <div className="shy-form-field-label">
                      { `${window.translation('Search Driver')}:` }
                    </div>
                    <div className="shy-form-field">
                      <input
                        type="text"
                        className="shy-form-field-input"
                        onChange={this.changeSearchTerm}
                        value={this.state.searchTerm}
                        placeholder={window.translation('Type a driver name or ID')}/>
                    </div>
                  </div>
                  <div className={
                    this.state.couriers.size == 0 ?
                      'assign-courier-body shy-v1-center' :
                      'assign-courier-body'}>
                    {
                      this.state.isSearching &&
                      <Loading/>
                    }
                    {
                      !this.state.isSearching &&
                      !this.state.isEmptyResult &&
                      (this.state.searchingError.size === 0) &&
                      (this.state.couriers.size === 0) &&
                      <IdleSearch/>
                    }
                    {
                      !this.state.isSearching &&
                      (this.state.searchingError.size > 0) &&
                      <Error text={
                        window.translation(this.state.searchingError.get('message'))
                      }/>
                    }
                    {
                      !this.state.isSearching &&
                      this.state.isEmptyResult &&
                      <NoResultsSearch/>
                    }
                    {
                      !this.state.isSearching &&
                      (this.state.couriers.size > 0) &&
                      <div className="assign-courier">
                        <div className="assign-courier-header">
                          <span className="header-name">
                            {
                              window.translation('Driver')
                            }
                          </span>
                          <span className="header-phone">
                            {
                              window.translation('Phone')
                            }
                          </span>
                          <span className="header-incidences">
                            {
                              window.translation('Incidences')
                            }
                          </span>
                        </div>
                        <div className="assign-courier-body">
                          {
                            this.state.couriers.map((courier, idx) => {
                              return <Courier
                                key={idx}
                                courier={courier}
                                onClick={() => self.assingCourier(courier)}/>;
                            }).toArray()
                          }
                        </div>
                      </div>
                    }
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
    companyAccess: state.getIn(['general', 'user', 'companyAccess'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  updateRouteCourier: actions.updateRouteCourier
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignCourier);
