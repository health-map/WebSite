/**
 * @file filters.js
 * @description Filters dialog
 * @author Denny K. Schuldt
 */

import React from 'react';
import moment from 'moment';
import Kronos from 'react-kronos';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadTags, loadDeliveries } from './../../services/remoteAPI';

import { actions } from './../../actions/incidences';

import './filters.css';


/**
 *
 */
class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: this.props.from,
      to: this.props.to,
      selectedTags: this.props.selectedTags,
      selectedCities: this.props.selectedCities,
      selectedCompanies: this.props.selectedCompanies,
      selectedDeliveries: this.props.selectedDeliveries,
      selectedStatuses: this.props.selectedStatuses,
      cities: this.props.cities,
      companies: [],
      tags: [],
      deliveries: [],
      statuses: this.props.statuses,
      deliveriesQueryIncludesComa: false,
      isLoadingCompanies: false,
      isLoadingTags: false,
      isLoadingDeliveries: false
    };
  }
  handleCityChange = (cityId) => {
    this.setState({
      selectedCities: [cityId]
    });
  }
  handleSAASCitiesChange = (cities) => {
    this.setState({
      selectedCities: cities.map((c) => {
        return c.id;
      })
    });
  }  
  handleCompaniesChange = (companies) => {
    this.setState({
      selectedCompanies: companies,
      isLoadingCompanies: false
    });
  }
  handleTagsChange = (tags) => {
    this.setState({
      selectedTags: tags,
      isLoadingTags: false
    });
  }
  handleStatusesChange = (statuses) => {
    this.setState({
      selectedStatuses: statuses,
      isLoadingStatuses: false
    });
  }
  handleDeliveriesChange = (deliveries) => {
    this.setState({
      selectedDeliveries: deliveries,
      isLoadingDeliveries: false
    });
  }
  handleDateChange = (date) => {
    this.setState({
      from: moment(date).startOf('day').unix(),
      to: moment(date).endOf('day').unix()
    });
  }
  loadTags = (q) => {
    const self = this;
    if ( q.length < 3 ) {
      return;
    }
    this.setState({
      isLoadingTags: true
    }, () => {
      loadTags(
        {
          q,
          companies: self.state.selectedCompanies.map(company => {
            return company.id;
          })
        },
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(tags => self.setState({
          tags,
          isLoadingTags: false
        }));
    });
  }
  loadStatuses = () => {
    this.setState({
      statuses: this.state.statuses,
      isLoadingStatuses: false
    });
  }
  loadDeliveries = (q) => {
    const self = this;
    q = q.trim().replace(/ /g, ',');
    let deliveriesQueryIncludesComa = false;
    if (q && q.includes(',')) {
      deliveriesQueryIncludesComa = true;
    }
    this.setState({
      deliveriesQueryIncludesComa,
      isLoadingDeliveries: true
    }, () => {
      loadDeliveries(
        {
          q,
          companies: this.state.selectedCompanies.map(company => {
            return company.id;
          })
        },
        {
          apiUrl: this.props.apiUrl,
          apiToken: this.props.apiToken
        }
      )
        .then(deliveries => {
          if (deliveries) {
            const reducedDeliveries = deliveries.map(d => ({
              id: d.id,
              name: d.referenceId ? `${d.id} | ${d.referenceId}` : d.id
            }));
            self.setState(this.state.deliveriesQueryIncludesComa ?
              {
                deliveries: deliveries ? reducedDeliveries : [],
                selectedDeliveries: reducedDeliveries,
                isLoadingDeliveries: false
              } :
              {
                deliveries: deliveries ? reducedDeliveries : [],
                isLoadingDeliveries: false
              }
            );
          }
        });
    });
  }
  applyFilters = () => {
    this.props.selectGeozone();
    this.props.applyFilters(
      {
        cities: this.state.selectedCities,
        companies: this.state.selectedCompanies,
        deliveries: this.state.selectedDeliveries,
        tags: this.state.selectedTags,
        statuses: this.state.selectedStatuses,
        from: this.state.from,
        to: this.state.to
      }
    );
    this.props.onClose();
  }
  render() {
    const { locale, companyAccess } = this.props;
    let kronosOptions = {
      color: '#0092E1',
      font: 'Roboto',
      locale: moment.updateLocale('en', {
        weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      })
    };
    switch (locale) {
    case 'es':
      kronosOptions.locale = moment.updateLocale('es', {
        weekdaysMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá']
      });
      break;
    case 'pt':
      kronosOptions.locale = moment.updateLocale('pt', {
        weekdaysMin: ['Do', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sá']
      });
      break;
    }
    return (
      <div className="shy-dialog" onClick={this.props.onClose}>
        <div className="shy-dialog-content-wrapper">
          <div
            className="shy-dialog-content"
            onClick={(e) => e.stopPropagation()}>
            <div className="shy-dialog-header">
              <div className="shy-dialog-header-content">
                <img
                  className="shy-filter-icon"
                  src="https://cdn.shippify.co/icons/icon-filter-white.svg"
                  alt=""/>
                { window.translation('Select the filters') }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              {
                (companyAccess === 2) &&
                <div>
                  <div className="shy-form-field-label">
                    { window.translation('Select a city') }
                  </div>
                  <div className="shy-form-field">
                    <Select
                      multi
                      valueKey="id"
                      labelKey="name"
                      onChange={e => this.handleSAASCitiesChange(e)}
                      options={this.state.cities.toJSON()}
                      value={this.state.selectedCities}
                      placeholder={window.translation('Type a city name')}/>
                  </div>
                </div>
              }
              {
                (companyAccess === 3) &&
                <div>
                  <div className="shy-form-field-label">
                    { window.translation('Select a city') }
                  </div>
                  <div className="shy-form-field">
                    <Select
                      valueKey="id"
                      labelKey="name"
                      value={this.state.selectedCities[0]}
                      onChange={(e) => {
                        this.handleCityChange(
                          (e && e.id) || this.state.cities.get(0).id
                        );
                      }}
                      options={this.state.cities.toJSON()}
                      placeholder={window.translation('Type a city name')}/>
                  </div>
                </div>
              }
              {
                (companyAccess === 3) &&
                <div className="margin-top-16">
                  <div className="shy-form-field-label">
                    { window.translation('Select a company') }
                  </div>
                  <div className="shy-form-field">
                    <Select
                      multi
                      valueKey="id"
                      labelKey="name"
                      onChange={e => this.handleCompaniesChange(e)}
                      options={this.state.companies}
                      value={this.state.selectedCompanies}
                      placeholder={window.translation('Type a company name')}
                      isLoading={this.state.isLoadingCompanies}/>
                  </div>
                </div>
              }
              <div
                className={
                  (companyAccess !== 1) ?
                    'margin-top-16' : ''
                }>
                <div className="shy-form-field-label">
                  { window.translation('Select a tag') }
                </div>
                <div className="shy-form-field">
                  <Select
                    multi
                    valueKey="id"
                    labelKey={(companyAccess === 3 ? 'displayName' : 'name')}
                    onChange={e => this.handleTagsChange(e)}
                    options={this.state.tags}
                    value={this.state.selectedTags}
                    placeholder={window.translation('Type a tag name')}
                    onInputChange={this.loadTags}
                    isLoading={this.state.isLoadingTags}/>
                </div>
              </div>
              {
                (companyAccess === 3) &&
                <div className="margin-top-16">
                  <div className="shy-form-field-label">
                    {
                      window.translation('Select a status')
                    }
                  </div>
                  <div className="shy-form-field">
                    <Select
                      multi
                      valueKey="id"
                      labelKey="name"
                      onChange={e => this.handleStatusesChange(e)}
                      options={this.state.statuses.map((status) => {
                        if (typeof status === 'string') {
                          return {
                            id: status,
                            name: status
                          };
                        }
                        return status;
                      })}
                      value={this.state.selectedStatuses.map((status) => {
                        if (typeof status === 'string') {
                          return {
                            id: status,
                            name: status
                          };
                        }
                        return status;
                      })}
                      placeholder={'Type a Delivery Status'}
                      onInputChange={this.loadStatuses}
                      isLoading={this.state.isLoadingStatuses}/>
                  </div>
                </div>
              }
              <div className="margin-top-16">
                <div className="shy-form-field-label">
                  {
                    window.translation('Search by delivery ID or reference ID')
                  }
                </div>
                <div className="shy-form-field">
                  <Select
                    multi
                    valueKey="id"
                    labelKey="name"
                    onChange={e => this.handleDeliveriesChange(e)}
                    options={this.state.deliveries}
                    value={this.state.selectedDeliveries}
                    placeholder={window.translation('Type a delivery ID or reference ID')}
                    onInputChange={this.loadDeliveries}
                    isLoading={this.state.isLoadingDeliveries}/>
                </div>
              </div>
              <div className="margin-top-16">
                <div className="shy-form-field-label">
                  {
                    window.translation('Select a date')
                  }
                </div>
                <div className="shy-form-field">
                  <Kronos
                    options={kronosOptions}
                    format={'DD-MM-YYYY'}
                    date={moment.unix(this.state.from)}
                    onChangeDateTime={(e) => this.handleDateChange(e)}
                    inputClassName="shy-form-field-input full-width"/>
                </div>
              </div>
              <div className="shy-dialog-body-buttons">
                <button
                  onClick={this.applyFilters}
                  className="shy-btn shy-btn-primary">
                  { window.translation('APPLY') }
                </button>
              </div>
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
  selectGeozone: actions.selectGeozone
}, dispatch);

/**
 *
 */
const mapStateToProps = state => {
  return {
    cities: state.getIn(['general', 'cities']),
    statuses: state.getIn(['general', 'statuses']),
    locale: state.getIn(['general', 'locale']),
    companyAccess: state.getIn(['general', 'user', 'companyAccess']),
    accessToken: state.getIn(['general', 'user', 'accessToken']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken'])
  };
};

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
