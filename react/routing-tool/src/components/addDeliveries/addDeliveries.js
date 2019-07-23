/**
 * @file addDeliveries.js
 * @description Add deliveries component
 *
 */

import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Filters from './filters';
import { Layer, Feature } from 'react-mapbox-gl';
import { actions } from './../../actions/routes';
import ConfirmationDialog from './confirmationDialog';
import { thunks } from './../../actions/thunks/routes';
import SuggestedDeliveryCard from './suggestedDeliveryCard';
import {
  searchDeliveries,
  getSuggestionsForRoute
} from './../../services/remoteAPI';
const { loadRoute: loadRouteRequest } = thunks;

import './addDeliveries.css';


/**
 *
 */
class AddDeliveries extends React.Component {
  state = {
    searchTerm: '',
    isSearchVisible: false,
    isSearching: false,
    filters: Immutable.Map({
      timeArea: 5,
      hoursBefore: -24,
      hoursAfter: 24
    }),
    suggestedDeliveries: Immutable.List(),
    deliveriesToAdd: Immutable.List(),
    loading: false,
    succeed: false,
    failed: false,
    isRequestingSuggestions: false,
    isFiltersDialogVisible: false,
    isConfirmationDialogVisible: false,
    selectedSuggestion: undefined
  }
  componentDidMount() {
    this.requestSuggestions();
    if (!this.props.route.has('points')) {
      this.props.loadRoute(
        this.props.route.get('id'),
        this.props.route.get('schedule').reduce((points, currentPoint) => {
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
  requestSuggestions = () => {
    const { apiUrl, apiToken, route } = this.props;
    const filters = this.state.filters;
    this.setState({
      suggestedDeliveries: Immutable.List(),
      deliveriesToAdd: Immutable.List(),
      isRequestingSuggestions: true,
      isochronicPolygons: []
    });
    getSuggestionsForRoute(
      {
        routeId: route.get('id'),
        timeArea: filters.get('timeArea', ''),
        hoursAfter: filters.get('hoursAfter', ''),
        hoursBefore: -filters.get('hoursBefore', '')
      },
      {
        apiUrl,
        apiToken
      }
    )
      .then((suggestions) => {
        this.setState({
          isRequestingSuggestions: false,
          suggestedDeliveries: Immutable.fromJS(suggestions)
        });
      })
      .catch(() => {
        this.setState({
          isRequestingSuggestions: false
        });
      });
  }
  changeSearchTerm = (e) => {
    const { apiUrl, apiToken } = this.props;
    const searchTerm = e.target.value;
    if (searchTerm.split('-').length > 2) {
      const self = this;
      this.setState({
        suggestedDeliveries: Immutable.List(),
        isRequestingSuggestions: true,
        draw: new Date().getTime()
      }, () => {
        searchDeliveries(
          {
            q: searchTerm,
            draw: this.state.draw
          },
          {
            apiUrl,
            apiToken
          }
        )
          .then((data) => {
            if (
              data.deliveries.length &&
            (`${data.draw}` === `${self.state.draw}`)
            ) {
              self.setState({
                suggestedDeliveries: Immutable.fromJS(data.deliveries),
                isRequestingSuggestions: false
              });
            } else {
              self.setState({
                isRequestingSuggestions: false
              });
            }
          })
          .catch(() => {
            self.setState({
              isRequestingSuggestions: false
            });
          });
      });
    }
    this.setState({ searchTerm });
  }
  toggleSearch = () => {
    if (this.state.isSearchVisible) {
      this.setState({
        searchTerm: '',
        isSearchVisible: !this.state.isSearchVisible
      }, () => {});
    } else {
      this.setState({
        isSearchVisible: !this.state.isSearchVisible
      });
    }
  }
  applyFilters = (timeArea, hoursBefore, hoursAfter) => {
    this.setState({
      filters: Immutable.Map({
        timeArea,
        hoursBefore,
        hoursAfter
      }),
      isFiltersModalVisible: false
    }, () => this.requestSuggestions());
  }
  addDelivery = (deliveryId) => {
    this.setState({
      deliveriesToAdd: this.state.deliveriesToAdd.push(deliveryId)
    });
  }
  removeDelivery = (deliveryId) => {
    this.setState({
      deliveriesToAdd: this.state.deliveriesToAdd
        .filter(id => id !== deliveryId)
    });
  }
  render() {
    const { route, setListWidth, selectRouteIdToAddDeliveries } = this.props;
    const { timeArea, hoursBefore, hoursAfter } = this.state.filters.toObject();
    const areFiltersApplied = !!(timeArea || hoursBefore || hoursAfter);
    let filtersApplied = [];
    timeArea ? filtersApplied.push(
      window.translation('*NUMBER* minutes').replace('*NUMBER*', timeArea)
    ) : '';
    hoursBefore ? filtersApplied.push(
      window.translation('*NUMBER* hours before').replace('*NUMBER*', -hoursBefore)
    ) : '';
    hoursAfter ? filtersApplied.push(
      window.translation('*NUMBER* hours after').replace('*NUMBER*', hoursAfter)
    ) : '';

    const availableDeliveries = this.state.suggestedDeliveries
      .reduce((computedDeliveries, delivery) => {
        if (
          this.state.deliveriesToAdd
            .filter(id => id === delivery.get('id'))
            .size === 0
        ) {
          return computedDeliveries.push(delivery);
        }
        return computedDeliveries;
      }, Immutable.List());

    const takenDeliveries = this.state.suggestedDeliveries
      .reduce((computedDeliveries, delivery) => {
        if (
          this.state.deliveriesToAdd
            .filter(id => id === delivery.get('id'))
            .size > 0
        ) {
          return computedDeliveries.push(delivery);
        }
        return computedDeliveries;
      }, Immutable.List());

    return (
      <div className="add-deliveries-tool">
        <div className="add-deliveries-header">
          <button
            className="shy-btn shy-btn-default"
            onClick={() => this.setState({
              isConfirmationDialogVisible: true
            })}
            disabled={ (this.state.deliveriesToAdd.size === 0) }>
            { window.translation('ADD SUGGESTED DELIVERIES') }
          </button>
          <div className="add-deliveries-header-tools">
            {
              areFiltersApplied &&
              <div className="header-filters">
                <span>
                  { filtersApplied.join(', ') }
                </span>
                <img
                  src="https://cdn.shippify.co/icons/icon-close-circle-white-mini.svg"
                  className="icon-close-mini"
                  alt=""
                  onClick={() => this.setState({
                    isFiltersDialogVisible: true
                  })}/>
                <div className="header-filters-separator"></div>
              </div>
            }
            <div className="margin-right-16">
              <img
                className="icon-filter"
                onClick={() => this.setState({
                  isFiltersDialogVisible: true
                })}
                src="https://cdn.shippify.co/icons/icon-filter-white.svg"/>
            </div>
            <div className="margin-right-16">
              {
                this.state.isSearchVisible &&
                <div id="searchbarOpened">
                  <input
                    type="text"
                    value={this.state.searchTerm}
                    onChange={this.changeSearchTerm}
                    placeholder={
                      window.translation('Type a delivery ID')
                    }/>
                  <img
                    onClick={this.toggleSearch}
                    src="https://cdn.shippify.co/icons/icon-close-gray.svg"
                    alt=""/>
                </div>
              }
              {
                !this.state.isSearchVisible &&
                <div id="searchbarClosed">
                  <img
                    onClick={this.toggleSearch}
                    src="https://cdn.shippify.co/icons/icon-search-white.svg"
                    alt=""/>
                </div>
              }
            </div>
            <img
              className="icon-close"
              onClick={() => {
                setListWidth(504);
                selectRouteIdToAddDeliveries();
              }}
              src="https://cdn.shippify.co/icons/icon-close-white.svg"/>
          </div>
        </div>
        <div>
        </div>
        <div className="add-deliveries-footer">
          <div className="add-deliveries-footer-item">
            <div className="footer-item-number number-blue">
              { this.state.suggestedDeliveries.size }
            </div>
            <div className="footer-item-label">
              { window.translation('Deliveries suggested') }
            </div>
          </div>
          <div className="add-deliveries-footer-item">
            <div className="footer-item-number number-red">
              { (route.get('schedule').size/2) }
            </div>
            <div className="footer-item-label">
              { window.translation('Original route') }
            </div>
          </div>
          <div className="add-deliveries-footer-item">
            <div className="footer-item-number number-green">
              { this.state.deliveriesToAdd.size }
            </div>
            <div className="footer-item-label">
              { window.translation('Deliveries selected') }
            </div>
          </div>
          <div className="add-deliveries-footer-item">
            <div className="footer-item-number">
              {
                (route.get('schedule').size/2) +
                this.state.deliveriesToAdd.size
              }
            </div>
            <div className="footer-item-label">
              { window.translation('Original route + selected') }
            </div>
          </div>
        </div>
        {
          this.state.isRequestingSuggestions &&
          <div className="requesting-suggestions">
            <img
              className="spin"
              src="https://cdn.shippify.co/images/img-loading.svg"/>
            <span>
              { `${window.translation('Searching')}...` }
            </span>
          </div>
        }
        {
          this.state.isFiltersDialogVisible &&
          <Filters
            applyFilters={this.applyFilters}
            onClose={() => this.setState({
              isFiltersDialogVisible: false
            })}/>
        }
        {
          (availableDeliveries.size > 0) &&
          <div>
            <Layer
              id='suggested-deliveries-pickups-circles'
              type="circle"
              paint={{
                'circle-color': '#fff',
                'circle-radius': 16,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#1fb6ff'
              }}>
              {
                availableDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`suggested-pickup-circle-${idx}`}
                      coordinates={[
                        delivery.getIn(['pickup', 'location', 'lng']),
                        delivery.getIn(['pickup', 'location', 'lat'])
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
            <Layer
              id='suggested-deliveries-dropoffs-circles'
              type="circle"
              paint={{
                'circle-color': '#fff',
                'circle-radius': 16,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#1fb6ff'
              }}>
              {
                availableDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`suggested-dropoff-circle-${idx}`}
                      coordinates={[
                        delivery.getIn(['dropoff', 'location', 'lng']),
                        delivery.getIn(['dropoff', 'location', 'lat'])
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
            <Layer
              id={'suggested-pickups'}
              type="symbol"
              layout={{
                'text-allow-overlap': true,
                'text-font': ['Arial Unicode MS Bold'],
                'text-transform': 'uppercase',
                'text-field': `${window.translation('P')}`
              }}
              paint={{
                'text-color': '#757575'
              }}>
              {
                availableDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`suggested-pickup-${idx}`}
                      coordinates={[
                        delivery.getIn(['pickup', 'location', 'lng']),
                        delivery.getIn(['pickup', 'location', 'lat'])
                      ]}
                      onClick={() => {
                        this.setState({
                          selectedSuggestion: delivery,
                          selectedSuggestionActivity: 'pickup'
                        });
                      }}/>
                  );
                }).toArray()
              }
            </Layer>
            <Layer
              id={'suggested-dropoffs'}
              type="symbol"
              layout={{
                'text-allow-overlap': true,
                'text-font': ['Arial Unicode MS Bold'],
                'text-transform': 'uppercase',
                'text-field': `${window.translation('D')}`
              }}
              paint={{
                'text-color': '#757575'
              }}>
              {
                availableDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`suggested-dropoff-${idx}`}
                      coordinates={[
                        delivery.getIn(['dropoff', 'location', 'lng']),
                        delivery.getIn(['dropoff', 'location', 'lat'])
                      ]}
                      onClick={() => {
                        this.setState({
                          selectedSuggestion: delivery,
                          selectedSuggestionActivity: 'dropoff'
                        });
                      }}/>
                  );
                }).toArray()
              }
            </Layer>
          </div>
        }
        {
          (takenDeliveries.size > 0) &&
          <div>
            <Layer
              id='taken-deliveries-pickups-circles'
              type="circle"
              paint={{
                'circle-color': '#fff',
                'circle-radius': 16,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#12ce66'
              }}>
              {
                takenDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`taken-pickup-circle-${idx}`}
                      coordinates={[
                        delivery.getIn(['pickup', 'location', 'lng']),
                        delivery.getIn(['pickup', 'location', 'lat'])
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
            <Layer
              id='taken-deliveries-dropoffs-circles'
              type="circle"
              paint={{
                'circle-color': '#fff',
                'circle-radius': 16,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#12ce66'
              }}>
              {
                takenDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`taken-dropoff-circle-${idx}`}
                      coordinates={[
                        delivery.getIn(['dropoff', 'location', 'lng']),
                        delivery.getIn(['dropoff', 'location', 'lat'])
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
            <Layer
              id='taken-pickups'
              type="symbol"
              layout={{
                'text-allow-overlap': true,
                'text-font': ['Arial Unicode MS Bold'],
                'text-transform': 'uppercase',
                'text-field': `${window.translation('P')}`
              }}
              paint={{
                'text-color': '#757575'
              }}>
              {
                takenDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`taken-pickup-${idx}`}
                      coordinates={[
                        delivery.getIn(['pickup', 'location', 'lng']),
                        delivery.getIn(['pickup', 'location', 'lat'])
                      ]}
                      onClick={() => {
                        this.setState({
                          selectedSuggestion: delivery,
                          selectedSuggestionActivity: 'pickup'
                        });
                      }}/>
                  );
                }).toArray()
              }
            </Layer>
            <Layer
              id='taken-dropoffs'
              type="symbol"
              layout={{
                'text-allow-overlap': true,
                'text-font': ['Arial Unicode MS Bold'],
                'text-transform': 'uppercase',
                'text-field': `${window.translation('D')}`
              }}
              paint={{
                'text-color': '#757575'
              }}>
              {
                takenDeliveries.map((delivery, idx) => {
                  return (
                    <Feature
                      key={`taken-dropoff-${idx}`}
                      coordinates={[
                        delivery.getIn(['dropoff', 'location', 'lng']),
                        delivery.getIn(['dropoff', 'location', 'lat'])
                      ]}
                      onClick={() => {
                        this.setState({
                          selectedSuggestion: delivery,
                          selectedSuggestionActivity: 'dropoff'
                        });
                      }}/>
                  );
                }).toArray()
              }
            </Layer>
          </div>
        }
        {
          this.state.selectedSuggestion &&
          <SuggestedDeliveryCard
            addDelivery={this.addDelivery}
            removeDelivery={this.removeDelivery}
            data={this.state.selectedSuggestion}
            activity={this.state.selectedSuggestionActivity}
            isAdded={
              this.state.deliveriesToAdd
                .filter(id => id === this.state.selectedSuggestion.get('id'))
                .size > 0
            }
            onClose={() => this.setState({ selectedSuggestion: undefined })}/>
        }
        {
          this.state.isConfirmationDialogVisible &&
          <ConfirmationDialog
            routeId={this.props.route.get('id')}
            deliveryIds={this.state.deliveriesToAdd.toJSON()}
            onClose={() => this.setState({
              isConfirmationDialogVisible: false
            })}
            onComplete={() => {
              setListWidth(504);
              selectRouteIdToAddDeliveries();
            }}/>
        }
      </div>
    );
  }
}

/**
 *
 */
const mapStateToProps = state => {
  const route = state.getIn(['routes', 'data'])
    .filter((r) => (r.get('id') === state.getIn(['routes', 'selectedRouteIdToAddDeliveries'])))
    .first();
  return {
    route,
    apiUrl: state.getIn(['general', 'user', 'apiUrl']),
    apiToken: state.getIn(['general', 'user', 'apiToken'])
  };
};
/**
 *
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  loadRoute: loadRouteRequest,
  selectRouteIdToAddDeliveries: actions.selectRouteIdToAddDeliveries
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDeliveries);
