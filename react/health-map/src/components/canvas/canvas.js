/**
 * @file canvas.js
 * @description Canvas component
 */

import React from 'react';
import Sidebar from 'react-sidebar';

import MapTitlebar from './mapTitlebar';
import HMSidebar from './hmSidebar';
import Filters from './filters';
import Map from './map';
import DataPanel from './dataPanel';
import ErrorBoundaryDialog from './../shared/errorBoundaryDialog';
import MessageDialog from './../dialogs/message';
import MapFooter from './mapFooter';
import {
  sideBarStyle
} from './../../constants';

import './canvas.css';


/**
 *
 */
const TABS = {
  INCIDENCES: 'INCIDENCES',
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
      isResponsive: false,
      sidebarOpen: false
    };
  }
  updateView = () => {
    if (window.innerWidth <= MAX_WIDTH) {
      this.setState({
        selectedTab: TABS.INCIDENCES,
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
  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  }
  render() {
    const self = this;
    const {
      isFiltersDialogVisible, toggleFiltersDialog, 
      message, showMessage, isLoadingMap
    } = this.props;
    return (
      <div className="canvas">
        {
          isLoadingMap && 
          <div
            className="hm-dim">
            <span className="hm-loader-text"> 
              {
                'Estamos cargando la información de salud. Por favor, espere unos segundos.'
              }
            </span>
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        }
        <Sidebar
          sidebar={
            <HMSidebar
              onSetSidebarOpen={self.onSetSidebarOpen.bind(self)}/>
          }
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          sidebarId="hm-sidebar"
          contentId="hm-sidebar-content"
          styles={sideBarStyle}>
          <b></b>
        </Sidebar>
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
                displayType="desktop"
                onSetSidebarOpen={self.onSetSidebarOpen.bind(self)}/>
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
              selectedStatuses={this.props.selectedStatuses}/>
          </div>
        }
        {
          isFiltersDialogVisible &&
          <ErrorBoundaryDialog onClose={() => toggleFiltersDialog()}>
            <Filters
              applyFilters={this.props.applyFilters}
              onClose={() => {
                toggleFiltersDialog();
              }}/>
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
