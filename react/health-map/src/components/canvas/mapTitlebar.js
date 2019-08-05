/**
 * @file titlebar.js
 * @description Titlebar component
 */

import React from 'react';
import Immutable from 'immutable';
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

import { actions } from './../../actions/incidences';
import { thunks } from '../../actions/thunks/incidences';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './mapTitlebar.css';

/**
 *
 */
class MapTitlebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSeason: '',
      selectedInstitution: '',
      selectedGender: '',
      selectedStartDate: '',
      selectedEndDate: ''
    };
  }
  mutateAndApplyFilters = (filterKey, filterValue) => {
    this.props.mutateFilters(filterKey, filterValue);
    this.props.loadIncidences(this.props.incidencesFilters.toJS());
  }
  mutateAndApplyManyFilters = (mutations) => {
    this.props.mutateManyFilters(mutations);
    this.props.loadIncidences(this.props.incidencesFilters.toJS());
  }
  render() {
    const {
      openFiltersDialog, onSetSidebarOpen, incidencesFilters
    } = this.props;

    // const selectedInstitution = incidencesFilters.getIn(
    //   ['institution', 'name']
    // );
    const selectedStartDate = incidencesFilters.get('startDate');
    const selectedEndDate = incidencesFilters.get('endDate');
    const selectedGender = incidencesFilters.getIn(['gender']);
    const selectedSeason = incidencesFilters.getIn(['season']);
    return (
      <div
        className="hm-map-titlebar"
        style={{
          backgroundColor: '#0092E1'
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
              'MAPA EPIDEMIOLÓGICO DE GUAYAQUIL'
            }
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
                  { 
                    'HOSPITAL LEÓN BECERRA'
                  }
                </div>
                <FaArrowCircleDown 
                  size={12}/>
              </span>
            </div>
          </div>
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
                    id: 98,
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
                    id: 99,
                    name: 'F'
                  }));
                }}>
                { 'F' }
              </span>
              <span
                className={
                  (!selectedGender || !selectedGender.get('name') 
                  || selectedGender.get('name') === ''
                  || selectedGender.get('name') === 'TODO') ?
                    'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-right'
                }
                onClick={() => {
                  this.mutateAndApplyFilters('gender', Immutable.Map());
                }}>
                { 'TODO' }
              </span>
            </div>
          </div>
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
                    endDate: '01-01-2018'
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
  loadIncidences: loadIncidencesRequest
}, dispatch);

/**
 *
 */
const mapStateToProps = state => {
  return {
    incidencesFilters: state.getIn(['incidences', 'filters']),
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
)(MapTitlebar);
