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
  defaultMapStyle
} from './../../constants';
import { actions } from './../../actions/incidences';

import './map.css';

const MapboxMap = ReactMapboxGl({
  accessToken: Mapbox.TOKEN
});


/**
 *
 */
class MapPointsComponent extends React.Component {
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

  componentDidMount() {
    this.props.startLoadingMap();
  }

  componentDidUpdate(prevProps) {
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
    let {
      pointsData
    } = this.props;
    console.log('pointsData', pointsData);
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
          }}>
          <ZoomControl 
            style={{
              bottom: '140px'
            }}
            position="bottom-right"/>
        </MapboxMap>
      </div>
    );
  }
}


/**
 *
 */
const mapStateToProps = (state) => {
  return {
    pointsData: state.getIn(['incidences', 'pointsData']),
    incidencesFilters: state.getIn(['incidences', 'filters']),
    isLoadingMap: state.getIn(['incidences', 'isLoadingMap']),
    mapBounds: state.getIn(['incidences', 'mapBounds'])
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  startLoadingMap: actions.startLoadingMap,
  finishLoadingMap: actions.finishLoadingMap,
  setMapBounds: actions.setMapBounds
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapPointsComponent);
