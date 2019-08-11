
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from './../shared/loading';
import Error from './../shared/error';

import { 
  loadGeozonesGroups,
  createGeozoneGroup
} from './../../services/remoteAPI';
import { actions } from './../../actions/general';
import { actions as incidencesActions } from './../../actions/incidences';

import { thunks } from '../../actions/thunks/incidences';
const { loadIncidences: loadIncidencesRequest } = thunks;


import './geogroupTab.css';

/**
 *
 */
class GeogroupRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      geozone
    } = this.props;
    return (
      <div 
        className="hm-disease-row"
        onClick={() => { 
          if (this.props.selectGeozone) {
            this.props.selectGeozone(geozone);
          }
        }}>
        <div className="hm-geozone-row-name-container">
          <span className="hm-disease-row-name">{geozone.name}</span>
          <span className="hm-disease-row-agrpnumber">
            <img
              className="hm-number-icon"
              src="https://cdn.shippify.co/icons/icon-notes-holder-gray-mini.svg"
              alt=""/>
            {
              `${geozone.polygons.length} zonas`
            }
          </span>
        </div>
        <div className="hm-geozone-row-cod">
          { 
            geozone.description
          }
        </div>
        <div className="hm-geozone-row-checkbox">
          <span className="icon marginless v1-margin-left-lg automerge-checkbox">
            <img
              className="icon-checkbox"
              src= {
                this.props.selected ?
                  'https://cdn.shippify.co/icons/icon-visibility-on-gray.svg' :
                  'https://cdn.shippify.co/icons/icon-visibility-off-gray.svg'
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
class GeogroupTab extends React.Component {
  state = {
    isLoadingGeozones: false,
    errorLoadingGeozones: false,
    selectedGeozone: undefined,
    geozonesQuery: '',
    geozonesOptions: [],
    newGeogroupName: '',
    newGeogroupNameValidation: '',
    newGeogroupDescription: ''
  }
  componentDidMount() {
    this.searchGeozones('');
  }
  componentDidUpdate() {

  }
  toggleCreateGeozoneGroup() {
    this.props.toggleGeozoneSelectionMode(
      !this.props.isGeozoneSelectionModeOn
    );
  }
  handleNewGeogroupDescriptionChange = (newGeogroupDescription) => {
    return this.setState({
      newGeogroupDescription
    });
  }
  handleNewGeogroupNameChange = (newGeogroupName) => {
    return this.setState({
      newGeogroupName
    });
  }
  validateNewGeogroupName = () => {
    if (!this.state.newGeogroupName ||
      this.state.newGeogroupName.length < 5) {
      this.setState({
        newGeogroupNameValidation: 'El nombre es muy corto. Debe tener al menos 5 caracteres.'
      });
      return false;
    }
    this.setState({
      newGeogroupNameValidation: ''
    });
    return true;
  }
  selectGeozone(selectedGeozone) {
    const self = this;
    if (this.state.selectedGeozone && 
      this.state.selectedGeozone.id == selectedGeozone.id) {
      this.setState({
        selectedGeozone: undefined
      });
      this.props.setGeozoneGroup(undefined);      
      this.props.mutateFilters('geogroup', undefined);
      this.props.loadIncidences({
        ...this.props.incidencesFilters.toJS(),
        geogroup: undefined
      });
    } else {
      this.setState({
        selectedGeozone
      }, () => {
        self.props.setGeozoneGroup(self.state.selectedGeozone);
        self.props.mutateFilters('geogroup', selectedGeozone.id);
        self.props.loadIncidences({
          ...self.props.incidencesFilters.toJS(),
          geogroup: selectedGeozone.id
        });
      });
    }
  }
  isGeozoneSelected(id) {
    if (this.props.selectedGeozoneGroup && 
      this.props.selectedGeozoneGroup.id === id) {
      return true;
    }
    if (!this.state.selectedGeozone) {
      return false;
    }
    return id == this.state.selectedGeozone.id;
  }
  searchGeozones(q) {
    const self = this;
    this.setState({
      geozonesQuery: q
    });
    this.setState({
      isLoadingGeozones: true,
      errorLoadingGeozones: false,
      geozonesOptions: [],
      selectedGeozone: undefined
    }, () => {
      loadGeozonesGroups(
        {
          q
        },
        {
          apiUrl: self.props.apiUrl,
          apiToken: self.props.apiToken
        }
      )
        .then((geogroups) => {
          let newState = {
            isLoadingGeozones: false,
            geozonesOptions: geogroups
          };
          if (self.props.selectedGeozoneGroup && 
            self.props.selectedGeozoneGroup.id) {
            newState.selectedGeozone = self.props.selectedGeozoneGroup;
          }
          self.setState(newState);
        })
        .catch((e) => {
          console.log('error', e);
          self.setState({
            errorLoadingGeozones: true,
            isLoadingGeozones: false,
            geozonesOptions: []
          });
        }); 
    });
  }
  createGeozoneGroup() {
    const self = this;
    if (!this.validateNewGeogroupName() 
      || !this.props.selectedGeozonesForGroup.size) {
      return;
    }
    this.setState({
      isLoadingGeozones: true,
      geozonesOptions: [],
      selectedGeozoneGroup: undefined
    }, () => {
      createGeozoneGroup({
        name: self.state.newGeogroupName, 
        description: self.state.newGeogroupDescription, 
        geofences: self.props.selectedGeozonesForGroup.map(g => g.get('id'))
      }, {
        apiUrl: self.props.apiUrl,
        apiToken: self.props.apiToken
      })
        .then(() => {
          self.toggleCreateGeozoneGroup();
          self.searchGeozones('');
        })
        .catch((e) => {
          console.log(e);
          self.toggleCreateGeozoneGroup();
          self.setState({
            errorLoadingGeozones: true,
            isLoadingGeozones: false,
            geozonesOptions: []
          }, () => {
            setTimeout(() => {
              self.searchGeozones('');
            }, 2000);
          });
        });
    });
  }
  render() {
    const self = this;
    return (
      <div className="hm-geozone-tab-container">
        {
          this.props.isGeozoneSelectionModeOn && 
          <div
            className="hm-geozone-creation-container">
            <div 
              className="hm-geozone-back"
              onClick={() => {
                this.toggleCreateGeozoneGroup();
              }}>
              <img 
                className="hm-arrow-back-icon"
                src="https://cdn.shippify.co/icons/icon-chevron-left-gray.svg"/>
              <span>
                {
                  'Volver'
                }
              </span>
            </div>
            <div
              className="hm-geozone-new-form">
              <span
                className="hm-geozone-new-form-title">
                {
                  'CREA UNA ZONA DE INTERÉS'
                }
              </span>
              <div>
                <div className="shy-form-field-label geozone-new-form-field">
                  <div>
                    { 'Ingresa el nombre de la zona de interés' }
                  </div>
                </div>
                <div className="shy-form-field">
                  <input
                    type="text"
                    className="shy-form-field-input"
                    value={this.state.newGeogroupName}
                    onChange={
                      (e) => {
                        this.handleNewGeogroupNameChange(
                          e.target.value
                        );
                      }
                    }
                    onBlur={this.validateNewGeogroupName}/>
                </div>
                {
                  (this.state.newGeogroupNameValidation.length > 0) &&
                  <div className="shy-form-error">
                    {
                      window.translation(
                        this.state.newGeogroupNameValidation
                      )
                    }
                  </div>
                }
              </div>
              <div>
                <div className="shy-form-field-label geozone-new-form-field">
                  <div>
                    { 'Ingresa una descripción para la zona de interés' }
                  </div>
                </div>
                <div className="shy-form-field">
                  <textarea
                    type="text"
                    className="shy-form-field-text-area"
                    rows="4"
                    value={this.state.newGeogroupDescription}
                    onChange={
                      (e) => {
                        this.handleNewGeogroupDescriptionChange(
                          e.target.value
                        );
                      }
                    }/>
                </div>
              </div>
              <span
                className="hm-geozone-new-form-title-secondary">
                {
                  'SECTORES ASOCIADOS'
                }
              </span>
              <span
                className="hm-geozone-new-sector-desc">
                {
                  'Selecciona los sectores dando click encima de ellos dentro del mapa'
                }
              </span>
              {
                !!this.props.selectedGeozonesForGroup.size &&
                <div>
                  {
                    this.props.selectedGeozonesForGroup
                      .map((geozone, idx) => {
                        return (
                          <div
                            key={idx}
                            className="hm-geozone-new-geozone">
                            <div>
                              {
                                geozone.get('name')
                              }
                            </div>
                            <img
                              className="icon-remove-geo"
                              src="https://cdn.shippify.co/icons/icon-close-circle-gray-mini.svg"
                              onClick={(e) => {
                                this.props.removeSelectedGeofenceOnGroup(
                                  geozone
                                );
                                e.stopPropagation();
                              }}
                              alt=""/>
                          </div>
                        );
                      })
                  }
                </div>
              }
            </div>
            <div className="hm-disease-button">
              <button 
                className="hm-btn hm-btn-primary hm-btn-full-width"
                onClick={() => {
                  this.createGeozoneGroup();
                }}>
                {
                  'CREAR'
                }
              </button>
            </div>
          </div>
        }
        {
          !this.props.isGeozoneSelectionModeOn &&
          <div>
            <div className="hm-disease-search">
              <div className="hm-disease-search-box shy-form-field">
                <input
                  type="text"
                  className="shy-form-field-input"
                  value={this.state.geozonesQuery}
                  onChange={
                    (e) => {
                      this.searchGeozones(
                        e.target.value
                      );
                    }
                  }
                  placeholder="Busca una zona de interés..."/>
              </div>
              {
                !!this.state.geozonesOptions.length && 
                <div className="hm-disease-search-results">
                  {
                    `${this.state.geozonesOptions.length} zonas de interés encontradas`
                  }
                </div>
              }
            </div>
            {
              !this.state.geozonesOptions.length && 
              !this.state.isLoadingGeozones &&
              !!this.state.geozonesQuery.length &&
              <div className="hm-geozone-no-results">
                { 'No se han encontrado resultados. Prueba con otra búsqueda.' }
              </div>
            }
            {
              !this.state.geozonesOptions.length &&
              !this.state.isLoadingGeozones &&
              !this.state.geozonesQuery.length &&
                <div className="hm-geozone-no-results">
                  { 
                    'No se han encontrado zonas de interés. Crea una dando click en el botón circular de abajo.' 
                  }
                </div>
            }
            {
              !!this.state.geozonesOptions.length && 
              <div className="hm-disease-results">
                <div className="hm-disease-results-agrupaciones">
                  <div className="hm-disease-results-header">
                    <div className="hm-geozone-row-name-container">
                      <span className="hm-disease-row-name-blanked"> Nombre </span>
                    </div>
                    <div className="hm-geozone-row-cod">
                      <span className="hm-disease-row-name-blanked"> Descripción </span>
                    </div>
                  </div>
                  {
                    this.state.geozonesOptions
                      .map((geozone, idx) => {
                        return <GeogroupRow
                          key={idx}
                          geozone={geozone}
                          selected={self.isGeozoneSelected(geozone.id)}
                          selectGeozone={self.selectGeozone.bind(self)}/>;
                      })
                  }
                </div>
              </div>
            }
            {
              this.state.isLoadingGeozones && 
              <Loading />
            }
            {
              this.state.errorLoadingGeozones && 
              <Error text={
                'Algo salió mal. Por favor, intentalo nuevamente.'
              }/>
            }
            <button 
              className="hm-fab-btn hm-fab-bottom-right"
              onClick={() => {
                this.toggleCreateGeozoneGroup();
              }}>
              <img
                src="https://cdn.shippify.co/icons/icon-add-white.svg" />
            </button>
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    selectedGeozoneGroup: state.getIn(['general', 'selectedGeozoneGroup']),
    selectedGeozonesForGroup: state.getIn(['general', 'selectedGeozonesForGroup']),
    isGeozoneSelectionModeOn: state.getIn(['general', 'isGeozoneSelectionModeOn']),
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken']),
    incidencesFilters: state.getIn(['incidences', 'filters'])
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setGeozoneGroup: actions.setGeozoneGroup,
  toggleGeozoneSelectionMode: actions.toggleGeozoneSelectionMode,
  removeSelectedGeofenceOnGroup: actions.removeSelectedGeofenceOnGroup,
  mutateFilters: incidencesActions.mutateFilters,
  loadIncidences: loadIncidencesRequest
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeogroupTab);
