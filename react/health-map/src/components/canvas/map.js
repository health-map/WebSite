/**
 *
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import ReactMapboxGl, {
  ZoomControl
} from 'react-mapbox-gl';
import {
  FaCloudRain,
  FaThermometerFull,
  FaThermometerQuarter,
  FaThermometerHalf,
  FaWind,
  FaWater
} from 'react-icons/fa';
import { 
  Mapbox,
  defaultMapStyle, 
  dataLayer,
  Colors
} from './../../constants';
import { actions } from './../../actions/incidences';
import { actions as generalActions } from './../../actions/general';
import { updatePercentiles } from '../../utils';

import './map.css';

const MapboxMap = ReactMapboxGl({
  accessToken: Mapbox.TOKEN
});


/**
 *
 */
class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [
        (
          this.props.selectedCity.bounds.west +
          this.props.selectedCity.bounds.east
        )/2,
        (
          this.props.selectedCity.bounds.north +
          this.props.selectedCity.bounds.south
        )/2
      ],
      zoom: (this.props.selectedCity.zoom) ? this.props.selectedCity.zoom : 10,
      mapStyle: defaultMapStyle,
      firstIncidencesData: undefined,
      legendQuantiles: []
    };
  }

  addSelectedGeofenceOnGroup = (e, map) => {
    const clickedFeatures = map.queryRenderedFeatures(e.point, {
      layers: ['data']
    });
    if (clickedFeatures && clickedFeatures.length) {
      const clickedFeature = {
        id: clickedFeatures[0].properties.id,
        name: clickedFeatures[0].properties.geofence_name
      };
      this.props.addSelectedGeofenceOnGroup(Immutable.fromJS(clickedFeature));
    }
  }

  buildLegendArray() {
    const appendFinal = 
      (this.props.incidencesFilters.get('type') === 'absolute' ||
      this.props.incidencesFilters.get('type') === 'every1000Inhabitants') ?
        '' : '%';

    const legendArray = this.state.legendQuantiles.reduce(
      (rlegendArray, q, idx, quantiles) => {
        if (idx === 0 && quantiles[idx] === 0) { // if first element == 0
          rlegendArray.push({
            name: 'No se encontraron pacientes',
            color: Colors[0][0],
            opacity: Colors[0][1]
          });
        } else {
          if (idx === 0) {
            rlegendArray.push({
              name: `0 a ${String(q).substr(0, 6) + appendFinal}`,
              color: Colors[0][0],
              opacity: Colors[0][1]
            });            
          }
          if (idx === quantiles.length - 1) { //last element
            rlegendArray.push({
              name: `Más de ${String(q).substr(0, 6) + appendFinal}`,
              color: Colors[idx + 1][0],
              opacity: Colors[idx + 1][1]
            });
          } else if (
            ((idx + 1) !== (quantiles.length - 1)) && 
              !(q === quantiles[idx + 1])
          ) { // if not penultimo
            rlegendArray.push({
              name: `${String(q).substr(0, 6) + appendFinal} a ${String(quantiles[idx + 1]).substr(0, 6) + appendFinal}`,
              color: Colors[idx + 1][0],
              opacity: Colors[idx + 1][1]
            });
          } else if ((idx + 1) === (quantiles.length - 1)) { // if penultimo
            rlegendArray.push({
              name: `${String(q).substr(0, 6) + appendFinal} a ${String(quantiles[idx + 1]).substr(0, 6) + appendFinal}`,
              color: Colors[idx + 1][0],
              opacity: Colors[idx  + 1][1]
            });            
          }
        }
        return rlegendArray;
      }, []);
    return legendArray;
  }

  _loadData = incidences => {
    if (incidences.features.lenght < 1 ) {
      const mapStyle = defaultMapStyle
        // Add geojson source to map
        .setIn(['sources', 'incidences'], Immutable.fromJS({ type: 'geojson',
          data: [] }))
        // Add point layer to map
        .set('layers', defaultMapStyle.get('layers').splice(10, 1));
      this.setState({
        mapStyle,
        firstIncidencesData: undefined,
        legendQuantiles: [0]
      });
    } else {
      const scale = updatePercentiles(incidences, (f) => {
        return f.properties.metrics[this.props.incidencesFilters.get('type')];
      });
      const mapStyle = defaultMapStyle
        // Add geojson source to map
        .setIn(['sources', 'incidences'], Immutable.fromJS({ type: 'geojson',
          data: incidences }))
        // Add point layer to map
        .set('layers', defaultMapStyle.get('layers').splice(10, 0, dataLayer));
  
      this.setState({
        mapStyle,
        firstIncidencesData: incidences,
        legendQuantiles: scale
      });
    }
  };

  _updateSettings = (incidences) => {
    if (incidences.features.lenght < 1 ) {
      this.props.startLoadingMap();
      const { mapStyle } = this.state;
      // Add geojson source to map
      const newMapStyle = 
        mapStyle.setIn(['sources', 'incidences', 'data'], 
          Immutable.fromJS(
            {
              type: 'FeatureCollection',
              features: []
            }
          ));
      this.setState({
        mapStyle: newMapStyle,
        firstIncidencesData: undefined,
        legendQuantiles: []
      }, () => {
        this.props.finishLoadingMap();
      });
    } else {
      this.props.startLoadingMap();
      const { firstIncidencesData, mapStyle } = this.state;
      incidences.features = incidences.features.filter((incidence) => {
        return incidence.properties.isVisible;
      });
      if (firstIncidencesData && incidences) {
        const scale = updatePercentiles(incidences, (f) => {
          return f.properties.metrics[this.props.incidencesFilters.get('type')];
        } );
        const newMapStyle = mapStyle.setIn(
          ['sources', 'incidences', 'data'], 
          Immutable.fromJS(incidences)
        );
        this.setState({ 
          mapStyle: newMapStyle,
          legendQuantiles: scale 
        }, () => {
          this.props.finishLoadingMap();
        });
      }
    }
  };

  _onHover = (e, map) => {
    if (this.props.incidences.features.length < 1) {
      return;
    }
    const hoveredFeatures = map.queryRenderedFeatures(e.point, {
      layers: ['data']
    });
    if (hoveredFeatures && hoveredFeatures.length) {
      const metrics = 
        JSON.parse(hoveredFeatures[0].properties.metrics);
      map.getCanvas().style.cursor = 'pointer';
      const legendtext = [
        '<h3 class="hm-legend-geofence-name"><strong>', hoveredFeatures[0].properties.geofence_name, '</strong></h3>', 
        '<p><strong><em>', metrics.absolute, '</strong> pacientes totales</em></p>',
        '<p><strong><em>', String(metrics.every1000Inhabitants).substr(0, 5), '</strong> pacientes por cada mil habitantes</em></p>',
        '<p><strong><em>', String(metrics.relativeToPopulation).substr(0, 5), '%</strong> relativo a la poblacion del sector</em></p>',
        '<p><strong><em>', String(metrics.relativeToPatients).substr(0, 5), '%</strong> relativo al número de pacientes del sector</em></p>'
      ].join('');
      document.getElementById('pd').innerHTML = legendtext;
    } else {
      map.getCanvas().style.cursor = '';
      document.getElementById('pd').innerHTML = 
        '<p>Acerca el mouse a un sector...</p>';
    }
  };
  componentDidMount() {
    this.props.startLoadingMap();
  }
  componentDidUpdate(prevProps) {

    if (prevProps.immutableIncidences.get('init') 
      && !this.props.immutableIncidences.get('init')) {
      this.props.startLoadingMap();
      this._loadData(this.props.immutableIncidences.toJS());
    }

    if (
      (
        !prevProps.immutableIncidences.equals(this.props.immutableIncidences)
      ) 
        ||
      (
        !prevProps.incidencesFilters.equals(this.props.incidencesFilters)
      )
    ) {
      this.props.startLoadingMap();
      this._updateSettings(this.props.immutableIncidences.toJS());
    }

    if (!prevProps.mapBounds.equals(this.props.mapBounds)) {
      this.state.map.fitBounds(this.props.mapBounds.toJS(), { 
        padding: { top: 64,
          bottom: 64,
          left: 250,
          right: 20 } 
      });
    }

  }
  render() {
    const areIncidencesAvailable = this.props.incidences.features.length >= 1 ?
      !this.props.incidences.features.every((f) => {
        return f.properties.metrics.absolute == 0;
      }) : false;
    return (
      <div>
        <MapboxMap
          style={ this.state.mapStyle.toJS() }
          containerStyle = {{
            height: '100vh'
          }}
          center={this.state.center}
          zoom={[this.state.zoom]}
          onZoom={(map) => {
            this.setState({
              zoom: map.getZoom()
            });
          }}
          onStyleLoad={(map) => {
            this.setState({ 
              map
            });
            this.props.finishLoadingMap();
            map.addControl(new MapboxTraffic());
            map.on('mousemove', (e) => {
              this._onHover(e, map);
            });
            map.on('mousedown', (e) => {
              if (this.props.isGeozoneSelectionModeOn) {
                this.addSelectedGeofenceOnGroup(e, map);
              }
            });
          }}>
          <ZoomControl 
            style={{
              bottom: '140px'
            }}
            position="bottom-right"/>
        </MapboxMap>
        <div 
          className="map-overlay hm-hover-box">
          {
            !areIncidencesAvailable &&
            !this.props.isLoadingMap &&
            <span
              className="hm-hover-box-title">
              NO SE ENCONTRARON DATOS
            </span>
          }
          {
            !!areIncidencesAvailable &&
            <div>
              <span
                className="hm-hover-box-title">
                  LEYENDA
              </span>
              <div
                className="hm-legend-box">           
                {
                  this.buildLegendArray().map((row, idx) => {
                    return (
                      <div
                        key={idx}
                        className="hm-legend-row">
                        <div
                          className="hm-legend-color-box"
                          style={{ 
                            backgroundColor: row.color,
                            opacity: row.opacity
                          }}>
                        </div>
                        <div 
                          className="hm-legend-name">
                          {
                            row.name
                          }
                        </div>
                      </div>
                    );
                  })
                }
              </div>

              <div id='pd'>
                <p>Acerca el mouse a un sector...</p>
              </div>

              <span
                className="hm-hover-box-title"
                style={{ marginTop: '8px' }}>
                  DATOS METEOROLÓGICOS DE GUAYAQUIL
              </span>
              <div
                className="hm-legend-box">           
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaThermometerFull 
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Temp. máxima</div>
                  <div className="hm-temp-value">38°C</div>
                </div>
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaThermometerQuarter 
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Temp. mínima</div>
                  <div className="hm-temp-value">19°C</div>
                </div>
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaThermometerHalf
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Temp. promedio</div>
                  <div className="hm-temp-value">24°C</div>
                </div>
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaCloudRain
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Precipitación</div>
                  <div className="hm-temp-value">35mm</div>
                </div>
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaWater
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Humedad promedio</div>
                  <div className="hm-temp-value">42%</div>
                </div>
                <div className="hm-legend-row">
                  <div className="hm-legend-meteor-box">
                    <FaWind
                      size={20}
                      color="#0b7895"/>
                  </div>
                  <div className="hm-temp-desc">Velocidad de Viento</div>
                  <div className="hm-temp-value">2.6m/s</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}


/**
 *
 */
const mapStateToProps = (state) => {
  return {
    incidences: state.getIn(['incidences', 'data']).toJS(),
    immutableIncidences: state.getIn(['incidences', 'data']),
    incidencesFilters: state.getIn(['incidences', 'filters']),
    isLoadingMap: state.getIn(['incidences', 'isLoadingMap']),
    mapBounds: state.getIn(['incidences', 'mapBounds']),
    isGeozoneSelectionModeOn: state.getIn(['general', 'isGeozoneSelectionModeOn'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectGeozone: actions.selectGeozone,
  startLoadingMap: actions.startLoadingMap,
  finishLoadingMap: actions.finishLoadingMap,
  addSelectedGeofenceOnGroup: generalActions.addSelectedGeofenceOnGroup,
  setMapBounds: actions.setMapBounds
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);
