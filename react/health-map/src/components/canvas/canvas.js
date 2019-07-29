/**
 * @file canvas.js
 * @description Canvas component
 */

import React from 'react';

import './canvas.css';

import MapTitlebar from './mapTitlebar';
import Filters from './filters';
import Map from './map';
import DataPanel from './dataPanel';
import ErrorBoundaryDialog from './../shared/errorBoundaryDialog';
import MessageDialog from './../dialogs/message';
import MapFooter from './mapFooter';
import './canvas.css';


/**
 *
 */
const TABS = {
  ROUTES: 'ROUTES',
  MAP: 'MAP',
  ALL: 'ALL'
};

const MAX_WIDTH = 650;


/**
 *
 */
class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      originalX: 0,
      selectedTab: TABS.ALL,
      isResponsive: false
    };
  }
  updateView = () => {
    if (window.innerWidth <= MAX_WIDTH) {
      this.setState({
        selectedTab: TABS.ROUTES,
        isResponsive: true
      });
    } else {
      this.setState({
        selectedTab: TABS.ALL,
        isResponsive: false
      });
    }
  }
  handleMouseMove = ({ clientX }) => {
    if (!this.state.isDragging) {
      return;
    }
    this.setState({
      originalX: clientX
    });
  }
  selectTab = (selectedTab) => {
    this.setState({
      selectedTab
    });
  }
  handleMouseDown = ({ clientX }) => {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.setState({
      isDragging: true,
      originalX: clientX
    });
  }
  handleMouseUp = () => {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.setState({
      isDragging: false
    });
  }
  componentDidMount() {
    this.updateView();
    window.addEventListener('resize', this.updateView);
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.updateView);
  }
  render() {
    const {
      isFiltersDialogVisible, toggleFiltersDialog, 
      selectedRoute,message, showMessage
    } = this.props;
    return (
      <div className="canvas">
        {
          true &&
          <div className="list-container">
            <div className="full-width">
              <DataPanel
                width={ 500 }
                from={this.props.from}
                to={this.props.to}
                isResponsive={this.state.isResponsive}
                selectedTags={this.props.selectedTags}
                selectedCities={this.props.selectedCities}
                selectedCompanies={this.props.selectedCompanies}
                selectedDeliveries={this.props.selectedDeliveries}
                selectedStatuses={this.props.selectedStatuses}/>
            </div>
          </div>
        }
        {
          (
            (this.state.selectedTab === TABS.MAP) ||
            (this.state.selectedTab === TABS.ALL)
          ) &&
          <div
            className="map-container"
            style={{
              width: '100%'
            }}>
            {
              (window.innerWidth > MAX_WIDTH) &&
              <MapTitlebar
                openFiltersDialog={() => toggleFiltersDialog()}
                applyFilters={this.props.applyFilters}
                from={this.props.from}
                to={this.props.to}
                displayType="desktop"
                selectedTags={this.props.selectedTags}
                selectedCities={this.props.selectedCities}
                selectedCompanies={this.props.selectedCompanies}
                selectedDeliveries={this.props.selectedDeliveries}
                selectedStatuses={this.props.selectedStatuses}/>
            }
            <Map
              defaultLocation={this.props.defaultLocation}
              selectedCity={this.props.selectedCity}
              applyFilters={this.props.applyFilters}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}
              selectedRoute={selectedRoute}/>
          </div>
        }
        {
          isFiltersDialogVisible &&
          <ErrorBoundaryDialog onClose={() => toggleFiltersDialog()}>
            <Filters
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}
              handleRefreshFiltersChange={this.handleRefreshFiltersChange}
              applyFilters={this.props.applyFilters}
              onClose={() => toggleFiltersDialog()}/>
          </ErrorBoundaryDialog>
        }
        {
          message &&
          <ErrorBoundaryDialog onClose={() => showMessage()}>
            <MessageDialog/>
          </ErrorBoundaryDialog>
        }
        <MapFooter/>
      </div>
    );
  }
}


export default Canvas;
