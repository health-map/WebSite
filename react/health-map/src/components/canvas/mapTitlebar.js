/**
 * @file titlebar.js
 * @description Titlebar component
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

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
      openFiltersDialog
    } = this.props;
    const filters = [];
    this.props.selectedCities.map(sc => {
      this.props.cities.map(c => {
        if (`${c.id}` === `${sc}`) {
          filters.push(c.name);
        }
      });
    });
    this.props.selectedTags.map(t => {
      filters.push(t.name);
    });
    this.props.selectedCompanies.map(c => {
      if (c.name) {
        filters.push(c.name);
      }
    });
    this.props.selectedStatuses.map(c => {
      filters.push(window.translation(c.name));
    });
    if (this.props.selectedDeliveries.length > 10) {
      filters.push(`${window.translation('NUMBER deliveries selected').replace('NUMBER', this.props.selectedDeliveries.length)}`);
    } else {
      this.props.selectedDeliveries.map(d => {
        filters.push(window.translation(d.name));
      });
    }
    return (
      <div
        className="hm-map-titlebar"
        style={{
          backgroundColor: '#0092E1'
        }}>
        <div>
          {
            'Guayaquil Health Map'
          }
        </div>
        <div className="flex flex-align-center">
          <div className="hm-action-box hm-action-box-bordered">
            <div className="hm-action-label">
              <img
                className="hm-action-label-icon"
                src="https://cdn.shippify.co/icons/icon-event-white.svg"
                alt="Fecha de Ingreso"
              />
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
          <div className="hm-action-box">
            <div className="shy-quick-actions">
              <span
                className="shy-quick-action shy-quick-action-button"
                onClick={() => openFiltersDialog()}>
                <img
                  className="shy-opciones-icon"
                  src="https://cdn.shippify.co/icons/icon-filter-white.svg"
                  alt="Filter"
                  onClick={() => openFiltersDialog()}/>
                { 
                  'OPCIONES'
                }
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
