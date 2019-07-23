/**
 * @file autorouting.js
 * @description Autorouting Component
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions } from './../../actions/general';
import AutoroutingDialog from './../dialogs/autorouting';

import './autorouting.css';

/**
 *
 */
class Autorouting extends React.Component {
  state = {
    isAutoroutingHovered: false
  }
  handleMouseEnter = () => {
    this.setState({
      isAutoroutingHovered: true
    });
  }
  handleMouseLeave = () => {
    this.setState({
      isAutoroutingHovered: false
    });
  }
  render() {
    const {
      isAutoroutingToolOpened, toggleAutoroutingTool, from, to, selectedTags,
      selectedCities, selectedCompanies, selectedDeliveries, backgroundJobsSize,
      showMessage, isLoadingRoutes, firstRouteId, selectedStatuses
    } = this.props;
    return (
      isAutoroutingToolOpened ?
        <AutoroutingDialog
          onClose={() => toggleAutoroutingTool(false)}
          from={from}
          to={to}
          selectedTags={selectedTags}
          selectedCities={selectedCities}
          selectedCompanies={selectedCompanies}
          selectedDeliveries={selectedDeliveries}
          selectedStatuses={selectedStatuses}/> :
        <div
          className="autorouting-closed"
          onClick={() => {
            this.setState({
              isAutoroutingHovered: false
            });
            if (
              (backgroundJobsSize === 0) &&
              !isLoadingRoutes &&
              (firstRouteId === 'Single')
            ) {
              toggleAutoroutingTool(true);
            } else {
              if (backgroundJobsSize > 0) {
                showMessage(`${window.translation('Some processes are being executed.')} ${window.translation('Please wait until the processes are finished.')}`);
              }
              if (isLoadingRoutes) {
                showMessage(`${window.translation('Please wait until the routes are loaded.')}`);
              }
              if (firstRouteId !== 'Single') {
                showMessage(`${window.translation('You do not have single deliveries to group.')}`);
              }
            }
          }}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          style={{
            left: (this.props.listWidth + 16)
          }}>
          <img
            src="https://cdn.shippify.co/icons/icon-new-auto-routing-white.svg"
            className="icon-autorouting"/>
          {
            this.state.isAutoroutingHovered &&
            <span>
              {
                window.translation('AUTO-ROUTING')
              }
            </span>
          }
        </div>
    );
  }
}


/**
 *
 */
const mapStateToProps = (state) => {
  return {
    backgroundJobsSize: state.getIn(['backgroundJobs', 'jobs']).size,
    isLoadingRoutes: state.getIn(['routes', 'isLoadingRoutes']),
    firstRouteId: state.getIn(['routes', 'data', 0, 'id'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  showMessage: actions.showMessage
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Autorouting);
