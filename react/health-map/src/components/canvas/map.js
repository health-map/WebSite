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
  // Layer,
  // Feature,
  ZoomControl
} from 'react-mapbox-gl';

import { 
  Mapbox,
  defaultMapStyle, 
  dataLayer
} from './../../constants';
// import DeliveryPopup from './deliveryPopup';
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
      console.log('actualizando');
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

    if (prevProps.immutableIncidences.get('init') 
      && !this.props.immutableIncidences.get('init')) {
      console.log('call load data', this.props.immutableIncidences);
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
      console.log('actualizate');
      this._updateSettings(this.props.immutableIncidences.toJS());
    }

  }
  render() {
    // let {
    //   incidences
    // } = this.props;
    console.log('rerendering;;;;;', this.state.mapStyle);
    return (
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
        }}>
        {/* {
          !!incidences.length &&
          <div>
            {
              incidences
                .filter((incidence) => incidence.isVisible)
                .map((incidence, id) => {
                  return (
                    <Layer
                      key={`layer-polygons-${id}`}
                      type="fill"
                      paint={{
                        'fill-color': incidence.color,
                        'fill-outline-color': incidence.color,
                        'fill-opacity': 0.3
                      }}>
                      <Feature 
                        key={`feature-polygons-${id}`}
                        onMouseEnter={(e) => {
                          e.map.getCanvas().style.cursor = 'pointer';
                        }}
                        onMouseLeave={(e) => {
                          e.map.getCanvas().style.cursor = '';
                        }}
                        coordinates={
                          [incidence.polygon.coordinates[0]]
                        }
                        onClick={() => {

                        }}/>
                    </Layer>
                  );
                })
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
        } */}
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
