/**
 * @file filters.js
 * @description Filters modal
 *
 */

import React from 'react';
import Select from 'react-select';

import './filters.css';

/**
 *
 */
class Filters extends React.Component {
  state = {
    timeArea: this.props.timeArea || 5,
    hoursBefore: this.props.hoursBefore || -24,
    hoursAfter: this.props.hoursAfter || 24,
    minHoursBefore: -144,
    maxHoursBefore: 0,
    minHoursAfter: 0,
    maxHoursAfter: 144,
    timeAreas: [5, 10, 15]
  }
  applyFilters = () => {
    this.props.applyFilters(
      this.state.timeArea,
      this.state.hoursBefore,
      this.state.hoursAfter
    );
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
                  className="icon-filter"
                  src="https://cdn.shippify.co/icons/icon-filter-white.svg"
                  alt=""/>
                {
                  window.translation('Select the filters')
                }
              </div>
              <img
                className="shy-dialog-close"
                src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                onClick={this.props.onClose}
                alt=""/>
            </div>
            <div className="shy-dialog-body filters-dialog-body">
              <div>
                <div className="shy-form-field-label">
                  { window.translation('Distance') }
                </div>
                <div className="shy-form-field">
                  <Select
                    valueKey="id"
                    labelKey="name"
                    value={this.state.timeArea}
                    onChange={(e) => {
                      this.setState({
                        timeArea: e ? Number(e.id) : 0
                      });
                    }}
                    options={
                      this.state.timeAreas.reduce((elements, timeArea) => {
                        elements.push({
                          id: timeArea,
                          name: window.translation(
                            '*NUMBER* minutes from the original route'
                          )
                            .replace('*NUMBER*', timeArea)
                        });
                        return elements;
                      }, [])
                    }
                    placeholder={
                      window.translation(
                        'Select distance from the original route'
                      )
                    }/>
                </div>
              </div>
              <div className="margin-top-16">
                <div className="shy-form-field-label">
                  { window.translation('Time Range') }
                </div>
                <div className="shy-form-field">
                  <div className="shy-time-range">
                    <div className="shy-time-range-picker">
                      <input
                        step={1}
                        type="range"
                        max={this.state.maxHoursBefore}
                        min={this.state.minHoursBefore}
                        value={this.state.hoursBefore}
                        className="shy-sd-filter-range shy-sd-filter-range-left"
                        onChange={(e) => this.setState({
                          hoursBefore: Number(e.target.value)
                        })}
                        style={{
                          backgroundImage: `-webkit-gradient(
                            linear, 0% 0%, 100% 0,
                            color-stop(${(1 + (this.state.hoursBefore/144))}, #C5C5C5),
                            color-stop(${(1 + (this.state.hoursBefore/144))}, #ef404b)
                          )`
                        }}/>
                      <input
                        step={1}
                        type="range"
                        max={this.state.maxHoursAfter}
                        min={this.state.minHoursAfter}
                        value={this.state.hoursAfter}
                        className="shy-sd-filter-range shy-sd-filter-range-right"
                        onChange={(e) => this.setState({
                          hoursAfter: Number(e.target.value)
                        })}
                        style={{
                          backgroundImage: `-webkit-gradient(
                            linear, 0% 0%, 100% 0,
                            color-stop(${this.state.hoursAfter/144}, #ef404b),
                            color-stop(${this.state.hoursAfter/144}, #C5C5C5)
                          )`
                        }}/>
                    </div>
                    <div className="shy-time-range-labels">
                      <span>
                        {
                          window.translation('*NUMBER* hours before')
                            .replace('*NUMBER*', (this.state.hoursBefore*-1))
                        }
                      </span>
                      <span>
                        {
                          window.translation('*NUMBER* hours')
                            .replace('*NUMBER*', 0)
                        }
                      </span>
                      <span>
                        {
                          window.translation('*NUMBER* hours after')
                            .replace('*NUMBER*', this.state.hoursAfter)
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shy-dialog-body-buttons">
                <button
                  className="shy-btn shy-btn-default">
                  {
                    window.translation('CLEAR FILTERS')
                  }
                </button>
                <button
                  onClick={() => {
                    this.applyFilters();
                    this.props.onClose();
                  }}
                  className="shy-btn shy-btn-primary">
                  {
                    window.translation('APPLY')
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


export default Filters;
