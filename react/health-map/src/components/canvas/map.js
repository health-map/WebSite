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
    const legendArray = this.state.legendQuantiles.reduce(
      (rlegendArray, q, idx, quantiles) => {
        if (idx === 0) { // first element
          rlegendArray.push({
            name: 'No se encontraron pacientes',
            color: Colors[0][0],
            opacity: Colors[0][1]
          });
        } else {
          if (idx === quantiles.length - 1) { //last element
            rlegendArray.push({
              name: `Más de ${String(q).substr(0, 5)}`,
              color: Colors[idx][0],
              opacity: Colors[idx][1]
            });
          } else if (
            ((idx + 1) != quantiles.length -1 ) && 
              !(q === quantiles[idx + 1])
          ) { // if next element not the last
            rlegendArray.push({
              name: `${String(quantiles[idx + 1]).substr(0, 5)} a ${String(q).substr(0, 5)}`,
              color: Colors[idx-1][0],
              opacity: Colors[idx-1][1]
            });
          }
        }
        return rlegendArray;
      }, []);
    return legendArray;
  }

  _loadData = incidences => {
    this.props.startLoadingMap();
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
  };

  _updateSettings = (incidences) => {
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
  };

  _onHover = (e, map) => {
    const hoveredFeatures = map.queryRenderedFeatures(e.point, {
      layers: ['data']
    });
    if (hoveredFeatures && hoveredFeatures.length) {
      const metrics = 
        JSON.parse(hoveredFeatures[0].properties.metrics);
      map.getCanvas().style.cursor = 'pointer';
      document.getElementById('pd').innerHTML = 
        '<h3><strong>' + 
        hoveredFeatures[0].properties.geofence_name +
        '</strong></h3><p><strong><em>' + 
        metrics.absolute + 
        '</strong> pacientes totales</em></p>';
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
        !!prevProps.immutableIncidences.get('features').size 
        && !!this.props.immutableIncidences.get('features').size &&
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
  addSelectedGeofenceOnGroup: generalActions.addSelectedGeofenceOnGroup
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);
