
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import DataTab from './dataTab';
import DiseaseTab from './diseaseTab';
import GeogroupTab from './geogroupTab';
import { actions } from '../../actions/incidences';
import { actions as generalActions } from '../../actions/general';
import { thunks } from '../../actions/thunks/incidences';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './dataPanel.css';
import 'react-tabs/style/react-tabs.css';


/**
 *
 */
class DataPanel extends React.Component {
  componentDidMount() {
    if (!this.props.incidences.features.length) {
      this.props.loadIncidences(this.props.incidencesFilters.toJS());
    }
  }
  componentDidUpdate() {

  }
  render() {
    const {
      user
    } = this.props;
    return (
      <div className="hm-main-panel">
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
            {
              (user.email) && 
              <Tab
                className="hm-tab"
                selectedClassName="hm-tab hm-tab-active">
                <div
                  className="hm-tab-name">
                      ZONAS DE INTERÉS
                </div>
              </Tab>
            }
          </TabList>
          <TabPanel>
            <DataTab />
          </TabPanel>
          <TabPanel>
            <DiseaseTab />
          </TabPanel>
          {
            (user.email) && 
            <TabPanel>
              <GeogroupTab />
            </TabPanel>
          }
        </Tabs>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    incidences: state.getIn(['incidences', 'data']).toJS(),
    isLoadingIncidences: state.getIn(['incidences', 'isLoadingIncidences']),
    loadIncidencesError: state.getIn(['incidences', 'loadIncidencesError']),
    incidencesFilters: state.getIn(['incidences', 'filters']),
    user: state.getIn(['general', 'user']).toJS()
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loadIncidences: loadIncidencesRequest,
  toggleIncidenceVisibility: actions.toggleIncidenceVisibility,
  showMessage: generalActions.showMessage,
  mutateFilters: actions.mutateFilters
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataPanel);
