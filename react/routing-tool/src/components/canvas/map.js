/**
 *
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DrawControl from 'react-mapbox-gl-draw';
import ReactMapboxGl, {
  Layer,
  Feature,
  ZoomControl
} from 'react-mapbox-gl';

import { Mapbox } from './../../constants';
import DeliveryPopup from './deliveryPopup';
import { actions } from './../../actions/routes';
import { thunks } from './../../actions/thunks/routes';
import { actions as polygonActions } from './../../actions/polygon';
import { areCommonPoints } from './../../services/utils';
import AddDeliveries from './../addDeliveries/addDeliveries';
const { loadRoute: loadRouteRequest } = thunks;

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
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
      selectedStop: undefined
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
    if (this.state.selectedStop) {
      const routesWithId = this.props.routes.filter((route) => {
        return (route.get('id') === this.state.selectedStop.routeId);
      });
      if (routesWithId.size === 0) {
        this.setState({
          selectedStop: undefined
        });
      }
    }
    if (prevProps.listWidth !== this.props.listWidth) {
      if (this.state.map) {
        this.state.map.resize();
      }
    }
    if (
      !prevProps.selectedRouteToReorder &&
      this.props.selectedRouteToReorder
    ) {
      const selectedRouteToReorder = this.props.selectedRouteToReorder;
      if (!selectedRouteToReorder.get('points')) {
        this.props.loadRoute(
          selectedRouteToReorder.get('id'),
          selectedRouteToReorder.get('schedule').reduce((points, currentPoint) => {
            points.push(
              {
                latitude: currentPoint.getIn(['data', 'location', 'geopoint', 'latitude']),
                longitude: currentPoint.getIn(['data', 'location', 'geopoint', 'longitude'])
              }
            );
            return points;
          }, [])
        );
      }
    }
    if (prevProps.polygons.size !== this.props.polygons.size) {
      prevProps.polygons.map((polygon, id) => {
        if (!this.props.polygons.has(id) && this.drawControl) {
          this.drawControl.draw.delete(id);
        }
      });
    }
  }
  onDrawDelete = (props) => {
    this.props.deletePolygon(
      props.features[0].id,
      this.props.filteredStep
    );
  }
  onDrawCreate = ({ features }) => {
    this.props.createOrUpdatePolygon(
      features[0].id,
      features[0].geometry.coordinates[0],
      this.props.filteredStep
    );
  };
  onDrawUpdate = ({ features }) => {
    this.props.createOrUpdatePolygon(
      features[0].id,
      features[0].geometry.coordinates[0],
      this.props.filteredStep
    );
  };
  render() {
    const {
      routes, selectedStep, selectStep, selectedRouteToReorder, groupType,
      isPolygonToolOpened, polygonSteps, groupedPolygonSteps, polygons,
      selectedRouteIdToAddDeliveries, setListWidth, singleDeliveryPath,
      singleDeliveries, areRemainingDeliveriesVisible, selectedPointsType,
      selectedRoute, selectedRouteIdToDivide
    } = this.props;
    // setting up polygon layers
    const groupedPolygonStepsLayers = [];
    groupedPolygonStepsLayers.push( // polygon tool pickup points letters
      <Layer
        id={'pickups'}
        key={'pickups'}
        type="symbol"
        layout={{
          'text-font': ['Arial Unicode MS Bold'],
          'text-transform': 'uppercase',
          'text-allow-overlap': false,
          'text-size': 12,
          'text-field': `${window.translation('P')}`
        }}
        paint={{
          'text-color': '#757575'
        }}>
        {
          polygonSteps
            .filter(s => ((s.get('activityType').charAt(0)
            === selectedPointsType.charAt(0).toLowerCase()
            || selectedPointsType === 'All')
            && s.get('activityType') === 'pickup'))
            .map((step, idx) => {
              return (
                <Feature
                  key={idx}
                  coordinates={[
                    step.getIn(['pickup', 'location', 'longitude']),
                    step.getIn(['pickup', 'location', 'latitude'])
                  ]}/>
              );
            }).toJSON()
        }
      </Layer>
    );
    groupedPolygonStepsLayers.push( // polygon pickups circles
      <Layer 
        id='disabled-steps'
        key='disabled-steps'
        before="pickups"
        type="circle"
        paint={{
          'circle-color': ( groupType === 'pickup' ? polygonSteps.getIn([0, 'color']) : '#fff'  ),
          'circle-radius': ( groupType === 'pickup' ? 6 : 11 ),
          'circle-stroke-width': ( groupType === 'pickup' ? 1 : 2 ),
          'circle-stroke-color': ( groupType === 'pickup' ? '#fff' : '#ef404b' )
        }}>
        {
          polygonSteps
            .filter(s => ((s.get('activityType').charAt(0)
            === selectedPointsType.charAt(0).toLowerCase()
            || selectedPointsType === 'All')
            && s.get('activityType') !== groupType))
            .map((step, idx) => {
              return (
                <Feature
                  key={`disabled-step-${idx}`}
                  onClick={() => {
                    selectStep(
                      'Single',
                      step.get('id'),
                      (step.get('activityType') === 'pickup') ?
                        'P' :
                        'D',
                      '#757575'
                    );
                  }}
                  coordinates={
                    (step.get('activityType') === 'pickup') ?
                      [
                        step.getIn(['pickup', 'location', 'longitude']),
                        step.getIn(['pickup', 'location', 'latitude'])
                      ] :
                      [
                        step.getIn(['dropoff', 'location', 'longitude']),
                        step.getIn(['dropoff', 'location', 'latitude'])
                      ]
                  }
                  onMouseEnter={(e) => {
                    e.map.getCanvas().style.cursor = 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    e.map.getCanvas().style.cursor = '';
                  }}/>
              );
            }).toJSON()
        }
      </Layer>
    );
    groupedPolygonSteps.map((steps, id) => {
      groupedPolygonStepsLayers.push( // dropoffs points circles
        <Layer
          id={id}
          key={id}
          before="pickups"
          type="circle"
          paint={{
            'circle-color': ( groupType === 'pickup' ? '#fff' : steps.getIn([0, 'color']) ),
            'circle-radius': ( groupType === 'pickup' ? 11 : 6 ),
            'circle-stroke-width': ( groupType === 'pickup' ? 2 : 1 ),
            'circle-stroke-color': ( groupType === 'pickup' ? '#ef404b' : '#fff' )
          }}>
          {
            steps
              .filter(s => ((s.get('activityType').charAt(0)
              === selectedPointsType.charAt(0).toLowerCase()
              || selectedPointsType === 'All')
              && s.get('activityType') === groupType))
              .map((step, idx) => {
                return (
                  <Feature
                    key={idx}
                    onClick={() => {
                      selectStep(
                        'Single',
                        step.get('id'),
                        (step.get('activityType') === 'pickup') ?
                          'P' :
                          'D'
                      );
                    }}
                    coordinates={
                      (step.get('activityType') === 'pickup') ?
                        [
                          step.getIn(['pickup', 'location', 'longitude']),
                          step.getIn(['pickup', 'location', 'latitude'])
                        ] :
                        [
                          step.getIn(['dropoff', 'location', 'longitude']),
                          step.getIn(['dropoff', 'location', 'latitude'])
                        ]
                    }
                    onMouseEnter={(e) => {
                      e.map.getCanvas().style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                      e.map.getCanvas().style.cursor = '';
                    }}/>
                );
              }).toJSON()
          }
        </Layer>
      );
    });
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
        onStyleLoad={(map) => this.setState({ map })}>
        {
          singleDeliveries &&
          singleDeliveries.get('isVisible') &&
          !isPolygonToolOpened &&
          singleDeliveryPath &&
          (selectedPointsType === 'All') &&
          <Layer
            id='single-delivery-path'
            before='route-dropoffs-schedule-0'
            type='line'
            layout={{
              'line-cap': 'round',
              'line-join': 'round'
            }}
            paint={{
              'line-color': singleDeliveries.get('color'),
              'line-width': 3
            }}>
            <Feature
              coordinates={
                singleDeliveryPath
                  .reduce((computedPoints, point) => {
                    computedPoints.push([
                      point.longitude,
                      point.latitude
                    ]);
                    return computedPoints;
                  }, [])
              }/>
          </Layer>
        }
        {
          isPolygonToolOpened &&
          <div>
            <div>
              {
                groupedPolygonStepsLayers
              }
            </div>
            <DrawControl
              controls={{
                polygon: true,
                trash: true,
                point: false,
                line_string: false,
                combine_features: false,
                uncombine_features: false
              }}
              onDrawCreate={this.onDrawCreate}
              onDrawUpdate={this.onDrawUpdate}
              onDrawDelete={this.onDrawDelete}
              ref={(drawControl) => {
                this.drawControl = drawControl;
              }}/>
            <div className="polygon-tools">
              <div
                className="draw-shape"
                onMouseEnter={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_polygon')[0]
                    .style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_polygon')[0]
                    .style.backgroundColor = '#fff';
                }}
                onClick={() => this.drawControl.draw.changeMode('draw_polygon')}>
                { window.translation('Draw Shape') }
              </div>
              <div
                className="delete-shape"
                onMouseEnter={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_trash')[0]
                    .style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_trash')[0]
                    .style.backgroundColor = '#fff';
                }}
                onClick={() => this.drawControl.draw.trash()}>
                { window.translation('Delete Shape') }
              </div>
            </div>
            <div>
              {
                polygons.map((polygon, id) => {
                  return (
                    <Layer
                      key={id}
                      type="fill"
                      before="disabled-steps"
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
            {
              areRemainingDeliveriesVisible &&
              <Layer
                key='remaining-deliveries'
                type="symbol"
                layout={{
                  'icon-allow-overlap': true,
                  'icon-image': 'marker-11',
                  'icon-anchor': 'bottom',
                  'icon-size': 1
                }}>
                {
                  polygonSteps
                    .filter(s => {
                      return (
                        !s.has('polygonId') &&
                        (s.get('activityType') === groupType)
                      );
                    })
                    .map((s, idx) => {
                      return (
                        <Feature
                          key={`remaining-deliveries-feature-${idx}`}
                          coordinates={[
                            s.getIn(
                              [s.get('activityType'), 'location', 'longitude']
                            ),
                            s.getIn(
                              [s.get('activityType'), 'location', 'latitude']
                            )
                          ]}/>
                      );
                    }).toJSON()
                }
              </Layer>
            }
          </div>
        }
        { 
          selectedRouteIdToDivide &&
          <div>
            <DrawControl
              controls={{
                polygon: true,
                trash: true,
                point: false,
                line_string: false,
                combine_features: false,
                uncombine_features: false
              }}
              onDrawCreate={this.onDrawCreate}
              onDrawUpdate={this.onDrawUpdate}
              onDrawDelete={this.onDrawDelete}
              position="top-left"
              ref={(drawControl) => {
                this.drawControl = drawControl;
              }}/>
            <div className="polygon-tools">
              <div
                className="draw-shape"
                onMouseEnter={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_polygon')[0]
                    .style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_polygon')[0]
                    .style.backgroundColor = '#fff';
                }}
                onClick={() => this.drawControl.draw.changeMode('draw_polygon')}>
                { window.translation('Draw Shape') }
              </div>
              <div
                className="delete-shape"
                onMouseEnter={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_trash')[0]
                    .style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={() => {
                  document
                    .getElementsByClassName('mapbox-gl-draw_trash')[0]
                    .style.backgroundColor = '#fff';
                }}
                onClick={() => this.drawControl.draw.trash()}>
                { window.translation('Delete Shape') }
              </div>
            </div>
            <div>
              {
                polygons.map((polygon, id) => {
                  return (
                    <Layer
                      key={id}
                      type="fill"
                      before="disabled-steps"
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
          </div>
        }
        {
          selectedRouteToReorder &&
          <div>
            <Layer
              id='reorder-route'
              type='line'
              layout={{
                'line-cap': 'round',
                'line-join': 'round'
              }}
              paint={{
                'line-color': selectedRouteToReorder.get('color'),
                'line-width': 3
              }}>
              <Feature coordinates={
                selectedRouteToReorder
                  .get('points', [])
                  .reduce((computedPoints, point) => {
                    computedPoints.push([
                      point.longitude,
                      point.latitude
                    ]);
                    return computedPoints;
                  }, [])
              }/>
            </Layer>
            <Layer
              id='reorder-steps'
              type="circle"
              paint={{
                'circle-color': '#fff',
                'circle-radius': 11,
                'circle-stroke-width': 2,
                'circle-stroke-color': selectedRouteToReorder.get('color')
              }}>
              {
                selectedRouteToReorder.get('steps') &&
                selectedRouteToReorder.get('steps').map((steps, idx) => {
                  return (
                    <Feature
                      key={`circle-${idx}`}
                      coordinates={[
                        steps.getIn([0, 'location', 'longitude']),
                        steps.getIn([0, 'location', 'latitude'])
                      ]}
                      onMouseEnter={(e) => {
                        e.map.getCanvas().style.cursor = 'pointer';
                      }}
                      onMouseLeave={(e) => {
                        e.map.getCanvas().style.cursor = '';
                      }}/>
                  );
                }).toJSON()
              }
            </Layer>
            {
              selectedRouteToReorder.get('steps') &&
              selectedRouteToReorder.get('steps').map((steps, idx) => {
                return (
                  <Layer
                    key={`symbol-${idx}`}
                    type='symbol'
                    layout={{
                      'text-allow-overlap': true,
                      'text-transform': 'uppercase',
                      'text-size': 12,
                      'text-field': `${(idx + 1)}`
                    }}
                    paint={{
                      'text-color': '#757575'
                    }}>
                    <Feature
                      coordinates={[
                        steps.getIn([0, 'location', 'longitude']),
                        steps.getIn([0, 'location', 'latitude'])
                      ]}
                      onClick={() => {
                        selectStep(
                          selectedRouteToReorder.get('id'),
                          steps.getIn([0, 'deliveryId']),
                          (steps.getIn([0, 'activityType']) === 'pickup') ?
                            'P' :
                            'D'
                        );
                      }}/>
                  </Layer>
                );
              }).toJSON()
            }
          </div>
        }
        { // rendering points out of tools
          !isPolygonToolOpened &&
          !selectedRouteToReorder &&
          routes.map((route, idx) => { // path of routes on any map view
            return (
              <div key={idx}>
                <Layer
                  id={`route-${idx}`}
                  type="line"
                  layout={{
                    'line-cap': 'round',
                    'line-join': 'round'
                  }}
                  paint={{
                    'line-color': (route.get('id') === selectedRouteIdToAddDeliveries) ?
                      '#ef404b' :
                      route.get('color'),
                    'line-width': 2
                  }}>
                  <Feature coordinates={
                    route.get('points', []).reduce((computedPoints, point) => {
                      computedPoints.push([
                        point.longitude,
                        point.latitude
                      ]);
                      return computedPoints;
                    }, [])
                  }/>
                </Layer>
                { // white circles of DROPOFFS on routes and single deliveries
                  !route.has('steps') &&
                  <Layer
                    id={`route-dropoffs-schedule-${idx}`}
                    type="circle"
                    paint={{
                      'circle-color': (route.get('id') === selectedRouteIdToAddDeliveries) ?
                        '#ef404b' :
                        route.get('color'),
                      'circle-radius': 6,
                      'circle-stroke-width': 1,
                      'circle-stroke-color': '#fff'
                    }}>
                    {
                      route.get('schedule')
                        .filter(s => ((s.getIn(['data', 'activity'])
                          === selectedPointsType.charAt(0).toUpperCase()
                          || selectedPointsType === 'All')
                          && s.getIn(['data', 'activity']) === 'D' ))
                        .map((stop, key) => {
                          return (
                            <Feature
                              key={`feature-schedule-circles-${idx}-${key}`}
                              coordinates={[
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'longitude']
                                ),
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'latitude']
                                )
                              ]}
                              onMouseEnter={(e) => {
                                e.map.getCanvas().style.cursor = 'pointer';
                              }}
                              onMouseLeave={(e) => {
                                e.map.getCanvas().style.cursor = '';
                              }}
                              onClick={() => selectStep(
                                route.get('id'),
                                stop.getIn(['data', 'id']),
                                stop.getIn(['data', 'activity'])
                              )}/>
                          );
                        }).toArray()
                    }
                  </Layer>
                }
                { // dropoff letter
                  !route.has('steps') && selectedPointsType !== 'Pickup' && false &&
                  <Layer
                    key={'route-schedule-dropoffs'}
                    type='symbol'
                    layout={{
                      'text-allow-overlap': true,
                      'text-transform': 'uppercase',
                      'text-size': 6,
                      'text-field': window.translation('D')
                    }}
                    paint={{
                      'text-color': '#fff'
                    }}>
                    {
                      route.get('schedule')
                        .filter(s => (s.getIn(['data', 'activity']) === 'D'))
                        .map((stop, key) => {
                          return (
                            <Feature
                              key={`feature-schedule-dropoff-${idx}-${key}`}
                              coordinates={[
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'longitude']
                                ),
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'latitude']
                                )
                              ]}
                              onClick={() => selectStep(
                                route.get('id'),
                                stop.getIn(['data', 'id']),
                                stop.getIn(['data', 'activity'])
                              )}/>
                          );
                        }).toArray()
                    }
                  </Layer>
                }
                { // white circles of PICKUPS on routes and single deliveries
                  !route.has('steps') &&
                  <Layer
                    id={`route-pickups-schedule-${idx}`}
                    type="circle"
                    paint={{
                      'circle-color': '#fff',
                      'circle-radius': 11,
                      'circle-stroke-width': 2,
                      'circle-stroke-color': (route.get('id') === selectedRouteIdToAddDeliveries) ?
                        '#ef404b' :
                        '#ef404b'
                    }}>
                    {
                      route.get('schedule')
                        .filter(s => ((s.getIn(['data', 'activity'])
                          === selectedPointsType.charAt(0).toUpperCase()
                          || selectedPointsType === 'All')
                          && s.getIn(['data', 'activity']) === 'P' ))
                        .map((stop, key) => {
                          return (
                            <Feature
                              key={`feature-schedule-circles-${idx}-${key}`}
                              coordinates={[
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'longitude']
                                ),
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'latitude']
                                )
                              ]}
                              onMouseEnter={(e) => {
                                e.map.getCanvas().style.cursor = 'pointer';
                              }}
                              onMouseLeave={(e) => {
                                e.map.getCanvas().style.cursor = '';
                              }}/>
                          );
                        }).toArray()
                    }
                  </Layer>
                }
                { // pickup letter
                  !route.has('steps') && selectedPointsType !== 'Dropoff' &&
                  <Layer
                    key={'route-schedule-pickups'}
                    type='symbol'
                    layout={{
                      'text-font': ['Arial Unicode MS Bold'],
                      'text-size': 12,
                      'text-allow-overlap': false,
                      'text-transform': 'uppercase',
                      'text-field': window.translation('P')
                    }}
                    paint={{
                      'text-color': '#757575'
                    }}>
                    {
                      route.get('schedule')
                        .filter(s => (s.getIn(['data', 'activity']) === 'P'))
                        .map((stop, key) => {
                          return (
                            <Feature
                              key={`feature-schedule-pickup-${idx}-${key}`}
                              coordinates={[
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'longitude']
                                ),
                                stop.getIn(
                                  ['data', 'location', 'geopoint', 'latitude']
                                )
                              ]}
                              onClick={() => selectStep(
                                route.get('id'),
                                stop.getIn(['data', 'id']),
                                stop.getIn(['data', 'activity'])
                              )}/>
                          );
                        }).toArray()
                    }
                  </Layer>
                }
                { // routeDetail.js white circles
                  route.has('steps') &&
                  <Layer
                    id={`route-steps-${idx}`}
                    type="circle"
                    paint={{
                      'circle-color': '#fff',
                      'circle-radius': 11,
                      'circle-stroke-width': 2,
                      'circle-stroke-color': (route.get('id') === selectedRouteIdToAddDeliveries) ?
                        '#ef404b' :
                        route.get('color')
                    }}>
                    {
                      route.get('steps').map((steps, key) => {
                        return (
                          <Feature
                            key={`feature-steps-${idx}-${key}`}
                            coordinates={[
                              steps.getIn([0, 'location', 'longitude']),
                              steps.getIn([0, 'location', 'latitude'])
                            ]}
                            onMouseEnter={(e) => {
                              e.map.getCanvas().style.cursor = 'pointer';
                            }}
                            onMouseLeave={(e) => {
                              e.map.getCanvas().style.cursor = '';
                            }}/>
                        );
                      }).toArray()
                    }
                  </Layer>
                }
                { // routeDetail.js symbols
                  route.has('steps') &&
                  route.get('steps').map((steps, key) => {
                    return (
                      <Layer
                        key={`route-steps-symbol-${idx}-${key}`}
                        type='symbol'
                        layout={{
                          'text-allow-overlap': false,
                          'text-transform': 'uppercase',
                          'text-field': `${(steps.getIn([0, 'index']) + 1)}`
                        }}
                        paint={{
                          'text-color': '#757575'
                        }}>
                        <Feature
                          coordinates={[
                            steps.getIn([0, 'location', 'longitude']),
                            steps.getIn([0, 'location', 'latitude'])
                          ]}
                          onClick={() => selectStep(
                            route.get('id'),
                            steps.getIn([0, 'deliveryId']),
                            (steps.getIn([0, 'activityType']) === 'pickup') ?
                              'P' :
                              'D'
                          )}/>
                      </Layer>
                    );
                  })
                }
              </div>
            );
          })
        }
        {
          selectedStep &&
          <DeliveryPopup
            selectedStep={selectedStep}
            applyFilters={this.props.applyFilters}
            from={this.props.from}
            to={this.props.to}
            selectedTags={this.props.selectedTags}
            selectedCities={this.props.selectedCities}
            selectedCompanies={this.props.selectedCompanies}
            selectedDeliveries={this.props.selectedDeliveries}
            selectedStatuses={this.props.selectedStatuses}
            isPolygonToolOpened={isPolygonToolOpened}
            selectedRouteToReorder={selectedRouteToReorder}
            selectedRoute={selectedRoute}/>
        }
        {
          selectedRouteIdToAddDeliveries &&
          <AddDeliveries
            setListWidth={setListWidth}/>
        }
        <ZoomControl position="bottom-right"/>
      </MapboxMap>
    );
  }
}


/**
 *
 */
const mapStateToProps = (state) => {
  const selectedRouteToReorder = state.getIn(
    ['routes', 'selectedRouteToReorder']
  );
  const selectedDeliveryTypes = state.getIn(
    ['polygon', 'selectedDeliveryTypes']
  );
  const singleDeliveries = state.getIn(['routes', 'data']).filter(r => {
    return (r.get('id') === 'Single');
  }).first();
  const filteredStep = state.getIn(['routes', 'filteredStep']);
  let filteredStepActivityType = undefined;
  let commonPointsIds = [];
  if (filteredStep) {
    filteredStepActivityType = (filteredStep.get('activityType') === 'P') ?
      'pickup' : 'dropoff';
    state.getIn(['polygon', 'steps'])
      .map(s => {
        if (
          areCommonPoints(
            {
              latitude: filteredStep.getIn([filteredStepActivityType, 'location', 'latitude']),
              longitude: filteredStep.getIn([filteredStepActivityType, 'location', 'longitude']),
              type: filteredStepActivityType
            },
            {
              longitude: s.getIn([s.get('activityType'), 'location', 'longitude']),
              latitude: s.getIn([s.get('activityType'), 'location', 'latitude']),
              type: s.getIn(['activityType'])    
            })
        ) {
          commonPointsIds.push(s.get('id'));
        }
      });
  }
  return {
    routes: state.getIn(['routes', 'data'])
      .filter((route) => route.get('isVisible')),
    selectedStep: state.getIn(['routes', 'selectedStep']),
    selectedRouteToReorder,
    selectedPointsType: state.getIn(['routes', 'selectedPointsType']),
    polygonSteps: state.getIn(['polygon', 'steps'])
      .filter(s => {
        if (selectedDeliveryTypes.length > 0) {
          return (
            selectedDeliveryTypes
              .filter(dt => dt.id === s.get('deliveryType'))
              .length > 0
          );
        }
        return true;
      })
      .filter(s => {
        if (filteredStep) {
          return commonPointsIds.includes(s.get('id'));
        }
        return true;
      }),
    groupedPolygonSteps: state.getIn(['polygon', 'steps'])
      .filter(s => {
        if (selectedDeliveryTypes.length > 0) {
          return (
            selectedDeliveryTypes
              .filter(dt => dt.id === s.get('deliveryType'))
              .length > 0
          );
        }
        return true;
      })
      .filter(s => {
        if (filteredStep) {
          return commonPointsIds.includes(s.get('id'));
        }
        return true;
      })
      .reduce((computedPolygons, step) => {
        const list = computedPolygons.get(
          step.get('polygonId', 'single'),
          Immutable.List()
        );
        return computedPolygons.set(
          step.get('polygonId', 'single'),
          list.push(step)
        );
      }, Immutable.OrderedMap()),
    groupType: state.getIn(['polygon', 'groupType']),
    polygons: state.getIn(['polygon', 'polygons']),
    singleDeliveries,
    filteredStep,
    singleDeliveryPath: state.getIn(['routes', 'currentPath']),
    selectedRouteIdToAddDeliveries: state.getIn(
      ['routes', 'selectedRouteIdToAddDeliveries']
    ),
    selectedRouteIdToDivide: state.getIn(
      ['routes', 'selectedRouteIdToDivide']
    ),
    areRemainingDeliveriesVisible: state.getIn(
      ['polygon', 'areRemainingDeliveriesVisible']
    )
  };
};

/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  selectStep: actions.selectStep,
  loadRoute: loadRouteRequest,
  createOrUpdatePolygon: polygonActions.createOrUpdatePolygon,
  deletePolygon: polygonActions.deletePolygon
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapComponent);
