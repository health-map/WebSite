/**
 * @file canvasContainer.js
 * @description Canvas container
 *
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Canvas from './canvas';
import { actions } from './../../actions/general';
import { thunks } from './../../actions/thunks/routes';
import { getJobsIdByUser } from './../../services/remoteAPI';
const { loadRoutes: loadRoutesRequest } = thunks;

import cityOptions from './cityOptions.json';


/**
 *
 */
class CanvasContainer extends React.Component {
  state = {
    isFiltersDialogVisible: false,
    from: this.props.from || moment().startOf('day').unix(),
    to: this.props.to || moment().endOf('day').unix(),
    selectedTags: this.props.selectedTags || [],
    selectedCities: this.props.selectedCities || [this.props.defaultLocation.get('city')],
    selectedCompanies: this.props.selectedCompanies || [],
    selectedDeliveries: this.props.selectedDeliveries || [],
    selectedStatuses: this.props.selectedStatuses || this.props.defaultStatuses,
    isPolygonToolOpened: false,
    isAutoroutingToolOpened: false,
    selectedRouteIdToAssign: undefined,
    isBreakRoutesDialogVisible: false,
    isFixTimesDialogVisible: false,
    isMergeRoutesDialogVisible: false,
    selectedRouteIdToSort: undefined,
    selectedRouteIdToReturn: undefined,
    selectedRouteIdToAutoMerge: undefined,
    selectedDeliveryIdToRemoveFromRoute: undefined,
    selectedDeliveryIdToMoveToAnotherRoute: undefined,
    isLoadingInitialJobs: false
  }
  componentDidMount() {
    const self = this;
    const { userId, apiUrl, apiToken } = this.props;
    self.setState({
      isLoadingInitialJobs: true
    }, () => {
      getJobsIdByUser({ userId }, { apiUrl,
        apiToken })
        .then((jobs) => {
          for (let i=0; i<jobs.length; i++) {
            if (
              (jobs[i].state !== 'complete') &&
              (jobs[i].state !== 'failed')
            ) {
              window.onSubscribeBackgroundJob(
                Number(jobs[i].id),
                'Routing.jsprit',
                jobs[i].progress
              );
            }
          }
          self.setState({
            isLoadingInitialJobs: false
          });
        })
        .catch(() => {
          self.setState({
            isLoadingInitialJobs: false
          });
        });
    });
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.backgroundJobs.size > 0) &&
      (this.props.backgroundJobs.size === 0)
    ) {
      this.props.loadRoutes({
        from: this.state.from,
        to: this.state.to,
        tags: this.state.selectedTags,
        cities: this.state.selectedCities,
        companies: this.state.selectedCompanies,
        deliveries: this.state.selectedDeliveries,
        statuses: this.state.selectedStatuses
      });
    }
  }
  applyFilters = (filters) => {
    localStorage.setItem('filter_rm', JSON.stringify(filters));
    localStorage.setItem('filter_rm_type', 'custom');
    this.setState({
      from: filters.from,
      to: filters.to,
      selectedTags: filters.tags,
      selectedCities: filters.cities,
      selectedCompanies: filters.companies,
      selectedDeliveries: filters.deliveries,
      selectedStatuses: filters.statuses
    });
  }
  toggleFiltersDialog = () => {
    this.setState({
      isFiltersDialogVisible: !this.state.isFiltersDialogVisible
    });
  }
  toggleBreakRoutesDialog = () => {
    this.setState({
      isBreakRoutesDialogVisible: !this.state.isBreakRoutesDialogVisible
    });
  }
  toggleFixTimesDialog = () => {
    this.setState({
      isFixTimesDialogVisible: !this.state.isFixTimesDialogVisible
    });
  }
  toggleMergeRoutesDialog = () => {
    this.setState({
      isMergeRoutesDialogVisible: !this.state.isMergeRoutesDialogVisible
    });
  }
  togglePolygonTool = (isOpened) => {
    this.setState({
      isPolygonToolOpened: isOpened
    });
  }
  toggleAutoroutingTool = (isOpened) => {
    this.setState({
      isAutoroutingToolOpened: isOpened
    });
  }
  selectRouteIdToAssign = (routeId) => {
    this.setState({
      selectedRouteIdToAssign: routeId
    });
  }
  selectRouteIdToSort = (routeId) => {
    this.setState({
      selectedRouteIdToSort: routeId
    });
  }
  selectRouteIdToReturn = (routeId) => {
    this.setState({
      selectedRouteIdToReturn: routeId
    });
  }
  selectRouteIdToAutoMerge = (routeId) => {
    this.setState({
      selectedRouteIdToAutoMerge: routeId
    });
  }
  selectDeliveryIdToRemoveFromRoute = (deliveryId) => {
    this.setState({
      selectedDeliveryIdToRemoveFromRoute: deliveryId
    });
  }
  selectDeliveryIdToMoveToAnotherRoute = (deliveryId) => {
    this.setState({
      selectedDeliveryIdToMoveToAnotherRoute: deliveryId
    });
  }
  render() {
    const {
      defaultLocation, selectedRouteId, selectedRoute, selectedRouteToSwap,
      backgroundJobs, message, showMessage, selectedRouteIdToAddDeliveries,
      areSingleDeliveriesVisible, filteredStep, selectedRouteIdToDivide
    } = this.props;
    const {
      from, to, selectedTags, selectedCities, selectedCompanies,
      selectedDeliveries, isFiltersDialogVisible, isPolygonToolOpened,
      selectedRouteIdToAssign, isBreakRoutesDialogVisible,
      isAutoroutingToolOpened, isFixTimesDialogVisible,
      isMergeRoutesDialogVisible, selectedRouteIdToSort,
      selectedRouteIdToReturn, isLoadingInitialJobs,
      selectedDeliveryIdToRemoveFromRoute, selectedStatuses,
      selectedRouteIdToAutoMerge, selectedDeliveryIdToMoveToAnotherRoute
    } = this.state;
    const toggleFiltersDialog = this.toggleFiltersDialog;
    const applyFilters = this.applyFilters;
    const togglePolygonTool = this.togglePolygonTool;
    const toggleAutoroutingTool = this.toggleAutoroutingTool;
    const selectRouteIdToAssign = this.selectRouteIdToAssign;
    const toggleBreakRoutesDialog = this.toggleBreakRoutesDialog;
    const toggleFixTimesDialog = this.toggleFixTimesDialog;
    const toggleMergeRoutesDialog = this.toggleMergeRoutesDialog;
    const selectRouteIdToSort = this.selectRouteIdToSort;
    const selectRouteIdToReturn = this.selectRouteIdToReturn;
    const selectRouteIdToAutoMerge = this.selectRouteIdToAutoMerge;
    const selectDeliveryIdToRemoveFromRoute =
      this.selectDeliveryIdToRemoveFromRoute;
    const selectDeliveryIdToMoveToAnotherRoute =
      this.selectDeliveryIdToMoveToAnotherRoute;

    let selectedCity = cityOptions.find(({ cityId }) => {
      return (Number(cityId) === Number(this.state.selectedCities[0]));
    });
    if (!selectedCity) { // fallback: shows all latam
      selectedCity = {
        'countryId': 'NA',
        'cityId': this.state.selectedCities[0],
        'label': 'City',
        'bounds': {
          'east': -34.7137660964,
          'north': 12.3747980801,
          'south': -41.9240287948,
          'west': -83.154061476
        },
        'zoom': 3
      };
    }

    const props = {
      isLoadingInitialJobs,
      from,
      to,
      selectedTags,
      selectedCities,
      selectedCompanies,
      selectedDeliveries,
      selectedStatuses,
      isFiltersDialogVisible,
      applyFilters,
      toggleFiltersDialog,
      defaultLocation,
      selectedCity,
      selectedRouteId,
      isPolygonToolOpened,
      togglePolygonTool,
      selectedRouteIdToAssign,
      selectRouteIdToAssign,
      selectedRoute,
      isBreakRoutesDialogVisible,
      toggleBreakRoutesDialog,
      isAutoroutingToolOpened,
      toggleAutoroutingTool,
      isFixTimesDialogVisible,
      toggleFixTimesDialog,
      isMergeRoutesDialogVisible,
      toggleMergeRoutesDialog,
      selectedRouteIdToSort,
      selectRouteIdToSort,
      selectedRouteToSwap,
      selectedRouteIdToReturn,
      selectRouteIdToReturn,
      selectRouteIdToAutoMerge,
      selectedRouteIdToAutoMerge,
      backgroundJobs,
      message,
      showMessage,
      selectedDeliveryIdToRemoveFromRoute,
      selectDeliveryIdToRemoveFromRoute,
      selectedDeliveryIdToMoveToAnotherRoute,
      selectDeliveryIdToMoveToAnotherRoute,
      selectedRouteIdToAddDeliveries, 
      selectedRouteIdToDivide,
      areSingleDeliveriesVisible,
      filteredStep
    };
    return (
      <Canvas {...props}/>
    );
  }
}

/**
 *
 */
const mapStateToProps = (state) => {
  const {
    from,
    to,
    tags: selectedTags,
    cities: selectedCities,
    companies: selectedCompanies,
    deliveries: selectedDeliveries,
    statuses: selectedStatuses
  } = JSON.parse(localStorage.getItem('filter_rm') || '{}');
  const selectedRoute = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteId'])))
    .first();
  return {
    from,
    to,
    selectedTags,
    selectedCities,
    selectedCompanies,
    selectedDeliveries,
    selectedStatuses,
    defaultStatuses: state.getIn(['general', 'statuses']),
    selectedRoute,
    backgroundJobs: state.getIn(['backgroundJobs', 'jobs']),
    message: state.getIn(['general', 'message']),
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    defaultLocation: state.getIn(['general', 'user', 'defaultLocation']),
    selectedRouteId: state.getIn(['routes', 'selectedRouteId']),
    selectedRouteToSwap: state.getIn(['routes', 'selectedRouteToSwap']),
    filteredStep: state.getIn(['routes', 'filteredStep']),
    areSingleDeliveriesVisible: state.getIn(['routes', 'data', 0, 'isVisible'])
      && (state.getIn(['routes', 'data', 0, 'id']) === 'Single'),
    selectedRouteIdToAddDeliveries: state.getIn(['routes', 'selectedRouteIdToAddDeliveries']),
    selectedRouteIdToDivide: state.getIn(['routes', 'selectedRouteIdToDivide'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  loadRoutes: loadRoutesRequest,
  showMessage: actions.showMessage
}, dispatch);

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasContainer);
