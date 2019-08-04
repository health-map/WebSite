
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from './../shared/loading';
import Error from './../shared/error';

import { loadDiseases } from './../../services/remoteAPI';
import { actions } from './../../actions/general';

import './diseaseTab.css';

/**
 *
 */
class DiseaseRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      disease
    } = this.props;
    console.log(this.props.selected);
    return (
      <div 
        className={`hm-disease-row ${this.props.isPreSelected ? 'hm-disease-row-preselected' : ''}`}
        onClick={() => { 
          if (this.props.selectDisease) {
            this.props.selectDisease(disease); 
          }
        }}>
        <div className="hm-disease-row-name-container">
          <span className="hm-disease-row-name">{disease.name}</span>
          {
            disease.type === 'agrupacion' &&
            <span className="hm-disease-row-agrpnumber">
              <img
                className="hm-number-icon"
                src="https://cdn.shippify.co/icons/icon-notes-holder-gray-mini.svg"
                alt=""/>
              {
                `7 ${'enfermedades'}`
              }
            </span>
          }
        </div>
        <div className="hm-disease-row-cod">
          { 
            disease.cie10
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
    diseasesOptions: []
  }
  componentDidMount() {

  }
  componentDidUpdate() {

  }
  selectDisease(selectedDisease) {
    this.setState({
      selectedDisease
    });
  }
  isDiseaseSelected(diseaseId) {
    if (!this.state.selectedDisease) {
      return false;
    }
    return diseaseId == this.state.selectedDisease.id;
  }
  searchDiseases(q) {
    const self = this;
    this.setState({
      diseaseQuery: q
    });
    if (q.length < 7) {
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
        .then((diseases) => {
          console.log('diseases', diseases);
          self.setState({
            isLoadingDiseases: false,
            diseasesOptions: diseases
          });
        })
        .catch((e) => {
          console.log('error', e);
          self.setState({
            errorLoadingDiseases: true,
            diseasesOptions: []
          });
        }); 
    });
  }
  visualizeDiseases() {
    this.props.setDisease(this.state.selectedDisease);
  }
  render() {
    const self = this;
    const {
      preSelectedDisease
    } = this.props;
    return (
      <div className="hm-disease-tab-container">
        {
          !!preSelectedDisease && 
          <div className="hm-disease-preselected">
            { 'La siguiente enfermedad esta siendo mostrada actualmente: ' }
            <DiseaseRow
              disease={preSelectedDisease}
              isPreSelected={true}
              selected={self.isDiseaseSelected(disease.id)}
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
                `${this.state.diseasesOptions.length} resultados de la búsqueda`
              }
            </div>
          }
        </div>
        {
          !this.state.diseasesOptions.length && 
          !this.state.isLoadingDiseases &&
          !!this.state.diseaseQuery.length &&
          <div className="hm-disease-no-results">
            { 'No se han encontrado resultados' }
          </div>
        }
        {
          !this.state.diseasesOptions.length && 
          !this.state.isLoadingDiseases &&
          !this.state.diseaseQuery.length &&
          <div className="hm-disease-no-results">
            { 'Ingresa una búsqueda' }
          </div>
        }
        {
          !!this.state.diseasesOptions.length && 
          <div className="hm-disease-results">
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
                this.state.diseasesOptions
                  .filter(disease => disease.type === 'agrupacion')
                  .map((disease, idx) => {
                    return <DiseaseRow
                      key={idx}
                      disease={disease}
                      selected={self.isDiseaseSelected(disease.id)}
                      isPreSelected={false}
                      selectDisease={self.selectDisease.bind(self)} />;
                  })
              }
            </div>
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
                  .filter(disease => disease.type === 'disease')
                  .map((disease, idx) => {
                    return <DiseaseRow
                      key={idx}
                      disease={disease}
                      selected={self.isDiseaseSelected(disease.id)}
                      isPreSelected={false}
                      selectDisease={self.selectDisease.bind(self)} />;
                  })
              }              
            </div>
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
    preSelectedDisease: state.getIn(['general', 'selectedDisease'])
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setDisease: actions.setDisease
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiseaseTab);
