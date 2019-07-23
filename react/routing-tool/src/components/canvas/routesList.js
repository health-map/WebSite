
import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';

import Route from './route';
import Error from './../shared/error';
import Loading from './../shared/loading';
import { actions } from './../../actions/routes';
import { actions as generalActions } from './../../actions/general';
import { thunks } from './../../actions/thunks/routes';
const { loadRoutes: loadRoutesRequest } = thunks;

import './routesList.css';


/**
 *
 */
class RoutesList extends React.Component {
  componentDidMount() {
    if (this.props.routes.size === 0) {
      this.props.loadRoutes({
        from: this.props.from,
        to: this.props.to,
        tags: this.props.selectedTags,
        cities: this.props.selectedCities,
        companies: this.props.selectedCompanies,
        deliveries: this.props.selectedDeliveries,
        statuses: this.props.selectedStatuses
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.from !== this.props.from) ||
      (prevProps.to !== this.props.to) ||
      (prevProps.selectedTags !== this.props.selectedTags) ||
      (prevProps.selectedCities !== this.props.selectedCities) ||
      (prevProps.selectedCompanies !== this.props.selectedCompanies) ||
      (prevProps.selectedDeliveries !== this.props.selectedDeliveries) ||
      (prevProps.selectedStatuses !== this.props.selectedStatuses)
    ) {
      this.props.loadRoutes({
        from: this.props.from,
        to: this.props.to,
        tags: this.props.selectedTags,
        cities: this.props.selectedCities,
        companies: this.props.selectedCompanies,
        deliveries: this.props.selectedDeliveries,
        statuses: this.props.selectedStatuses
      });
    }
  }
  render() {
    const {
      selectRouteIdToAssign, toggleBreakRoutesDialog, toggleFixTimesDialog,
      toggleMergeRoutesDialog, selectRouteToReorder, selectRouteIdToAutoMerge,
      selectRouteIdToSort, selectRouteIdToReturn, backgroundJobsSize,
      showMessage, setListWidth
    } = this.props;
    const selectedRoutes = this.props.routes
      .filter((route) => route.get('isSelected'));

    let areAllRoutesSelected = true;
    let areAllRoutesVisible = true;
    this.props.routes.map((route) => {
      if ((route.get('id') !== 'Single') && !route.get('isSelected')) {
        areAllRoutesSelected = false;
      }
      if (!route.get('isVisible')) {
        areAllRoutesVisible = false;
      }
    });
    return (
      <div className="routes-list">
        {
          this.props.isLoadingRoutes &&
          <Loading/>
        }
        {
          !this.props.isLoadingRoutes &&
          (this.props.loadRoutesError.length > 0) &&
          <Error
            text={this.props.loadRoutesError}
            onRetry={() => this.props.loadRoutes({
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
          !this.props.isLoadingRoutes &&
          (this.props.loadRoutesError.length === 0) &&
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
                    { window.translation('Select one or more routes to enable this options') }
                  </div>
                  <div className="routes-options">
                    <ReactTooltip
                      place={'bottom'}/>
                    <span
                      className={
                        (selectedRoutes.size !== 1) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size !== 1) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              selectRouteIdToReturn(selectedRoutes.first().get('id'));
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Return delivery')}: ${window.translation('You can use this tool to create a delivery like a return to the warehouse')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-return-delivery-gray.svg"
                          alt={window.translation('Return delivery')}/>
                      </button>
                    </span>
                    <span
                      className={
                        (selectedRoutes.size === 0) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size === 0) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              toggleBreakRoutesDialog();
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Break route')}: ${window.translation('You can use this tool to break some route then get it like single deliveries')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-routing-break-gray.svg"
                          alt={window.translation('Break route')}/>
                      </button>
                    </span>
                    <span
                      className={
                        (selectedRoutes.size === 0) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size === 0) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              toggleFixTimesDialog();
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Fix Times')}: ${window.translation('You can use this tool to fix the times from times calculated from the system to each delivery(ETA)')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-routing-fix-times-gray.svg"
                          alt={window.translation('Fix Times')}/>
                      </button>
                    </span>
                    <span
                      className={
                        (selectedRoutes.size < 2) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size < 2) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              toggleMergeRoutesDialog();
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Merge')}: ${window.translation('You can use this tool to merge at least two routes.')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-routing-merge-gray.svg"
                          alt={window.translation('Merge')}/>
                      </button>
                    </span>
                    <span
                      className={
                        (selectedRoutes.size !== 1) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size !== 1) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              selectRouteToReorder(
                                selectedRoutes.first().get('id')
                              );
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Reorder')}: ${window.translation('You can use this tool to change the steps order from some route')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-routing-reorder-gray.svg"
                          alt={window.translation('Reorder')}/>
                      </button>
                    </span>
                    <span
                      className={
                        (selectedRoutes.size !== 1) ?
                          'button-disabled' : ''
                      }
                      onClick={
                        (selectedRoutes.size !== 1) ?
                          () => {} :
                          () => {
                            if (backgroundJobsSize > 0) {
                              showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
                            } else {
                              selectRouteIdToSort(selectedRoutes.first().get('id'));
                            }
                          }
                      }>
                      <button
                        className="shy-btn shy-btn-default"
                        data-tip={
                          `${window.translation('Sort')}: ${window.translation('You can use this tool to sort routes automatically, defining the sort criteria')}`
                        }>
                        <img
                          src="https://cdn.shippify.co/icons/icon-routing-sort-gray.svg"
                          alt={window.translation('Sort')}/>
                      </button>
                    </span>
                  </div>
                </div>
                <div className="route">
                  <img
                    src={
                      areAllRoutesSelected ?
                        'https://cdn.shippify.co/images/img-checkbox-on.svg' :
                        'https://cdn.shippify.co/images/img-checkbox-off.svg'
                    }
                    alt=""
                    onClick={this.props.toggleRoutesSelection}/>
                  <div className="select-all-routes">
                    <div>
                      { window.translation('Select all routes') }
                    </div>
                  </div>
                  <div className="route-actions">
                    <img
                      src={
                        areAllRoutesVisible ?
                          'https://cdn.shippify.co/icons/icon-visibility-on-gray.svg' :
                          'https://cdn.shippify.co/icons/icon-visibility-off-gray.svg'
                      }
                      alt=""
                      onClick={this.props.toggleRoutesVisibility}
                      style={
                        areAllRoutesVisible ?
                          {
                            width: '22px',
                            height: '15px',
                            padding: '4.5px 1px'
                          } :
                          {
                            width: '22px',
                            height: '19px',
                            padding: '2.5px 1px'
                          }
                      }/>
                    <span
                      className="color"
                      style={{ backgroundColor: '#757575' }}></span>
                    <div style={{ width: '16px' }}></div>
                  </div>
                </div>
                <div className="routes">
                  {
                    this.props.routes.map((route, idx) => {
                      return (
                        <Route
                          key={idx}
                          data={route}
                          setListWidth={setListWidth}
                          isResponsive={this.props.isResponsive}
                          selectRouteIdToAssign={selectRouteIdToAssign}
                          selectRouteIdToAutoMerge={selectRouteIdToAutoMerge} />
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
    routes: state.getIn(['routes', 'data']),
    isLoadingRoutes: state.getIn(['routes', 'isLoadingRoutes']),
    loadRoutesError: state.getIn(['routes', 'loadRoutesError']),
    backgroundJobsSize: state.getIn(['backgroundJobs', 'jobs']).size
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loadRoutes: loadRoutesRequest,
  toggleRoutesSelection: actions.toggleRoutesSelection,
  toggleRoutesVisibility: actions.toggleRoutesVisibility,
  selectRouteToReorder: actions.selectRouteToReorder,
  selectRouteToSwap: actions.selectRouteToSwap,
  showMessage: generalActions.showMessage
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutesList);
