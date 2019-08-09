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
import { thunks } from './../../actions/thunks/incidences';
const { loadIncidences: loadIncidencesRequest } = thunks;

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
    selectedStatuses: this.props.selectedStatuses || this.props.defaultStatuses
  }
  componentDidMount() {
    
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
  render() {
    const {
      defaultLocation, message, showMessage, isLoadingMap
    } = this.props;
    const {
      from, to, selectedTags, selectedCities, selectedCompanies,
      selectedDeliveries, isFiltersDialogVisible, selectedStatuses
    } = this.state;
    const toggleFiltersDialog = this.toggleFiltersDialog;
    const applyFilters = this.applyFilters;

    let selectedCity = cityOptions.find(({ cityId }) => {
      return (Number(cityId) === Number(this.state.selectedCities[0]));
    });
    if (!selectedCity) { // fallback: shows all latam
      selectedCity = {
        'countryId': 'NA',
        'cityId': this.state.selectedCities[0],
        'label': 'City',
        'bounds': {
          'east': -79.8607222,
          'north': -2.0173767,
          'south': -2.2873981,
          'west': -80.09900090000001
        },
        'zoom': 11
      };
    }

    const props = {
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
      message,
      showMessage,
      isLoadingMap
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
  return {
    from,
    to,
    selectedTags,
    selectedCities,
    selectedCompanies,
    selectedDeliveries,
    selectedStatuses,
    message: state.getIn(['general', 'message']),
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    defaultLocation: state.getIn(['general', 'user', 'defaultLocation']),
    isLoadingMap: state.getIn(['incidences', 'isLoadingMap'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  loadIncidences: loadIncidencesRequest,
  showMessage: actions.showMessage
}, dispatch);

/**
 *
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasContainer);
