
export const Mapbox = {
  TOKEN: 'pk.eyJ1Ijoic2hpcHBpZnkiLCJhIjoiZjQ2ZGI3Yjk5MTA1YjJkZTEyNzUwYmViMDNiMWRmMDkifQ.i8JV0AnyqRmfWSfaqKSGfQ',
  STYLE: 'mapbox://styles/shippify/cjratkp9x2p2b2sutqk0lsed8'
};

export const UserRole = {
  VIEWER: 0,
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3
};

export const DataTypesMapping = {
  'absolute': 'Totales de un sector',
  'per1000inhabitants': 'Por cada mil habitantes de un sector',
  'relativeToPopulation': 'Relativo a la población de un sector',
  'relativeToPatients': 'Relativo al número de casos en un sector de la enfermedad filtrada'
};

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