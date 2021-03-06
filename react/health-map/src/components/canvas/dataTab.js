
import React from 'react';
import Select from 'react-select';
import Tooltip from 'rc-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  FaExclamationCircle
} from 'react-icons/fa';
import Incidence from './incidence';
import Error from '../shared/error';
import Loading from '../shared/loading';
import { actions } from '../../actions/incidences';
import { actions as generalActions } from '../../actions/general';
import { thunks } from '../../actions/thunks/incidences';
import { DataTypesMapping } from '../../constants';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './dataTab.css';
import 'rc-tooltip/assets/bootstrap_white.css';

/**
 *
 */
class DataTab extends React.Component {
  state = {

  }
  componentDidMount() {

  }
  componentDidUpdate() {

  }
  downloadFileCKAN() {
    console.log('Uplooading File to DataCity');
  }
  handleDataTypeChange = (selectedDataType) => {
    this.props.mutateFilters(
      'type',
      selectedDataType
    );
  }
  render() {
    const {
      incidencesFilters, incidences, user
    } = this.props;

    const selectedDataType = DataTypesMapping.filter((dt) => {
      return dt.id === incidencesFilters.get('type');
    })[0];
    if (incidences.features.length) {
      incidences.features = incidences.features.sort((a, b) => {
        return b.properties.metrics[incidencesFilters.get('type')] 
          - a.properties.metrics[incidencesFilters.get('type')];
      });
    }

    incidences.features = incidences.features.filter((f) => {
      return f.properties.metrics.absolute != 0;
    });

    const selectedStartDate = incidencesFilters.get('startDate');
    const selectedEndDate = incidencesFilters.get('endDate');
    const selectedGender = incidencesFilters.getIn(['gender']).toJS();
    const selectedAge= incidencesFilters.getIn(['age']).toJS();
    const selectedDisease = incidencesFilters.getIn(['disease']);

    const firstInfoText = ''.concat(
      'Estas visualizando el número de pacientes ',
      `${selectedAge.name !== 'TODOS' ? selectedAge.name + ' ' : ''}`,
      selectedDataType.name.toUpperCase() + '. ', 
      `${selectedGender.name !== 'TODOS' ? 'Cuyo género de nacimiento es ' + selectedGender.name + '. ' : ''}`,
      `${selectedStartDate && selectedEndDate? 'E ingresaron a la institución de salud entre el ' + selectedStartDate + ' y el ' + selectedEndDate + '. ' : ''}`,
      `${selectedDisease ? 'El diagnóstico de los pacientes fue: ' + selectedDisease.get('name') + '.' : ''}`
    );

    return (
      <div className="hm-tab-container">
        {
          this.props.isLoadingIncidences &&
          <div className="hm-slighly-down">
            <Loading/>
          </div>
        }
        {
          !this.props.isLoadingIncidences &&
          (this.props.loadIncidencesError.length > 0) &&
          <Error
            text={'Ha ocurrido un error al cargar las geozonas.'}
            onRetry={() => {
              this.props.loadIncidences(incidencesFilters.toJS());
            }}/>
        }
        {
          !this.props.isLoadingIncidences &&
          (this.props.loadIncidencesError.length === 0) &&
          <div className="hm-data-container">
            {
              (incidences.features.length === 0) &&
                <div className="shy-error-container data-tab-errorctn">
                  <div className="shy-error">
                    <FaExclamationCircle
                      size={92}
                      color="#0092E1"/>
                    <span>
                      { 'No existen incidencias por el momento' }
                    </span>
                  </div>
                </div>
            }
            {
              (incidences.features.length > 0) &&
              <div>
                <div className="hm-datatab-firstinfo">
                  {
                    firstInfoText                  
                  }
                </div>
                <Tooltip 
                  placement="right" 
                  arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                  overlay={'Selecciona la manera en la que deseas mostrar el número de pacientes.'}>    
                  <div className="hm-datatab-datatype">
                    <span>Ver número de pacientes: </span>
                    <div>
                      <div className="shy-form-field hm-select-datatype">
                        <Select
                          valueKey="id"
                          labelKey="name"
                          value={selectedDataType}
                          onChange={(e) => {
                            this.handleDataTypeChange(e.id);
                          }}
                          isSearchable={false}
                          options={DataTypesMapping.filter((dt) => {
                            if (!selectedDisease && 
                              dt.id == 'relativeToPatients') {
                              return false;
                            }
                            return true;
                          })}/>
                      </div>
                    </div>
                  </div>
                </Tooltip>
                <div className="hm-data-incidences-container">
                  <div className="incidence incidences-header">
                    <div className="incidence-sector">
                    Sector
                    </div>
                    <div className="incidence-value">
                    Número de Pacientes
                    </div>
                    <div className="incidence-actions">
                    Opciones
                      <div style={{ width: '16px' }}></div>
                    </div>
                  </div>
                  {
                    incidences.features.map((incidence, idx) => {
                      return (
                        <Incidence
                          key={idx}
                          incidence={incidence}/>
                      );
                    })
                  }
                </div>
                {
                  user.email &&
                  <Tooltip 
                    placement="top" 
                    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                    overlay={'Descargar datos mostrados'}>    
                    <button 
                      className="hm-fab-btn hm-fab-bottom-right"
                      onClick={() => {
                        this.downloadFileCKAN();
                      }}>
                      <img
                        className="hm-download-icon"
                        src="https://cdn.shippify.co/icons/icon-download-white-mini.svg"/>
                    </button>
                  </Tooltip>
                }
              </div>
            }
          </div>
        }
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
)(DataTab);
