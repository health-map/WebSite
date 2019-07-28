/**
 * @file canvas.js
 * @description Canvas component
 */

import React from 'react';

import './canvas.css';

import MapTitlebar from './mapTitlebar';
import Filters from './filters';
import Map from './map';
import RoutesList from './routesList';
import ErrorBoundaryDialog from './../shared/errorBoundaryDialog';
import MessageDialog from './../dialogs/message';

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
      listWidth: Number(window.localStorage.getItem('routing_list_width'))
      || 504,
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
  setListWidth = (width) => {
    this.setState({
      listWidth: width
    });
  }
  changeListWidth = (width) => {
    this.setState({
      listWidth: this.state.listWidth - width
    });
  }
  handleMouseMove = ({ clientX }) => {
    if (!this.state.isDragging) {
      return;
    }
    this.changeListWidth(this.state.originalX - clientX);
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
    window.localStorage.setItem('routing_list_width', this.state.listWidth);
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
          <div
            className="list-container"
            style={{
              width: (window.innerWidth > MAX_WIDTH) ?
                `${this.state.listWidth}px` :
                '100%'
            }}>
            <div className="full-width">
              <RoutesList
                width={this.state.listWidth}
                changeListWidth={this.changeListWidth}
                from={this.props.from}
                to={this.props.to}
                setListWidth={this.setListWidth}
                isResponsive={this.state.isResponsive}
                selectedTags={this.props.selectedTags}
                selectedCities={this.props.selectedCities}
                selectedCompanies={this.props.selectedCompanies}
                selectedDeliveries={this.props.selectedDeliveries}
                selectedStatuses={this.props.selectedStatuses}/>
            </div>
            {
              (window.innerWidth > MAX_WIDTH) &&
              <div
                className="routes-list-draggable-bar"
                onMouseDown={this.handleMouseDown}>
                <div>
                  <span className="chevron-left"></span>
                  <span className="chevron-right"></span>
                </div>
              </div>
            }
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
              width: (window.innerWidth > MAX_WIDTH) ?
                `calc(100% - ${this.state.listWidth}px)` :
                '100%'
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
              listWidth={this.state.listWidth}
              setListWidth={this.setListWidth}
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
      </div>
    );
  }
}


export default Canvas;
