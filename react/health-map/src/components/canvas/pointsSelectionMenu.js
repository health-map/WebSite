/**
 * @file timer.js
 * @description Timer component
 *
 */

import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/routes';

import './PointsSelectionMenu.css';

/**
 *
 */
class PointsSelectionMenu extends React.Component {
  render() {
    const {
      selectedPointsType, selectPointsType, filteredStep,
      filterStep, applyFilters, activeBackgroundJobs
    } = this.props;
    const pointsTypeOptions = [
      {
        id: 'All',
        name: window.translation('All')
      },
      {
        id: 'Dropoff',
        name: window.translation('Dropoff')
      },
      {
        id: 'Pickup',
        name: window.translation('Pickup')
      }
    ];
    return (
      <div
        className={
          `routes-selection-box 
          ${activeBackgroundJobs ? 'selection-box-bg-jobs-active' : '' }`
        }>
        <div className="group-type-container">
          {
            !filteredStep &&
            <div>
              <div className="shy-form-field-label">
                { window.translation('Filter the points in the map:') }
              </div>
              <div className="points-selection-group-types">
                <div className="shy-form-field">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    clearable={false}
                    value={selectedPointsType}
                    onChange={(e) => {
                      selectPointsType(e.id);
                    }}
                    options={pointsTypeOptions}/>
                </div>
              </div>
            </div>
          }
          {
            filteredStep &&
            <div>
              <span
                className="shy-form-field-label-step">
                { window.translation('Filtering deliveries whose point of') }
                <span
                  className="shy-bold-inline-text">
                  { (filteredStep.getIn(['activityType']) === 'D') ?
                    ` ${window.translation('Dropoff')} ` :
                    ` ${window.translation('Pickup')} ` }
                </span>
                { window.translation('is located on') }
                <span
                  className="shy-bold-inline-text">
                  { ` ${filteredStep.getIn(
                    [
                      (filteredStep.getIn(['activityType']) === 'P') ? 'pickup' : 'dropoff',
                      'location',
                      'address'
                    ])} `
                  }
                </span>
              </span>
              <button
                className="shy-btn shy-btn-primary"
                onClick={() => {
                  filterStep();
                  applyFilters(
                    {
                      cities: this.props.selectedCities,
                      companies: this.props.selectedCompanies,
                      deliveries: [],
                      tags: this.props.selectedTags,
                      from: this.props.from,
                      to: this.props.to,
                      statuses: this.props.selectedStatuses
                    }
                  );
                } }>
                { window.translation('REMOVE FILTER') }
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
}

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectPointsType: actions.selectPointsType,
  filterStep: actions.filterStep
}, dispatch);

/**
 *
 */
const mapStateToProps = (state) => {
  return {
    selectedPointsType: state.getIn(['routes', 'selectedPointsType'])
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PointsSelectionMenu);
