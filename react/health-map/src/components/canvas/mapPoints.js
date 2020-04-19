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
  Layer,
  Feature,
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
    if (pointsData && pointsData.size) {
      pointsData = pointsData.toJS();
    }
    let distributedPoints = {};
    if (pointsData && pointsData.length) {
      distributedPoints = pointsData.reduce((reducedP, p) => {
        if (Object.keys(reducedP).includes(p.cuarantine_status)) {
          reducedP[p.cuarantine_status].push(p);
        } else {
          reducedP[p.cuarantine_status] = [p];
        }
        return reducedP;
      }, {});
    }
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
          
          {
            distributedPoints && 
            Object.keys(distributedPoints) &&
            Object.keys(distributedPoints).length &&
            Object.keys(distributedPoints).map((status, idx) => {
              const pointsInStatus = distributedPoints[status];
              const cuarantineColor = {
                'OK': '#49dcb1',
                'NORMAL': '#eeb868',
                'BAD': '#ef767a'
              };
              return (
                <Layer
                  id={`patient-${status}-${idx}`}
                  key={`patient-${status}-${idx}`}
                  type="circle"
                  paint={{
                    'circle-color': cuarantineColor[status],
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                  }}>                
                  {
                    pointsInStatus.map((point, idx2) => {
                      return (
                        <Feature
                          id={`feature-patient-${idx}-${status}-${idx2}`}
                          key={`feature-patient-${idx}-${status}-${idx2}`}
                          coordinates={[
                            point.longitude,
                            point.latitude
                          ]}
                          onMouseEnter={(e) => {
                            e.map.getCanvas().style.cursor = 'pointer';
                          }}
                          onMouseLeave={(e) => {
                            e.map.getCanvas().style.cursor = '';
                          }}
                          onClick={() => {
                            console.log('click');
                          }}/>
                      );
                    })
                  }
                </Layer>
              );
            })
          }
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
