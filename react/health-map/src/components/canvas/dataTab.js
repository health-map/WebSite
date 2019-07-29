
import React from 'react';
import { connect } from 'react-redux';
//import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';

import Route from './route';
import Error from '../shared/error';
import Loading from '../shared/loading';
import { actions } from '../../actions/incidences';
import { actions as generalActions } from '../../actions/general';
import { thunks } from '../../actions/thunks/routes';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './dataTab.css';

/**
 *
 */
class DataTab extends React.Component {
  componentDidMount() {

  }
  componentDidUpdate() {

  }
  render() {
    return (
      <div className="hm-tab-container">
        <div className="hm-datatab-firstinfo">
          {
            'Estas viendo datos de pacientes de TODAS LAS EDADES de género FEMENINO, cuya fecha de ingreso fue en VERANO del 2019. Diagnóstico de los pacientes: Enfermedades del sistema digestivo '
          }
        </div>
        {
          false &&
          this.props.isLoadingIncidences &&
          <Loading/>
        }
        {
          false &&
          !this.props.isLoadingIncidences &&
          (this.props.loadIncidencesError.length > 0) &&
          <Error
            text={this.props.loadIncidencesError}
            onRetry={() => this.props.loadIncidences({
              from: this.props.from,
              to: this.props.to,
              tags: this.props.selectedTags,
              cities: this.props.selectedCities,
              companies: this.props.selectedCompanies,
              deliveries: this.props.selectedDeliveries,
              statuses: this.props.selectedStatuses
            })}/>
        }
        {
          false &&
          !this.props.isLoadingIncidences &&
          (this.props.loadIncidencesError.length === 0) &&
          <div className="routes-container">
            {
              (this.props.routes.size === 0) &&
              <div className="no-routes-available-container">
                <div className="flex flex-column no-routes-available">
                  <img src="https://cdn.shippify.co/images/img-no-results.svg"/>
                  <span>
                    { window.translation('There are no routes available for the moment.') }
                  </span>
                </div>
              </div>
            }
            {
              (this.props.routes.size > 0) &&
              <div>
                <div className="routes-options-container">
                  <div className="routes-options-description">
                    { 'Select one or more routes to enable this options' }
                  </div>
                </div>
                <div className="route">
                  <div className="select-all-routes">
                    <div>
                      { window.translation('Select all routes') }
                    </div>
                  </div>
                  <div className="route-actions">
                    <span
                      className="color"
                      style={{ backgroundColor: '#757575' }}></span>
                    <div style={{ width: '16px' }}></div>
                  </div>
                </div>
                <div className="routes">
                  {
                    false &&
                    this.props.routes.map((route, idx) => {
                      return (
                        <Route
                          key={idx}
                          data={route}
                          isResponsive={this.props.isResponsive}/>
                      );
                    })
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    routes: state.getIn(['incidences', 'data']),
    isLoadingIncidences: state.getIn(['incidences', 'isLoadingIncidences']),
    loadIncidencesError: state.getIn(['incidences', 'loadIncidencesError'])
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loadIncidences: loadIncidencesRequest,
  toggleIncidenceVisibility: actions.toggleIncidenceVisibility,
  showMessage: generalActions.showMessage
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTab);
