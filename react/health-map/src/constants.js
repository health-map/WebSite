
import Immutable from 'immutable';
import MAP_STYLE from './styles/map-style-basic-v8.json';

export const Mapbox = {
  TOKEN: 'pk.eyJ1Ijoic2hpcHBpZnkiLCJhIjoiZjQ2ZGI3Yjk5MTA1YjJkZTEyNzUwYmViMDNiMWRmMDkifQ.i8JV0AnyqRmfWSfaqKSGfQ',
  STYLE: 'mapbox://styles/mapbox/traffic-day-v1?optimize=true'
};

export const defaultMapStyle = Immutable.fromJS(MAP_STYLE);

export const dataLayer = Immutable.fromJS({
  id: 'data',
  source: 'incomeByState',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#3288bd'],
        [1, '#66c2a5'],
        [2, '#abdda4'],
        [3, '#e6f598'],
        [4, '#ffffbf'],
        [5, '#fee08b'],
        [6, '#fdae61'],
        [7, '#f46d43'],
        [8, '#d53e4f']
      ]
    },
    'fill-opacity': 0.5
  }
});


// stops: [
//   [0, '#A53400'],
//   [1, '#C1520D'],
//   [2, '#D16C00'],
//   [3, '#D68904'],
//   [4, '#E5AD20'],
//   [5, '#F9D16B'],
//   [6, '#FFDD89'],
//   [7, '#F7E3AF'],
//   [8, '#EFE1BD'],
//   [9, '#EFECE6']

export const UserRole = {
  VIEWER: 0,
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3
};

export const DataTypesMapping = [
  {
    id: 'absolute',
    name: 'Totales de un sector'
  }, 
  {
    id: 'per1000inhabitants',
    name: 'Por cada mil habitantes de un sector'
  },
  {
    id: 'relativeToPopulation',
    name: 'Relativo a la población de un sector'
  }, 
  {
    id: 'relativeToPatients',
    name: 'Relativo al número de casos en un sector de la enfermedad filtrada'
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