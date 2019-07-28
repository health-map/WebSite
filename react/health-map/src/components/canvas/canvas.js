/**
 * @file canvas.js
 * @description Canvas component
 */

import React from 'react';

import './canvas.css';

import ListTitlebar from './listTitlebar';
import MapTitlebar from './mapTitlebar';
import Filters from './filters';
import Map from './map';
import RoutesList from './routesList';
import RouteDetail from './routeDetail';
import PointsSelectionMenu from './PointsSelectionMenu';
import DivideRouteMenu from './divideRouteMenu';
import Polygon from './../polygon/polygon';
import Autorouting from './../autorouting/autorouting';
import SortDialog from './../dialogs/sort';
import FixTimesDialog from './../dialogs/fixTimes';
import BreakRoutesDialog from './../dialogs/breakRoutes';
import MergeRoutesDialog from './../dialogs/mergeRoutes';
import AutoMergeRoutesDialog from './../dialogs/automergeRoutes';
import AssignCourierDialog from './../dialogs/assignCourier';
import ReturnDeliveryDialog from './../dialogs/returnDelivery';
import ErrorBoundaryDialog from './../shared/errorBoundaryDialog';
import BackgroundJobsDialog from './../dialogs/backgroundJobs';
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
      isFiltersDialogVisible, toggleFiltersDialog, selectedRouteId,
      isPolygonToolOpened, togglePolygonTool, selectedRouteIdToAssign,
      selectRouteIdToAssign, selectedCities, selectedRoute,
      isBreakRoutesDialogVisible, toggleBreakRoutesDialog,
      isAutoroutingToolOpened, toggleAutoroutingTool, isFixTimesDialogVisible,
      toggleFixTimesDialog, isMergeRoutesDialogVisible, toggleMergeRoutesDialog,
      selectedRouteIdToSort, selectRouteIdToSort, selectedRouteIdToReturn,
      selectRouteIdToReturn, backgroundJobs, message, showMessage,
      isLoadingInitialJobs, selectDeliveryIdToRemoveFromRoute,
      selectedDeliveryIdToRemoveFromRoute, selectedRouteIdToAddDeliveries,
      areSingleDeliveriesVisible, filteredStep, selectedRouteIdToDivide,
      selectedRouteIdToAutoMerge, selectRouteIdToAutoMerge,
      selectDeliveryIdToMoveToAnotherRoute, 
      selectedDeliveryIdToMoveToAnotherRoute
    } = this.props;
    return (
      <div className="canvas">

        {
          isLoadingInitialJobs &&
          <div className="pending-background-jobs">
            <img
              className="spin"
              src="https://cdn.shippify.co/images/img-loading.svg"/>
            <span>
              { `${window.translation('Getting pending processes')}...` }
            </span>
          </div>
        }
        {
          (window.innerWidth <= MAX_WIDTH) &&
          <div className="mobile-titlebar-container">
            <div className="mobile-titlebar">
              <ListTitlebar
                selectedRoute={selectedRoute}/>
              <MapTitlebar
                openFiltersDialog={() => toggleFiltersDialog()}
                selectedRoute={selectedRoute}
                displayType="responsive"
                applyFilters={this.props.applyFilters}
                from={this.props.from}
                to={this.props.to}
                selectedTags={this.props.selectedTags}
                selectedCities={this.props.selectedCities}
                selectedCompanies={this.props.selectedCompanies}
                selectedDeliveries={this.props.selectedDeliveries}
                selectedStatuses={this.props.selectedStatuses}/>
            </div>
            <div
              className="mobile-titlebar-tabs"
              style={{
                backgroundColor: selectedRoute ?
                  selectedRoute.get('color') : '#ef404b'
              }}>
              <span
                className={
                  (this.state.selectedTab === TABS.ROUTES)?
                    'routing-tab routing-tab-active' :
                    'routing-tab'}
                onClick={() => this.selectTab(TABS.ROUTES)}>
                {
                  selectedRoute ?
                    selectedRoute.get('id') :
                    window.translation('ROUTES')
                }
              </span>
              <span
                className={
                  (this.state.selectedTab === TABS.MAP)?
                    'routing-tab routing-tab-active' :
                    'routing-tab'}
                onClick={() => this.selectTab(TABS.MAP)}>
                {
                  window.translation('MAP')
                }
              </span>
            </div>
          </div>
        }
        {
          !isPolygonToolOpened &&
          (
            (this.state.selectedTab === TABS.ROUTES) ||
            (this.state.selectedTab === TABS.ALL)
          ) &&
          <div
            className="list-container"
            style={{
              width: (window.innerWidth > MAX_WIDTH) ?
                `${this.state.listWidth}px` :
                '100%'
            }}>
            <div className="full-width">
              {
                (window.innerWidth > MAX_WIDTH) &&
                <ListTitlebar/>
              }
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
                selectedStatuses={this.props.selectedStatuses}
                selectRouteIdToAssign={selectRouteIdToAssign}
                selectRouteIdToSort={selectRouteIdToSort}
                selectRouteIdToAutoMerge={selectRouteIdToAutoMerge}
                selectRouteIdToReturn={selectRouteIdToReturn}
                toggleBreakRoutesDialog={toggleBreakRoutesDialog}
                toggleFixTimesDialog={toggleFixTimesDialog}
                toggleMergeRoutesDialog={toggleMergeRoutesDialog}/>
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
            {
              selectedRouteId &&
              <RouteDetail
                width={this.state.listWidth}
                setListWidth={this.setListWidth}
                isResponsive={this.state.isResponsive}
                selectRouteIdToAssign={selectRouteIdToAssign}
                selectedDeliveryIdToRemoveFromRoute={
                  selectedDeliveryIdToRemoveFromRoute
                }
                selectDeliveryIdToRemoveFromRoute={
                  selectDeliveryIdToRemoveFromRoute
                }
                selectedDeliveryIdToMoveToAnotherRoute={
                  selectedDeliveryIdToMoveToAnotherRoute
                }
                selectDeliveryIdToMoveToAnotherRoute={
                  selectDeliveryIdToMoveToAnotherRoute
                }/>
            }
          </div>
        }
        {
          (
            areSingleDeliveriesVisible ||
            (isPolygonToolOpened && filteredStep)
          ) &&
          <PointsSelectionMenu
            filteredStep={filteredStep}
            applyFilters={this.props.applyFilters}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}
            isPolygonToolOpened={isPolygonToolOpened}
            activeBackgroundJobs={backgroundJobs.size > 0}
          />
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
                isPolygonToolOpened={isPolygonToolOpened}
                selectedRoute={selectedRoute}
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
              isPolygonToolOpened={isPolygonToolOpened}
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
          !selectedRouteIdToAddDeliveries && 
          !selectedRoute &&
          !selectedRouteIdToDivide &&
          <Polygon
            isPolygonToolOpened={isPolygonToolOpened}
            togglePolygonTool={togglePolygonTool}
            setListWidth={this.setListWidth}
            listWidth={this.state.listWidth}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}/>
        }
        {
          selectedRouteIdToDivide &&
          <DivideRouteMenu
            setListWidth={this.setListWidth}
            selectedRoute={selectedRoute}
            selectedRouteId={selectedRouteId}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}
          />
        }
        {
          !isPolygonToolOpened &&
          !selectedRouteIdToAddDeliveries &&
          !selectedRoute &&
          !selectedRouteIdToDivide &&
          <Autorouting
            isAutoroutingToolOpened={isAutoroutingToolOpened}
            toggleAutoroutingTool={toggleAutoroutingTool}
            listWidth={this.state.listWidth}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}/>
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
          selectedRouteIdToAssign &&
          <ErrorBoundaryDialog onClose={() => selectRouteIdToAssign()}>
            <AssignCourierDialog
              cityId={selectedCities[0]}
              routeId={selectedRouteIdToAssign}
              onClose={() => selectRouteIdToAssign()}/>
          </ErrorBoundaryDialog>
        }
        {
          isBreakRoutesDialogVisible &&
          <ErrorBoundaryDialog onClose={() => toggleBreakRoutesDialog()}>
            <BreakRoutesDialog
              onClose={() => toggleBreakRoutesDialog()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          isFixTimesDialogVisible &&
          <ErrorBoundaryDialog onClose={() => toggleFixTimesDialog()}>
            <FixTimesDialog
              onClose={() => toggleFixTimesDialog()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          isMergeRoutesDialogVisible &&
          <ErrorBoundaryDialog onClose={() => toggleMergeRoutesDialog()}>
            <MergeRoutesDialog
              onClose={() => toggleMergeRoutesDialog()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          selectedRouteIdToSort &&
          <ErrorBoundaryDialog onClose={() => selectRouteIdToSort()}>
            <SortDialog
              routeId={selectedRouteIdToSort}
              onClose={() => selectRouteIdToSort()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          selectedRouteIdToReturn &&
          <ErrorBoundaryDialog onClose={() => selectRouteIdToReturn()}>
            <ReturnDeliveryDialog
              routeId={selectedRouteIdToReturn}
              onClose={() => selectRouteIdToReturn()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          selectedRouteIdToAutoMerge &&
          <ErrorBoundaryDialog onClose={() => selectRouteIdToAutoMerge()}>
            <AutoMergeRoutesDialog
              selectedRouteIdToAutoMerge={selectedRouteIdToAutoMerge}
              onClose={() => selectRouteIdToAutoMerge()}
              from={this.props.from}
              to={this.props.to}
              selectedTags={this.props.selectedTags}
              selectedCities={this.props.selectedCities}
              selectedCompanies={this.props.selectedCompanies}
              selectedDeliveries={this.props.selectedDeliveries}
              selectedStatuses={this.props.selectedStatuses}/>
          </ErrorBoundaryDialog>
        }
        {
          message &&
          <ErrorBoundaryDialog onClose={() => showMessage()}>
            <MessageDialog/>
          </ErrorBoundaryDialog>
        }
        {
          (backgroundJobs.size > 0) &&
          <BackgroundJobsDialog/>
        }
      </div>
    );
  }
}


export default Canvas;
