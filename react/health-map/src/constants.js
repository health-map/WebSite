
import Immutable from 'immutable';
import MAP_STYLE from './styles/map-style-basic-v8.json';

export const Mapbox = {
  TOKEN: 'pk.eyJ1Ijoic2hpcHBpZnkiLCJhIjoiZjQ2ZGI3Yjk5MTA1YjJkZTEyNzUwYmViMDNiMWRmMDkifQ.i8JV0AnyqRmfWSfaqKSGfQ',
  STYLE: 'mapbox://styles/mapbox/traffic-day-v1?optimize=true'
};

export const defaultMapStyle = Immutable.fromJS(MAP_STYLE);

export const dataLayer = Immutable.fromJS({
  id: 'data',
  source: 'incidences',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#c9c9c9'],
        [1, '#fee8c8'],
        [2, '#fdd49e'],
        [3, '#fdbb84'],
        [4, '#fc8d59'],
        [5, '#ef6548'],
        [6, '#d7301f'],
        [7, '#990000']
      ]
    },
    'fill-outline-color': '#FFFFFF',
    'fill-opacity': {
      property: 'percentile',
      stops: [
        [0, 0.80],
        [1, 0.76],
        [2, 0.74],
        [3, 0.72],
        [4, 0.70],
        [5, 0.70],
        [6, 0.70],
        [7, 0.70]
      ]
    }
  }
});


export const Colors = [
  ['#c9c9c9', 0.85],
  ['#fee8c8', 0.81],
  ['#fdd49e', 0.79],
  ['#fdbb84', 0.77],
  ['#fc8d59', 0.75],
  ['#ef6548', 0.75],
  ['#d7301f', 0.75],
  ['#990000', 0.75]
];


export const UserRole = {
  VIEWER: 0,
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3
};

export const DataTypesMapping = [
  {
    id: 'absolute',
    name: 'Totales de cada sector'
  }, 
  {
    id: 'every1000Inhabitants',
    name: 'Por cada mil habitantes de cada sector'
  },
  {
    id: 'relativeToPopulation',
    name: 'Relativo a la población de cada sector'
  }, 
  {
    id: 'relativeToPatients',
    name: 'Relativo al número de pacientes de cada sector'
  }
];

export const sideBarStyle = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  sidebar: {
    zIndex: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto'
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out'
  },
  overlay: {
    zIndex: 19,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0
  }
};