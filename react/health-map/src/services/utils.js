/**
 * @file utils.js
 * @description utilitary functions
 *
 */

/**
 *
 */
export function getCommonPoints( singleDeliveries, commonPoint ) {
  return singleDeliveries.filter((point) => {
    let pointLongitude = point.getIn(['data', 'location', 'geopoint', 'longitude']);
    let pointLatitude = point.getIn(['data', 'location', 'geopoint', 'latitude']);
    let pointType = point.getIn(['data', 'activity']);
    return (Math.abs(commonPoint.latitude - pointLatitude) < 0.0001) &&
      (Math.abs(commonPoint.longitude - pointLongitude) < 0.0001) &&
      (pointType === commonPoint.type);
  });
}

export function areCommonPoints( pointA, pointB ) {
  return (Math.abs(pointB.latitude - pointA.latitude) < 0.0001) &&
    (Math.abs(pointB.longitude - pointA.longitude) < 0.0001) &&
    (pointA.type === pointB.type);
}
