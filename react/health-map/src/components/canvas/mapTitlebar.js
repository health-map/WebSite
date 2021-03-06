/**
 * @file titlebar.js
 * @description Titlebar component
 */

import React from 'react';
import Immutable from 'immutable';
import Tooltip from 'rc-tooltip';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  FaVenusMars,
  FaHospitalSymbol,
  FaRegCalendar,
  FaArrowCircleDown
} from 'react-icons/fa';
import { 
  MdTimelapse, 
  MdFilterList,
  MdMenu
} from 'react-icons/md';

import { 
  loadInstitutions
} from './../../services/remoteAPI';

import { actions } from './../../actions/incidences';
import { actions as generalActions } from './../../actions/general';
import { thunks } from '../../actions/thunks/incidences';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './mapTitlebar.css';
import 'rc-tooltip/assets/bootstrap_white.css';

/**
 *
 */
class MapTitlebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingInstitution: false,
      institutions: []
    };
  }
  componentDidMount() {
    this.loadInstitutions();
  }
  mutateAndApplyFilters = (filterKey, filterValue) => {
    this.props.mutateFilters(filterKey, filterValue);

    this.props.loadIncidences({
      ...this.props.incidencesFilters.toJS(),
      [filterKey]: Immutable.Iterable.isIterable(filterValue) ? 
        filterValue.toJS() : filterValue
    });
  }
  mutateAndApplyManyFilters = (mutations) => {
    this.props.mutateManyFilters(mutations);
    this.props.loadIncidences({
      ...this.props.incidencesFilters.toJS(),
      ...mutations
    });
  }
  handleInstitutionChange = (selectedInstitution) => {
    this.setState({
      isLoadingInstitution: false
    });
    this.props.mutateFilters('institution', Immutable.Map(selectedInstitution));
    this.props.loadIncidences({
      ...this.props.incidencesFilters.toJS(),
      institution: selectedInstitution
    });
  }
  loadInstitutions = () => {
    const self = this;
    this.setState({
      isLoadingInstitution: true
    }, () => {
      loadInstitutions({
        cityId: self.props.incidencesFilters.get('city').toJS().id
      },
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
  render() {
    const {
      openFiltersDialog, onSetSidebarOpen, incidencesFilters,
      viewType, toggleViewType
    } = this.props;

    const selectedStartDate = incidencesFilters.get('startDate');
    const selectedEndDate = incidencesFilters.get('endDate');
    const selectedGender = incidencesFilters.getIn(['gender']);
    const selectedSeason = incidencesFilters.getIn(['season']);
    const selectedInstitution = incidencesFilters.get('institution');
    const city = incidencesFilters.get('city').toJS();
    return (
      <div
        className="hm-map-titlebar"
        style={{
          backgroundColor: '#0b7895'
        }}>
        <div className="hm-map-title-box">
          <div 
            onClick={() => {
              onSetSidebarOpen(true);
            }}
            className="hm-map-sidemenu">
            <MdMenu
              size={32}/>
          </div>
          <div className="hm-map-title-text">
            {
              `MAPA DE SALUD ${city.name ? 'DE ' + city.name.toUpperCase() : ''}`
            }
          </div>
        </div>
        <div 
          className="hm-map-covid-box"
          style={{
            backgroundColor: (viewType === 'point' ? 'white' : 'transparent')
          }}> 
          <div
            onClick={() => { // ACTIVATE COVID 19 VIEW
              const newViewType = (
                viewType === 'geozone' ? 'point' : 'geozone');
              toggleViewType(newViewType);
              if (newViewType === 'point') {
                this.props.mutateFilters('institution', Immutable.Map({
                  id: 9, // generic institution for covid-19
                  name: 'COVID19'
                }));
                this.props.mutateFilters('department', Immutable.Map({
                  id: 9, // generic department for covid-19
                  name: 'COVID19'
                }));
                this.props.loadIncidences({
                  ...this.props.incidencesFilters.toJS(),
                  institution: { id: 9 },
                  department: { id: 9 }
                });
              } else {
                this.props.mutateFilters('institution', Immutable.Map({
                  id: 9999, // all
                  name: 'TODAS'
                }));
                this.props.mutateFilters('department', Immutable.Map({
                  id: 9999, // all
                  name: 'TODOS'
                }));
                this.props.loadIncidences({
                  ...this.props.incidencesFilters.toJS(),
                  institution: undefined,
                  department: undefined
                });
              }
            }}>
            COVID-19
          </div>
        </div>
        <div className="flex flex-align-center">
          <div className="hm-action-box hm-action-box-full-bordered">
            <div className="hm-action-label">
              <FaHospitalSymbol
                size={18}/>
              <span className="hm-action-label-text">
                {
                  'Institución'
                }
              </span>
            </div>
            <div className="shy-quick-actions">
              <span
                className={
                  'hm-quick-selector-action shy-quick-action'
                }
                onClick={() => {
                }}>
                <div className="hm-quick-selector-value">
                  <div className="hm-special-transparent-select">
                    <Select
                      valueKey="id"
                      labelKey="name"
                      onChange={e => this.handleInstitutionChange(e)}
                      options={this.state.institutions}
                      value={selectedInstitution.toJS()}
                      isLoading={this.state.isLoadingInstitution}/>
                  </div>
                </div>
                <FaArrowCircleDown 
                  size={12}/>
              </span>
            </div>
          </div>
          <Tooltip 
            placement="bottom" 
            overlay={'Filtra los pacientes mostrados por su género M: Masculino - F: Femenino'}>  
            <div className="hm-action-box hm-action-box-bordered">
              <div className="hm-action-label">
                <FaVenusMars
                  size={18}/>
                <span className="hm-action-label-text">
                  {
                    'Género'
                  }
                </span>
              </div>
              <div className="shy-quick-actions">
                <span
                  className={
                    selectedGender && selectedGender.get('name') === 'M' ?
                      'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-left'
                  }
                  onClick={() => {
                    this.mutateAndApplyFilters('gender', Immutable.Map({
                      id: 1,
                      name: 'M'
                    }));
                  }}>
                  { 'M' }
                </span>
                <span
                  className={
                    selectedGender && selectedGender.get('name') === 'F' ?
                      'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                      'shy-quick-action hm-quick-action-middle'
                  }
                  onClick={() => {
                    this.mutateAndApplyFilters('gender', Immutable.Map({
                      id: 2,
                      name: 'F'
                    }));
                  }}>
                  { 'F' }
                </span>
                <span
                  className={
                    (!selectedGender || !selectedGender.get('name') 
                    || selectedGender.get('name') === ''
                    || selectedGender.get('name') === 'TODOS') ?
                      'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-right'
                  }
                  onClick={() => {
                    this.mutateAndApplyFilters('gender', Immutable.Map({
                      id: 9999,
                      name: 'TODOS'
                    }));
                  }}>
                  { 'TODOS' }
                </span>
              </div>
            </div>
          </Tooltip>
          <Tooltip 
            placement="bottom" 
            overlay={'Filtra los pacientes mostrados por su fecha de ingreso a la institución de salud'}>  
            <div className="hm-action-box hm-action-box-bordered">
              <div className="hm-action-label">
                <FaRegCalendar
                  size={18}/>
                <span className="hm-action-label-text">
                  {
                    'Fecha de Ingreso'
                  }
                </span>
              </div>
              <div className="shy-quick-actions">
                <span
                  className={
                    (selectedStartDate === '01-01-2018' && 
                      selectedEndDate === '01-01-2019') ?
                      'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-left'
                  }
                  onClick={() => {
                    this.mutateAndApplyManyFilters({
                      startDate: '01-01-2018',
                      endDate: '01-01-2019'
                    });
                  }}>
                  { '2018' }
                </span>
                <span
                  className={
                    (selectedStartDate === '01-01-2019' && 
                      selectedEndDate === '01-01-2020') ?
                      'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                      'shy-quick-action hm-quick-action-middle'
                  }
                  onClick={() => {
                    this.mutateAndApplyManyFilters({
                      startDate: '01-01-2019',
                      endDate: '01-01-2020'
                    });
                  }}>
                  { '2019' }
                </span>
                <span
                  className={
                    (!selectedStartDate || !selectedEndDate) ?
                      'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-right'
                  }
                  onClick={() => {
                    this.mutateAndApplyManyFilters({
                      startDate: undefined,
                      endDate: undefined
                    });
                  }}>
                  { 'TODO' }
                </span>
              </div>
            </div>
          </Tooltip>
          <Tooltip 
            placement="bottom" 
            overlay={'Filtra los pacientes mostrados por la época del año en que ingresaron a la institución de salud. Invierno: Enero a Junio - Verano: Julio a Diciembre'}> 
            <div className="hm-action-box hm-action-box-bordered">
              <div className="hm-action-label">
                <MdTimelapse 
                  size={18} />
                <span className="hm-action-label-text">
                  {
                    'Época del Año'
                  }
                </span>
              </div>
              <div className="shy-quick-actions">
                <span
                  className={
                    selectedSeason === 'INVIERNO' ?
                      'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-left'
                  }
                  onClick={() => this.mutateAndApplyFilters('season', 'INVIERNO')}>
                  { 
                    'INVIERNO' 
                  }
                </span>
                <span
                  className={
                    selectedSeason === 'VERANO' ?
                      'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                      'shy-quick-action hm-quick-action-middle'
                  }
                  onClick={() => this.mutateAndApplyFilters('season', 'VERANO')}>
                  { 'VERANO' }
                </span>
                <span
                  className={
                    (!selectedSeason || selectedSeason === '') ?
                      'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                      'shy-quick-action shy-quick-action-right'
                  }
                  onClick={() => {
                    this.mutateAndApplyFilters('season', undefined);
                  }}>
                  { 'TODO' }
                </span>
              </div>
            </div>
          </Tooltip>
          <div className="hm-action-box">
            <div className="shy-quick-actions">
              <span
                className="shy-quick-action shy-quick-action-button"
                onClick={() => openFiltersDialog()}>
                <MdFilterList 
                  size={22}/>
                <span className="hm-button-text-icon">
                  { 
                    'MÁS FILTROS'
                  }
                </span>
              </span>
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
  mutateManyFilters: actions.mutateManyFilters,
  toggleViewType: generalActions.toggleViewType,
  loadIncidences: loadIncidencesRequest
}, dispatch);

/**
 *
 */
const mapStateToProps = state => {
  return {
    incidencesFilters: state.getIn(['incidences', 'filters']),
    accessToken: state.getIn(['general', 'user', 'accessToken']),
    viewType: state.getIn(['general', 'viewType']),
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
)(MapTitlebar);
