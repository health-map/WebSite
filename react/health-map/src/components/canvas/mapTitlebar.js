/**
 * @file titlebar.js
 * @description Titlebar component
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
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

import './mapTitlebar.css';

/**
 *
 */
class MapTitlebar extends React.Component {
  handleDateChange = (date) => {
    this.props.applyFilters({
      cities: this.props.selectedCities,
      companies: this.props.selectedCompanies,
      deliveries: this.props.selectedDeliveries,
      statuses: this.props.selectedStatuses,
      tags: this.props.selectedTags,
      from: moment(date).startOf('day').unix(),
      to: moment(date).endOf('day').unix()
    });
  }
  render() {
    const {
      openFiltersDialog, onSetSidebarOpen
    } = this.props;

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
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-left'
                }
                onClick={() => this.handleDateChange(moment().startOf('day'))}>
                { 'M' }
              </span>
              <span
                className={
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                    'shy-quick-action hm-quick-action-middle'
                }
                onClick={() => this.handleDateChange(moment().startOf('day'))}>
                { 'F' }
              </span>
              <span
                className={
                  moment().add(1, 'day').isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-right'
                }
                onClick={() => {
                  this.handleDateChange(
                    moment().add(1, 'day').startOf('day')
                  );
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
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-left'
                }
                onClick={() => this.handleDateChange(moment().startOf('day'))}>
                { '2018' }
              </span>
              <span
                className={
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                    'shy-quick-action hm-quick-action-middle'
                }
                onClick={() => this.handleDateChange(moment().startOf('day'))}>
                { '2019' }
              </span>
              <span
                className={
                  moment().add(1, 'day').isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-right'
                }
                onClick={() => {
                  this.handleDateChange(
                    moment().add(1, 'day').startOf('day')
                  );
                }}>
                { 'PERSONALIZADO' }
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
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-left shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-left'
                }
                onClick={() => this.handleDateChange()}>
                { 'INVIERNO' }
              </span>
              <span
                className={
                  moment().isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action hm-quick-action-middle shy-quick-action-active' :
                    'shy-quick-action hm-quick-action-middle'
                }
                onClick={() => this.handleDateChange()}>
                { 'VERANO' }
              </span>
              <span
                className={
                  moment().add(1, 'day').isSame(moment.unix(this.props.from), 'day') ?
                    'shy-quick-action shy-quick-action-right shy-quick-action-active' :
                    'shy-quick-action shy-quick-action-right'
                }
                onClick={() => {
                  this.handleDateChange();
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
                    'OPCIONES'
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
const mapStateToProps = state => {
  return {
    cities: state.getIn(['general', 'cities'])
  };
};

/**
 *
 */
export default connect(
  mapStateToProps
)(MapTitlebar);
