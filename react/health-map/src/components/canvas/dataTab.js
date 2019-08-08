
import React from 'react';
import Select from 'react-select';
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
  handleDataTypeChange = (selectedDataType) => {
    this.props.mutateFilters(
      'type',
      selectedDataType
    );
  }
  render() {
    const {
      incidencesFilters, incidences
    } = this.props;

    const selectedDataType = DataTypesMapping.filter((dt) => {
      return dt.id === incidencesFilters.get('type');
    })[0];
    if (incidences.features.length) {
      incidences.features = incidences.features.sort((a, b) => {
        return b.properties.metrics.absolute - a.properties.metrics.absolute;
      });
    }

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
                <div className="shy-error-container">
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
                    'Estas viendo datos de pacientes de TODAS LAS EDADES de género FEMENINO, cuya fecha de ingreso fue en VERANO del 2019. Diagnóstico de los pacientes: Enfermedades del sistema digestivo '
                  }
                </div>
                <div className="hm-datatab-datatype">
                  <span>Ver numero de Pacientes: </span>
                  <div>
                    {
                      DataTypesMapping[incidencesFilters.get('type')]
                    }
                    <div className="shy-form-field hm-select-datatype">
                      <Select
                        valueKey="id"
                        labelKey="name"
                        value={selectedDataType}
                        onChange={(e) => {
                          this.handleDataTypeChange(e.id);
                        }}
                        isSearchable={false}
                        options={DataTypesMapping}/>
                    </div>
                  </div>
                </div>
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
    incidencesFilters: state.getIn(['incidences', 'filters'])
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
