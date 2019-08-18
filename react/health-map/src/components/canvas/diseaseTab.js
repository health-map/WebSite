
import React from 'react';
import Immutable from 'immutable';
import Tooltip from 'rc-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from './../shared/loading';
import Error from './../shared/error';
import { loadDiseases } from './../../services/remoteAPI';
import { actions } from './../../actions/incidences';
import { thunks } from '../../actions/thunks/incidences';
import { DataTypesMapping } from '../../constants';
const { loadIncidences: loadIncidencesRequest } = thunks;

import './diseaseTab.css';
import 'rc-tooltip/assets/bootstrap_white.css';

/**
 *
 */
class DiseaseRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      disease, type
    } = this.props;
    return (
      <div 
        className={`hm-disease-row ${this.props.isPreSelected ? 'hm-disease-row-preselected' : ''}`}
        onClick={() => { 
          if (this.props.selectDisease) {
            this.props.selectDisease(disease, type); 
          }
        }}>
        <div className="hm-disease-row-name-container">
          <span className="hm-disease-row-name">
            {
              this.props.isPreSelected ? 
                'ESTAS VIENDO: ' + disease.name : 
                disease.name
            }
          </span>
          {
            type === 'aggregation' &&
            <span className="hm-disease-row-agrpnumber">
              <img
                className="hm-number-icon"
                src="https://cdn.shippify.co/icons/icon-notes-holder-gray-mini.svg"
                alt=""/>
              {
                `${disease.numberofdiseases} ${'enfermedades'}`
              }
            </span>
          }
        </div>
        <div className="hm-disease-row-cod">
          { 
            type === 'aggregation' ? disease.description : disease.cie10_code
          }
        </div>
        <div className="hm-disease-row-checkbox">
          <span className="icon marginless v1-margin-left-lg automerge-checkbox">
            <img
              className="icon-checkbox"
              src= {
                this.props.selected || this.props.isPreSelected? 
                  'https://cdn.shippify.co/images/img-checkbox-on.svg' :
                  'https://cdn.shippify.co/images/img-checkbox-off.svg'
              }
              alt=""/>
          </span>
          {
            this.props.isPreSelected && 
            <Tooltip 
              placement="top" 
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
              overlay={'Quitar filtro de enfermedad'}>  
              <span 
                className="icon marginless v1-margin-left-lg hm-clear-icon">
                <img
                  className="icon-clear"
                  src= {
                    'https://cdn.shippify.co/icons/icon-remove-white.svg'
                  }
                  onClick={(e) => {
                    this.props.selectDisease(undefined); 
                    e.stopPropagation();
                  }}
                  alt=""/>
              </span>
            </Tooltip>
          }
        </div> 
      </div>
    );
  }
}


/**
 *
 */
class DiseaseTab extends React.Component {
  state = {
    isLoadingDiseases: false,
    errorLoadingDiseases: false,
    selectedDisease: undefined,
    diseaseQuery: '',
    diseasesOptions: [],
    aggregationOptions: [],
    preSelectedDisease: undefined
  }
  componentDidMount() {
    const filters = this.props.incidencesFilters;
    this.setState({
      preSelectedDisease: filters.get('disease') ? 
        filters.get('disease').toJS() : undefined
    });
  }
  componentDidUpdate() {

  }
  selectDisease(selectedDisease, type) {
    if (!selectedDisease) {
      this.setState({
        selectedDisease: undefined
      }, () => {
        this.visualizeDiseases();
      });
    } else {
      selectedDisease.type = type;
      this.setState({
        selectedDisease
      });
    }
  }
  isDiseaseSelected(disease) {
    if (!this.state.selectedDisease) {
      return false;
    }
    return disease.id === this.state.selectedDisease.id && 
      disease.name === this.state.selectedDisease.name;
  }
  searchDiseases(q) {
    const self = this;
    this.setState({
      diseaseQuery: q
    });
    if (q.length < 3) {
      return;
    }
    this.setState({
      isLoadingDiseases: true,
      diseasesOptions: [],
      selectedDisease: undefined
    }, () => {
      loadDiseases(
        {
          q
        },
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then((data) => {
          self.setState({
            isLoadingDiseases: false,
            diseasesOptions: data.diseases,
            aggregationOptions: data.aggregation
          });
        })
        .catch((e) => {
          console.log('error', e);
          self.setState({
            errorLoadingDiseases: true,
            isLoadingDiseases: false,
            diseasesOptions: [],
            aggregationOptions: []
          });
        }); 
    });
  }
  visualizeDiseases() {
    if (this.state.selectedDisease) {
      this.props.mutateFilters('disease', Immutable.Map(this.state.selectedDisease));
      this.props.loadIncidences({
        ...this.props.incidencesFilters.toJS(),
        disease: this.state.selectedDisease
      });
      this.setState({
        preSelectedDisease: this.state.selectedDisease
      });
    } else {
      this.props.mutateFilters('disease', undefined);
      const selectedDataType = DataTypesMapping.filter((dt) => {
        return dt.id === this.props.incidencesFilters.get('type');
      })[0];
      let defaultClearType = selectedDataType;
      if (selectedDataType.id === 'relativeToPatients') {
        defaultClearType = 'absolute';
        this.props.mutateFilters('type', 'absolute');
      }
      this.props.loadIncidences({
        ...this.props.incidencesFilters.toJS(),
        disease: undefined,
        type: defaultClearType
      });
      this.setState({
        preSelectedDisease: undefined
      });
    }
  }
  render() {
    const self = this;
    return (
      <div className="hm-disease-tab-container">
        {
          !!this.state.preSelectedDisease && 
          <div className="hm-disease-preselected">
            <DiseaseRow
              disease={this.state.preSelectedDisease}
              isPreSelected={true}
              selected={self.isDiseaseSelected(this.state.preSelectedDisease)}
              selectDisease={self.selectDisease.bind(self)} />
          </div>
        }
        <div className="hm-disease-search">
          <div className="hm-disease-search-box shy-form-field">
            <input
              type="text"
              className="shy-form-field-input"
              value={this.state.diseaseQuery}
              onChange={
                (e) => {
                  this.searchDiseases(
                    e.target.value
                  );
                }
              }
              placeholder="Busca una enfermedad..."/>
          </div>
          {
            !!this.state.diseasesOptions.length && 
            <div className="hm-disease-search-results">
              {
                `${this.state.diseasesOptions.length + this.state.aggregationOptions.length} resultados de la búsqueda`
              }
            </div>
          }
        </div>
        {
          !this.state.diseasesOptions.length && 
          !this.state.aggregationOptions.length && 
          !this.state.isLoadingDiseases &&
          !!this.state.diseaseQuery.length &&
          <div className="hm-disease-no-results">
            { 'No se han encontrado resultados' }
          </div>
        }
        {
          !this.state.diseasesOptions.length && 
          !this.state.aggregationOptions.length && 
          !this.state.isLoadingDiseases &&
          !this.state.diseaseQuery.length &&
          <div className="hm-disease-no-results">
            { 'Ingresa una búsqueda' }
          </div>
        }
        {
          (!!this.state.aggregationOptions.length || 
            !!this.state.diseasesOptions.length) && 
          <div className="hm-disease-results">
            {
              !!this.state.aggregationOptions.length && 
              <div className="hm-disease-results-agrupaciones">
                <span className="hm-disease-result-groupname"> 
                  {
                    'AGRUPACIONES'
                  }
                </span>
                <div className="hm-disease-results-header">
                  <div className="hm-disease-row-name-container">
                    <span className="hm-disease-row-name-blanked"> Nombre </span>
                  </div>
                  <div className="hm-disease-row-cod">
                    <span className="hm-disease-row-name-blanked"> Código </span>
                  </div>
                </div>
                {
                  this.state.aggregationOptions
                    .map((disease, idx) => {
                      return <DiseaseRow
                        key={idx}
                        disease={disease}
                        selected={self.isDiseaseSelected(disease)}
                        isPreSelected={false}
                        type="aggregation"
                        selectDisease={self.selectDisease.bind(self)} />;
                    })
                }
              </div>
            }
            {
              !!this.state.diseasesOptions.length && 
                <div className="hm-disease-results-enfermedad">
                  <span className="hm-disease-result-groupname"> 
                    {
                      'ENFERMEDADES'
                    }
                  </span>
                  <div className="hm-disease-results-header">
                    <div className="hm-disease-row-name-container">
                      <span className="hm-disease-row-name-blanked"> Nombre </span>
                    </div>
                    <div className="hm-disease-row-cod">
                      <span className="hm-disease-row-name-blanked"> Código </span>
                    </div>
                  </div>
                  {
                    this.state.diseasesOptions
                      .map((disease, idx) => {
                        return <DiseaseRow
                          key={idx}
                          disease={disease}
                          type="disease"
                          selected={self.isDiseaseSelected(disease)}
                          isPreSelected={false}
                          selectDisease={self.selectDisease.bind(self)} />;
                      })
                  }              
                </div>
            }
          </div>
        }
        {
          this.state.isLoadingDiseases && 
          <Loading />
        }
        {
          this.state.errorLoadingDiseases && 
          <Error text={
            'Algo salió mal. Por favor, intentalo nuevamente.'
          }/>
        }
        <div className="hm-disease-button">
          <button 
            className="hm-btn hm-btn-primary hm-btn-full-width"
            disabled={!this.state.selectedDisease}
            onClick={() => {
              if (this.state.selectedDisease) {
                this.visualizeDiseases();
              }
            }}>
            {
              'VISUALIZAR'
            }
          </button>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    incidencesFilters: state.getIn(['incidences', 'filters']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken'])
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  mutateFilters: actions.mutateFilters,
  loadIncidences: loadIncidencesRequest
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiseaseTab);
