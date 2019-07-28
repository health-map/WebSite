
export const Mapbox = {
  TOKEN: 'pk.eyJ1Ijoic2hpcHBpZnkiLCJhIjoiZjQ2ZGI3Yjk5MTA1YjJkZTEyNzUwYmViMDNiMWRmMDkifQ.i8JV0AnyqRmfWSfaqKSGfQ',
  STYLE: 'mapbox://styles/shippify/cjratkp9x2p2b2sutqk0lsed8'
};

const Color = {
  GRAY: '#757575',
  YELLOW: '#FFC82C',
  BLUE: '#1FB6FF',
  GREEN: '#12CE66',
  RED: '#EF404B',
  ORANGE: '#FF5722'
};

export const DeliveryStatusLabel = {
  draft: 'Draft',
  pending_to_review: 'Pending to review',
  scheduled: 'Scheduled',
  processing: 'Processing',
  broadcasting: 'Broadcasting',
  assigned: 'Assigned',
  confirmed_to_pickup: 'Confirmed to pickup',
  at_pickup: 'At pickup',
  on_delivery: 'On delivery',
  going_to_dropoff: 'Going to dropoff',
  at_dropoff: 'At dropoff',
  dropped_off: 'Dropped off',
  completed: 'Completed',
  canceled: 'Canceled',
  returning: 'Returning',
  returned: 'Returned',
  not_picked_up: 'Not picked up',
  hold_by_courier: 'Hold by courier'
};

export const DeliveryStatusLabelByActivity = {
  pickup: {
    draft: 'Draft',
    pending_to_review: 'Pending to review',
    scheduled: 'Scheduled',
    processing: 'Processing',
    broadcasting: 'Searching for courier',
    assigned: 'Assigned',
    confirmed_to_pickup: 'Confirmed to pickup',
    at_pickup: 'At pickup',
    on_delivery: 'Picked up',
    going_to_dropoff: 'Picked up',
    at_dropoff: 'Picked up',
    dropped_off: 'Picked up',
    completed: 'Picked up',
    not_picked_up: 'Not picked up',
    canceled: 'Canceled',
    returning: 'Picked up',
    returned: 'Picked up',
    hold_by_courier: 'Picked up'
  },
  dropoff: {
    draft: 'Draft',
    pending_to_review: 'Pending to review',
    scheduled: 'Scheduled',
    processing: 'Processing',
    broadcasting: 'Searching for courier',
    assigned: 'Assigned',
    confirmed_to_pickup: 'Confirmed to pickup',
    at_pickup: 'At pickup',
    on_delivery: 'On delivery',
    going_to_dropoff: 'Going to dropoff',
    at_dropoff: 'At dropoff',
    dropped_off: 'Dropped off',
    completed: 'Completed',
    not_picked_up: 'Not picked up',
    canceled: 'Canceled',
    returning: 'Returning',
    returned: 'Returned',
    hold_by_courier: 'Hold by courier'
  }
};

export const DeliveryStatusColor = {
  draft: Color.GRAY,
  pending_to_review: Color.ORANGE,
  scheduled: Color.YELLOW,
  processing: Color.YELLOW,
  broadcasting: Color.YELLOW,
  assigned: Color.YELLOW,
  confirmed_to_pickup: Color.BLUE,
  at_pickup: Color.BLUE,
  on_delivery: Color.BLUE,
  going_to_dropoff: Color.BLUE,
  at_dropoff: Color.BLUE,
  dropped_off: Color.GREEN,
  completed: Color.GREEN,
  not_picked_up: Color.RED,
  canceled: Color.RED,
  returning: Color.RED,
  returned: Color.RED,
  hold_by_courier: Color.YELLOW
};

export const StatusesMapping = {
  'processing': 1,
  'broadcasting': 2
};

export const UserRole = {
  VIEWER: 0,
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3
};

export const CompanyAccess = {
  BASIC: 1,
  SAAS: 2,
  ADMIN: 3,
  COURIER: 4
};

export const PackageLabel = {
  '1': 'XS',
  '2': 'S',
  '3': 'M',
  '4': 'L',
  '5': 'XL'
};

export const CapacityParameters = {
  DELIVERY: 'delivery',
  PACKAGE_PRICE: 'packagePrice',
  PACKAGE_SIZE: 'packageSize',
  PACKAGE_NUMBER: 'packageNumber',
  PRICE: 'price',
  COST: 'cost',
  DISTANCE: 'distance'
};

export const CapacityParametersTypes = {
  DYNAMIC: 'dynamic',
  STATIC: 'static'
};
