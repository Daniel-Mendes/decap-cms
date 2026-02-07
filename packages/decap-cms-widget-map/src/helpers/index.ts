import L from 'leaflet';

function toGeoJSONFeature(
  layer: L.Circle | L.CircleMarker | L.Marker | L.Polygon | L.Polyline | L.Rectangle,
  decimals: number,
): GeoJSON.Feature {
  const feature = layer.toGeoJSON() as GeoJSON.Feature;

  let shape: string | undefined;
  const extraProperties: Record<string, any> = {};

  if (layer instanceof L.Circle) {
    shape = 'circle';
    extraProperties.radius = layer.getRadius(); // in meters
  } else if (layer instanceof L.Rectangle) {
    shape = 'rectangle';
  } else if (layer instanceof L.Polygon) {
    shape = 'polygon';
  } else if (layer instanceof L.Polyline) {
    shape = 'polyline';
  } else if (layer instanceof L.Marker) {
    shape = 'marker';
  }

  if (shape) {
    feature.properties = {
      ...(feature.properties ?? {}),
      shape,
      ...extraProperties,
    };
  }

  // Round coordinates to specified decimals
  const roundedFeature = JSON.parse(
    JSON.stringify(feature, (_key, val) => {
      if (Array.isArray(val) && typeof val[0] === 'number') {
        return val.map(v => Number(v.toFixed(decimals)));
      }
      return val;
    }),
  );

  return roundedFeature;
}

function deepTranslate(target: any, t: (key: string) => string, prefix: string): any {
  if (typeof target === 'string') {
    return t(prefix);
  }

  if (typeof target !== 'object' || target === null) {
    return target;
  }

  const result: any = Array.isArray(target) ? [] : {};

  for (const key in target) {
    result[key] = deepTranslate(target[key], t, `${prefix}.${key}`);
  }

  return result;
}

export { toGeoJSONFeature, deepTranslate };
