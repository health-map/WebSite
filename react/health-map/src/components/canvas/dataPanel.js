
import React from 'react';
import { connect } from 'react-redux';
//import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import DataTab from './dataTab';
import DiseaseTab from './diseaseTab';
import GeogroupTab from './geogroupTab';
import { actions } from '../../actions/incidences';
import { actions as generalActions } from '../../actions/general';
import { thunks } from '../../actions/thunks/routes';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './dataPanel.css';
import 'react-tabs/style/react-tabs.css';


/**
 *
 */
class DataPanel extends React.Component {
  componentDidMount() {
    if (this.props.routes.size === 0) {
      this.props.loadIncidences({
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
      this.props.loadIncidences({
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
    return (
      <div className="routes-list">
        {
          true &&
          <Tabs>
            <TabList
              className="hm-tab-list">
              <Tab
                className="hm-tab"
                selectedClassName="hm-tab hm-tab-active">
                <div
                  className="hm-tab-name">
                    DATOS
                </div>
              </Tab>
              <Tab
                className="hm-tab"
                selectedClassName="hm-tab hm-tab-active">
                <div
                  className="hm-tab-name">
                      BÚSQUEDA DE ENFERMEDADES
                </div>
              </Tab>
              <Tab
                className="hm-tab"
                selectedClassName="hm-tab hm-tab-active">
                <div
                  className="hm-tab-name">
                      ZONAS DE INTERÉS
                </div>
              </Tab>
            </TabList>

            <TabPanel>
              <DataTab />
            </TabPanel>
            <TabPanel>
              <DiseaseTab />
            </TabPanel>
            <TabPanel>
              <GeogroupTab />
            </TabPanel>
          </Tabs>
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
)(DataPanel);
