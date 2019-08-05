/**
 * @file filters.js
 * @description Filters dialog
 * @author Leonardo Kuffo Rivero
 */

import React from 'react';
import moment from 'moment';
// import Kronos from 'react-kronos';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  loadCities,
  loadInstitutions,
  loadDepartments,
  loadGenders,
  loadAges
} from './../../services/remoteAPI';

import { actions } from './../../actions/incidences';

import './filters.css';


/**
 *
 */
class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: undefined,
      institutions: undefined,
      departments: undefined,
      genders: undefined,
      ages: undefined,
      isLoadingCities: false,
      isLoadingInstitution: false,
      isLoadingDepartment: false,
      isLoadingGender: false,
      isLoadingAge: false,
      selectedCity: undefined,
      selectedInstitution: undefined,
      selectedDepartment: undefined,
      selectedGender: undefined,
      selectedAge: undefined,
      selectedDivision: undefined,
      startDate: undefined,
      endDate: undefined
    };
  }
  componentDidMount() {
    const filters = this.props.incidencesFilters;
    this.setState({
      selectedCity: filters.get('city').toJS(),
      selectedInstitution: filters.get('institution').toJS(),
      selectedDepartment: filters.get('department').toJS(),
      startDate: filters.get('startDate'),
      endDate: filters.get('endDate'),
      selectedGender: filters.get('gender').toJS(),
      selectedAge: filters.get('age').toJS(),
      selectedDivision: filters.get('division').toJS()
    });
  }
  handleCityChange = (selectedCity) => {
    console.log(selectedCity);
    this.setState({
      selectedCity,
      isLoadingCities: false
    });
  }
  handleInstitutionChange = (selectedInstitution) => {
    this.setState({
      selectedInstitution,
      isLoadingInstitution: false
    });
  }
  handleDepartmentChange = (selectedDepartment) => {
    this.setState({
      selectedDepartment,
      isLoadingDepartment: false
    });
  }
  handleGenderChange = (selectedGender) => {
    this.setState({
      selectedGender,
      isLoadingGender: false
    });
  }
  handleAgeChange = (selectedAge) => {
    this.setState({
      selectedAge,
      isLoadingAge: false
    });
  }
  handleDivisionChange = (selectedDivision) => {
    this.setState({
      selectedDivision
    });
  }
  handleDateRangeChange = (startDate, endDate) => {
    this.setState({
      startDate: moment(startDate).startOf('day').unix(),
      endDate: moment(endDate).endOf('day').unix()
    });
  }
  loadInstitutions = () => {
    const self = this;
    this.setState({
      isLoadingInstitution: true
    }, () => {
      loadInstitutions(
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(institutions => self.setState({
          institutions,
          isLoadingInstitution: false
        }));
    });
  }
  loadCities = () => {
    const self = this;
    this.setState({
      isLoadingCities: true
    }, () => {
      loadCities(
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(cities => self.setState({
          cities,
          isLoadingCities: false
        }));
    });
  }
  loadDepartment = () => {
    const self = this;
    this.setState({
      isLoadingDepartment: true
    }, () => {
      loadDepartments(
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(departments => self.setState({
          departments,
          isLoadingDepartment: false
        }));
    });
  }
  loadGenders = () => {
    const self = this;
    this.setState({
      isLoadingGender: true
    }, () => {
      loadGenders(
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(genders => self.setState({
          genders,
          isLoadingGender: false
        }));
    });
  }
  loadAges = () => {
    const self = this;
    this.setState({
      isLoadingAge: true
    }, () => {
      loadAges(
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then(ages => self.setState({
          ages,
          isLoadingAge: false
        }));
    });
  }
  applyFilters = () => {
    this.props.mutateManyFilters(
      {
        institution: Inmmutable.map(this.state.selectedInstitution),
        gender: Inmmutable.map(this.state.selectedGender),
        city: Inmmutable.map(this.state.selectedCity),
        age: Inmutable.map(this.state.selectedAge),
        department: Inmutable.map(this.state.department),
        startDate: this.state.startDate,
        endDate: this.state.endDate
      }
    );
    this.props.onClose();
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
                  className="shy-filter-icon"
                  src="https://cdn.shippify.co/icons/icon-filter-white.svg"
                  alt=""/>
                { 
                  'FILTROS Y CONFIGURACIONES' 
                }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                alt=""
                onClick={this.props.onClose}/>
            </div>
            <div className="shy-dialog-body shy-dialog-body-sm">
              <div className="hm-filters-field">
                <div className="shy-form-field-label hm-filters-field-label">
                  { 
                    'Selecciona una ciudad' 
                  }
                </div>
                <div className="shy-form-field hm-select-datatype">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    value={this.state.selectedCity}
                    onChange={(e) => {
                      this.handleCityChange(e);
                    }}
                    onMenuOpen={this.loadCities}
                    options={this.state.cities.toJSON()}
                    isLoading={this.state.isLoadingCities}/>
                </div>
              </div>
              <div className="hm-filters-field margin-top-16">
                <div className="shy-form-field-label hm-filters-field-label">
                  { 
                    'Selecciona una institucion'
                  }
                </div>
                <div className="shy-form-field hm-select-datatype">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    onChange={e => this.handleInstitutionChange(e)}
                    options={this.state.institutions}
                    value={this.state.selectedInstitution}
                    onMenuOpen={this.loadInstitutions}
                    isLoading={this.state.isLoadingInstitution}/>
                </div>
              </div>
              <div
                className="margin-top-16 hm-filters-field">
                <div className="shy-form-field-label hm-filters-field-label">
                  { 
                    'Selecciona un departamento'
                  }
                </div>
                <div className="shy-form-field hm-select-datatype">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    onChange={e => this.handleDepartmentChange(e)}
                    options={this.state.departments}
                    value={this.state.selectedDepartment}
                    onMenuOpen={this.loadDepartment}
                    isLoading={this.state.isLoadingDepartment}/>
                </div>
              </div>
              <div className="margin-top-16 hm-filters-field">
                <div className="shy-form-field-label hm-filters-field-label">
                  {
                    'Selecciona un rango de edad'
                  }
                </div>
                <div className="shy-form-field hm-select-datatype">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    onChange={e => this.handleAgeChange(e)}
                    options={this.state.ages}
                    value={this.state.selectedAge}
                    onMenuOpen={this.loadAges}
                    isLoading={this.state.isLoadingAge}/>
                </div>
              </div>
              <div className="margin-top-16 hm-filters-field">
                <div className="shy-form-field-label hm-filters-field-label">
                  {
                    window.translation('Select a date')
                  }
                </div>
                <div className="shy-form-field">
                  {/* <Kronos
                    options={kronosOptions}
                    format={'DD-MM-YYYY'}
                    date={moment.unix(this.state.from)}
                    onChangeDateTime={(e) => this.handleDateChange(e)}
                    inputClassName="shy-form-field-input full-width"/> */}
                </div>
              </div>
              <div className="shy-dialog-body-buttons">
                <button
                  onClick={this.applyFilters}
                  className="hm-btn hm-btn-primary hm-btn-full-width no-margin">
                  { 
                    'FILTRAR'
                  }
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
  mutateFilters: actions.mutateFilters,
  mutateManyFilters: actions.mutateManyFilters
}, dispatch);

/**
 *
 */
const mapStateToProps = state => {
  return {
    incidencesFilters: state.getIn(['incidences', 'filters']),
    showWeatherData: state.getIn(['general', 'showWeather']),
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
