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
  dataLayer
} from './../../constants';
import { actions } from './../../actions/incidences';
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
      firstIncidencesData: undefined
    };
  }

  _loadData = incidences => {
    updatePercentiles(incidences, (f) => {
      return f.properties.metrics[this.props.incidencesFilters.get('type')];
    });
    const mapStyle = defaultMapStyle
      // Add geojson source to map
      .setIn(['sources', 'incomeByState'], Immutable.fromJS({ type: 'geojson',
        data: incidences }))
      // Add point layer to map
      .set('layers', defaultMapStyle.get('layers').push(dataLayer));

    this.setState({
      mapStyle,
      firstIncidencesData: incidences
    });
  };

  _updateSettings = (incidences) => {
    const { firstIncidencesData, mapStyle } = this.state;
    incidences.features = incidences.features.filter((incidence) => {
      return incidence.properties.isVisible;
    });
    if (firstIncidencesData && incidences) {
      updatePercentiles(incidences, (f) => {
        return f.properties.metrics[this.props.incidencesFilters.get('type')];
      } );
      const newMapStyle = mapStyle.setIn(
        ['sources', 'incomeByState', 'data'], 
        Immutable.fromJS(incidences)
      );
      this.setState({ mapStyle: newMapStyle });
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
      map.getCanvas().style.cursor = 'pointer';
      document.getElementById('pd').innerHTML = 
        '<p>Acerca el mouse a un sector...</p>';
    }
  };

  componentDidUpdate(prevProps) {

    if (prevProps.immutableIncidences.get('init') 
      && !this.props.immutableIncidences.get('init')) {
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
      this._updateSettings(this.props.immutableIncidences.toJS());
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
            this.setState({ map });
            map.addControl(new MapboxTraffic());
            map.on('mousemove', (e) => {
              this._onHover(e, map);
            });
          }}>
          <ZoomControl 
            style={{
              bottom: '60px'
            }}
            position="bottom-right"/>
        </MapboxMap>
        <div 
          className="map-overlay hm-hover-box">
          <span
            className="hm-hover-box-title">
              INFORMACION DE SECTOR
          </span>
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
    incidencesFilters: state.getIn(['incidences', 'filters'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectGeozone: actions.selectGeozone
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);
