/**
 * @file canvasContainer.js
 * @description Canvas container
 *
 */

import React from 'react';
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
    isFiltersDialogVisible: false
  }
  componentDidMount() {
    
  }
  toggleFiltersDialog = () => {
    this.setState({
      isFiltersDialogVisible: !this.state.isFiltersDialogVisible
    });
  }
  render() {
    const {
      message, showMessage, isLoadingMap
    } = this.props;
    const {
      isFiltersDialogVisible
    } = this.state;
    const toggleFiltersDialog = this.toggleFiltersDialog;

    let selectedCity = cityOptions.find(({ cityId }) => {
      return (Number(cityId) === 1);
    });
    if (!selectedCity) { // fallback: shows all latam
      selectedCity = {
        'countryId': 'NA',
        'cityId': 1,
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
      isFiltersDialogVisible,
      toggleFiltersDialog,
      selectedCity,
      message,
      showMessage,
      isLoadingMap,
      viewType
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
  return {
    message: state.getIn(['general', 'message']),
    userId: state.getIn(['general', 'user', 'id']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    viewType: state.getIn(['general', 'viewType']),
    isLoadingMap: state.getIn(['incidences', 'isLoadingMap']),
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
