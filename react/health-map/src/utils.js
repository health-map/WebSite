import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';

export function updatePercentiles(featureCollection, accessor) {
  const { features } = featureCollection;
  const scale = scaleQuantile()
    .domain(features.map(accessor))
    .range(range(9));
  features.forEach(f => {
    const value = accessor(f);
    f.properties.value = value;
    if (value === 0) {
      f.properties.percentile = 0;
    } else {
      f.properties.percentile = scale(value);
    }
  });
  return scale.quantiles();
}