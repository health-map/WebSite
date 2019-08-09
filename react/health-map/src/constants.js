
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
        [1, '#fff7ec'],
        [2, '#fee8c8'],
        [3, '#fdd49e'],
        [4, '#fdbb84'],
        [5, '#fc8d59'],
        [6, '#ef6548'],
        [7, '#d7301f'],
        [8, '#990000']
      ]
    },
    'fill-outline-color': '#FFFFFF',
    'fill-opacity': {
      property: 'percentile',
      stops: [
        [0, 0.60],
        [1, 0.58],
        [2, 0.56],
        [3, 0.54],
        [4, 0.52],
        [5, 0.50],
        [6, 0.50],
        [7, 0.50],
        [8, 0.50]
      ]
    }
  }
});


export const Colors = [
  ['#c9c9c9', 0.60],
  ['#fff7ec', 0.58],
  ['#fee8c8', 0.56],
  ['#fdd49e', 0.54],
  ['#fdbb84', 0.52],
  ['#fc8d59', 0.5],
  ['#ef6548', 0.5],
  ['#d7301f', 0.5],
  ['#990000', 0.5]
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