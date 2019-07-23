/**
 * @file utils.js
 * @description
 *
 */

import $ from 'jquery';

const { google } = window;

const MAX_WAYPOINTS_PER_REQUEST = 23;
const SHIPPIFY_ROUTING_SERVICE_URL = 'https://routing.shippify.co';
const GOOGLE_ROUTING_SERVICE_URL = 'https://maps.googleapis.com';


/**
 *
 */
const getRoute = async (waypoints) => {
  const pointSets = splitLink(waypoints, MAX_WAYPOINTS_PER_REQUEST);
  const result = await pointSets.reduce(async (_route, pointSet) => {
    const [route, { bounds, points, distance }] = await Promise.all([
      _route,
      getShippifyRouteFragment(pointSet)
    ]);
    return {
      bounds: route.bounds.union(bounds),
      points: route.points.concat(points),
      distance: Number(route.distance) + Number(distance)
    };
  }, {
    bounds: new google.maps.LatLngBounds(),
    points: [],
    distance: 0
  });
  return result;
};

/**
 *
 */
const splitLink = (list, size) => {
  var chunks = [];
  var index = 0;
  while (index < list.length-1) {
    var start = index;
    chunks.push(list.slice(start, start + size));
    index = index + size - 1;
  }
  return chunks;
};

/**
 *
 */
const getShippifyRouteFragment = (points) => {
  return new Promise((resolve, reject) => {
    if (points.length < 2) {
      reject(new Error('Route can not be calculated with less than 2 points.'));
      return;
    }
    const path = '/route/';
    const pointQueryItem = points
      .map((point) => `point=${point.latitude},${point.longitude}`)
      .join('&');
    const params = {
      instructions: true,
      optimize: true,
      points_encoded: false,
      type: 'json',
      weighting: 'shortest',
      way_point_max_distance: 100.0
    };
    let url = `${SHIPPIFY_ROUTING_SERVICE_URL}${path}?${pointQueryItem}&${$.param(params)}`;
    return fetch(url, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        resolve({
          bounds: {
            east: res.paths[0].bbox[2],
            north: res.paths[0].bbox[3],
            south: res.paths[0].bbox[1],
            west: res.paths[0].bbox[0]
          },
          points: res.paths[0].points.coordinates.map((coordinate) => ({
            latitude: coordinate[1],
            longitude: coordinate[0]
          })),
          distance: (res.paths[0].distance/1000).toFixed(2)
        });
      })
      .catch(error => {
        console.log('Routing Error:', error);
        reject(new Error('Routing failed'));
      });
  }).catch(function() {
    return getRouteFragment(points);
  });
};

/**
 *
 */
const getRouteFragment = (points) => {
  return new Promise((resolve, reject) => {
    if (points.length < 2) {
      reject(new Error('Route can not be calculated with less than 2 points.'));
      return;
    }
    const url = new URL(GOOGLE_ROUTING_SERVICE_URL);
    url.pathname = '/maps/api/directions/json';
    const locations = points.map(({ latitude, longitude }) => (
      {
        lat: latitude,
        lng: longitude
      }
    ));
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map(location => ({ location }));
    const options = {
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      provideRouteAlternatives: false,
      avoidHighways: false,
      avoidTolls: false
    };
    const service = new google.maps.DirectionsService();
    service.route(options, (response, status) => {
      if (status === google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED) {
        reject(new Error('Route can not be calculated for more than 23 points.'));
        return;
      }
      if (status === google.maps.DirectionsStatus.NOT_FOUND) {
        reject(new Error('Geocoding failed.'));
        return;
      }
      if (status !== google.maps.DirectionsStatus.OK) {
        reject(new Error('Routing failed.'));
        return;
      }
      const routeResults = [];
      for (var i = 0; i < response.routes.length; i++) {
        let routeDistance = 0;
        for (var j = 0; j < response.routes[i].legs.length; j++) {
          routeDistance += response.routes[i].legs[j].distance.value;
        }
        routeResults.push({
          'route': i,
          distance: routeDistance
        });
      }
      routeResults.sort(function(a, b) {
        return parseInt(a.distance) - parseInt(b.distance);
      });
      const distance = (routeResults[0]/1000).toFixed(2);
      const bounds = response.routes[0].bounds.toJSON();
      const path = response.routes[0].overview_path
        .map(({ lat, lng }) => ({
          latitude: lat(),
          longitude: lng()
        }));
      const route = {
        bounds,
        points: path,
        distance
      };
      resolve(route);
      return;
    });
  });
};


export  { getRoute };
