/**
 *
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import ReactMapboxGl, {
  Layer,
  Feature,
  ZoomControl
} from 'react-mapbox-gl';

import { Mapbox } from './../../constants';
import DeliveryPopup from './deliveryPopup';
import { actions } from './../../actions/incidences';

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
      zoom: (this.props.selectedCity.zoom) ? this.props.selectedCity.zoom : 10
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selectedCity.cityId !== this.props.selectedCity.cityId) {
      this.setState({
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
        zoom: (this.props.selectedCity.zoom) ? this.props.selectedCity.zoom : 10
      });
    }
  }
  render() {
    const {
      polygons
    } = this.props;
    return (
      <MapboxMap
        style={ Mapbox.STYLE }
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
        }}>
        {
          false &&
          <div>
            {
              polygons.map((polygon, id) => {
                return (
                  <Layer
                    key={id}
                    type="fill"
                    paint={{
                      'fill-color': polygon.get('color'),
                      'fill-outline-color': polygon.get('color'),
                      'fill-opacity': 0.4
                    }}>
                    <Feature coordinates={
                      [polygon.get('coordinates').toArray()]
                    }/>
                  </Layer>
                );
              }).toArray()
            }
          </div>
        }
        {
          false &&
          <DeliveryPopup
            selectedGeozone={true}
            applyFilters={this.props.applyFilters}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}/>
        }
        <ZoomControl 
          style={{
            bottom: '60px'
          }}
          position="bottom-right"/>
      </MapboxMap>
    );
  }
}


/**
 *
 */
const mapStateToProps = (state) => {
  return {
    selectedGeozone: state.getIn(['incidences', 'selectedGeozone']),
    polygons: state.getIn(['polygon', 'polygons'])
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
