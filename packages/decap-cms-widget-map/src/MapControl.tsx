import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useTranslate } from 'react-polyglot';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { Field, useUIContext, IconButton, Icon } from 'decap-cms-ui-next';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { renderToString } from 'react-dom/server';

import MapControlStyles from './MapControlStyles';
import { toGeoJSONFeature, deepTranslate } from './helpers';

import type { LatLngExpression, Marker, Map as LeafletMap, FeatureGroup } from 'leaflet';

type MapFieldOptions = {
  type?: 'Point' | 'LineString' | 'Polygon';
  default?: string; // GeoJSON string
  decimals?: number;
};

interface MapField {
  get<K extends keyof MapFieldOptions>(
    key: K,
    defaultValue?: MapFieldOptions[K],
  ): MapFieldOptions[K];
}

interface MapControlProps {
  onChange: (value: string) => void;
  field: MapField;
  height?: string;
  label?: string;
  value?: string;
  inline?: boolean;
  error?: boolean;
  errors?: string[];
}

// Styled components
const MapWrapper = styled.div<{ height: string }>`
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  height: ${props => props.height};
  position: relative;

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(2);
    }
  }
`;

const ControlButton = styled(IconButton)`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.color.surface};

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.color.surfaceHighlight};
  }
`;

const ControlButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;

  button {
    margin: 0;
    border-radius: 0;
    background-color: ${({ theme }) => theme.color.surface};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ZoomAndLocationControlsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DrawControlsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
`;

type DrawControlInstance = {
  enable: () => void;
  disable: () => void;
  save?: () => void;
};

// MapControl component
function MapControl({
  onChange,
  field,
  height = '400px',
  label,
  value,
  inline,
  error,
  errors,
}: MapControlProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const featureGroupRef = useRef<FeatureGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const locationMarkerRef = useRef<Marker | null>(null);
  const activeDrawControlRef = useRef<DrawControlInstance | null>(null);

  const { darkMode } = useUIContext();
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [activeDrawTool, setActiveDrawTool] = useState<string | null>(null);

  const t = useTranslate();
  const theme = useTheme();
  const decimals = field.get('decimals', 7)!;
  const type = field.get('type', 'Point')!;

  const MapPinIcon = useMemo(
    () =>
      new L.DivIcon({
        className: 'custom-map-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        html: renderToString(
          <Icon name="map-pin" size="lg" style={{ color: theme.color.primary[900] }} />,
        ),
      }),
    [theme],
  );

  const MapLocatePulseIcon = useMemo(
    () => (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: theme.color.primary[900],
            opacity: 0.75,
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            display: 'inline-flex',
            animation: 'pulse 1s infinite',
          }}
        />
        <div
          style={{
            backgroundColor: theme.color.primary[900],
            position: 'relative',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            display: 'inline-flex',
          }}
        />
      </div>
    ),
    [theme],
  );

  const MapDrawHandleIcon = useMemo(
    () =>
      new L.DivIcon({
        className: 'custom-draw-handle',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        html: renderToString(
          <Icon
            name="circle"
            size="sm"
            fill={theme.color.primary[900]}
            stroke={theme.color.primary[900]}
          />,
        ),
      }),
    [theme],
  );

  // Memoized draw options
  const drawOptions = useMemo(
    () => ({
      shapeOptions: {
        color: theme.color.primary[600],
        weight: 2,
        fillColor: theme.color.primary[400],
        fillOpacity: 0.25,
      },
      drawError: {
        color: theme.color.danger[900],
      },
    }),
    [theme],
  );

  // Style for paths
  const stylePathOptions = useMemo(
    () => ({
      color: theme.color.primary[900],
      fillColor: theme.color.primary[900],
      weight: 2,
    }),
    [theme],
  );

  // --- Helper functions ---

  const setTileLayer = useCallback((map: LeafletMap, darkMode: boolean) => {
    const DEFAULT_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    const DEFAULT_DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileUrl = darkMode ? DEFAULT_DARK_TILE_URL : DEFAULT_TILE_URL;

    if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrl);
    } else {
      const tileLayer = L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      tileLayerRef.current = tileLayer;
    }
  }, []);

  const addGeoJSONToMap = useCallback(
    (geojsonValue: string | undefined) => {
      const featureGroup = featureGroupRef.current;
      if (!featureGroup || !mapInstanceRef.current) return;

      featureGroup.clearLayers();
      if (!geojsonValue) return;

      try {
        const geojson = JSON.parse(geojsonValue);

        // Only handling Feature or FeatureCollection
        const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];

        features.forEach(feature => {
          let layer: L.Layer;

          if (feature.properties?.shape === 'rectangle') {
            const bounds = feature.geometry.coordinates[0].map(([lng, lat]) => L.latLng(lat, lng));
            layer = L.rectangle(bounds, stylePathOptions);
          } else if (feature.properties?.shape === 'circle') {
            layer = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
              radius: feature.properties?.radius,
              ...stylePathOptions,
            });
          } else if (feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            layer = L.marker([lat, lng], { icon: MapPinIcon });
          } else if (feature.geometry.type === 'LineString') {
            layer = L.polyline(
              feature.geometry.coordinates.map(([lng, lat]: [number, number]) =>
                L.latLng(lat, lng),
              ),
              stylePathOptions,
            );
          } else if (feature.geometry.type === 'Polygon') {
            layer = L.polygon(
              feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) =>
                L.latLng(lat, lng),
              ),
              stylePathOptions,
            );
          } else {
            layer = L.geoJSON(geojson, {
              pointToLayer: (feature, latlng) => L.marker(latlng, { icon: MapPinIcon }),
            });

            if (!(layer instanceof L.Marker)) {
              (layer as any).setStyle?.(stylePathOptions);
            }
          }

          featureGroup.addLayer(layer);
        });
      } catch (e) {
        console.error('Error parsing GeoJSON:', e);
      }
    },
    [MapPinIcon, stylePathOptions],
  );

  function setDrawLocale(t: (key: string) => string) {
    L.drawLocal = deepTranslate(L.drawLocal, t, 'editor.editorWidgets.map');
  }

  function setDrawEditHandlers() {
    L.Edit.PolyVerticesEdit.mergeOptions({
      icon: MapDrawHandleIcon,
      touchIcon: MapDrawHandleIcon,
      drawError: {
        color: theme.color.danger[900],
      },
    });
    L.Edit.SimpleShape.mergeOptions({
      moveIcon: MapDrawHandleIcon,
      resizeIcon: MapDrawHandleIcon,
      touchMoveIcon: MapDrawHandleIcon,
      touchResizeIcon: MapDrawHandleIcon,
    });

    L.Draw.SimpleShape.mergeOptions({
      icon: MapDrawHandleIcon,
      touchIcon: MapDrawHandleIcon,
      drawError: {
        color: theme.color.danger[900],
      },
    });

    L.Draw.Polyline.mergeOptions({
      icon: MapDrawHandleIcon,
      touchIcon: MapDrawHandleIcon,
      drawError: {
        color: theme.color.danger[900],
      },
    });
  }

  // --- Map Initialization ---
  useEffect(() => {
    setDrawLocale(t);
    setDrawEditHandlers();

    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [0, 0],
      zoom: 2,
      scrollWheelZoom: true,
      attributionControl: false,
      zoomControl: false,
    });

    // Track zoom level
    map.on('zoomend', () => setZoomLevel(map.getZoom()));
    setZoomLevel(map.getZoom());

    // Tile layer
    setTileLayer(map, darkMode);

    // Feature group
    const featureGroup = new L.FeatureGroup();
    featureGroupRef.current = featureGroup;
    map.addLayer(featureGroup);

    // Draw events
    function onDrawCreated(e: L.DrawEvents.Created) {
      const layer = e.layer;
      if (layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Circle) {
        layer.setStyle(stylePathOptions);
      }
      featureGroup.clearLayers();
      featureGroup.addLayer(layer);
      onChange(JSON.stringify(toGeoJSONFeature(layer, decimals)));
    }

    function onDrawEdited(e: L.DrawEvents.Edited) {
      e.layers.eachLayer(layer => {
        if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Polyline ||
          layer instanceof L.Circle ||
          layer instanceof L.Rectangle
        ) {
          onChange(JSON.stringify(toGeoJSONFeature(layer, decimals)));
        }
      });
    }

    function onDrawDeleted() {
      onChange('');
    }

    map.on(L.Draw.Event.CREATED, onDrawCreated as L.LeafletEventHandlerFn);
    map.on(L.Draw.Event.EDITED, onDrawEdited as L.LeafletEventHandlerFn);
    map.on(L.Draw.Event.DELETED, onDrawDeleted);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.off(L.Draw.Event.CREATED, onDrawCreated as L.LeafletEventHandlerFn);
      map.off(L.Draw.Event.EDITED, onDrawEdited as L.LeafletEventHandlerFn);
      map.off(L.Draw.Event.DELETED, onDrawDeleted);
      map.off('locationfound');
      map.off('locationerror');
      map.off('zoomend');
      map.stopLocate();

      activeDrawControlRef.current?.disable();
      if (locationMarkerRef.current) map.removeLayer(locationMarkerRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update features when value changes
  useEffect(() => {
    addGeoJSONToMap(value);
  }, [value, addGeoJSONToMap]);

  // Update tile layer on theme change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    setTileLayer(mapInstanceRef.current, darkMode);
  }, [darkMode, setTileLayer]);

  // Update locale when translation changes
  useEffect(() => {
    setDrawLocale(t);
  }, [t]);

  // --- Handlers ---

  function handleZoomIn() {
    mapInstanceRef.current?.zoomIn();
  }
  function handleZoomOut() {
    mapInstanceRef.current?.zoomOut();
  }

  const drawToolMap: Record<string, (map: LeafletMap) => DrawControlInstance> = {
    marker: map => new L.Draw.Marker(map as L.DrawMap, { icon: MapPinIcon }),
    polyline: map => new L.Draw.Polyline(map as L.DrawMap, { ...drawOptions, showLength: false }),
    polygon: map =>
      new L.Draw.Polygon(map as L.DrawMap, { ...drawOptions, showArea: false, showLength: false }),
    circle: map =>
      new L.Draw.Circle(map as L.DrawMap, {
        ...drawOptions,
        showRadius: false,
      }),
    rectangle: map =>
      new L.Draw.Rectangle(map as L.DrawMap, {
        ...drawOptions,
        showArea: false,
      }),
  };

  function handleDrawTool(toolType: string) {
    if (!mapInstanceRef.current) return;

    if (activeDrawTool === toolType && activeDrawControlRef.current) {
      activeDrawControlRef.current.disable();
      activeDrawControlRef.current = null;
      setActiveDrawTool(null);
      return;
    }

    activeDrawControlRef.current?.disable();

    const newTool = drawToolMap[toolType]?.(mapInstanceRef.current);
    if (newTool) {
      activeDrawControlRef.current = newTool as unknown as DrawControlInstance;
      activeDrawControlRef.current.enable();
      setActiveDrawTool(toolType);
    }
  }

  function handleEdit() {
    if (!mapInstanceRef.current || !featureGroupRef.current) return;

    if (activeDrawTool === 'edit') {
      activeDrawControlRef.current?.save?.();
      activeDrawControlRef.current?.disable();
      activeDrawControlRef.current = null;
      setActiveDrawTool(null);
    } else {
      activeDrawControlRef.current?.disable();
      setActiveDrawTool('edit');

      const editControl = new L.EditToolbar.Edit(mapInstanceRef.current as L.DrawMap, {
        featureGroup: featureGroupRef.current,
        selectedPathOptions: stylePathOptions,
      });

      activeDrawControlRef.current = editControl;
      activeDrawControlRef.current.enable();
    }
  }

  function handleDelete() {
    featureGroupRef.current?.clearLayers();
    setActiveDrawTool(null);
    onChange('');
  }

  function handleLocateClick() {
    if (!mapInstanceRef.current) return;

    if (userLocation) {
      // Stop tracking
      mapInstanceRef.current.stopLocate();
      mapInstanceRef.current.off('locationfound');
      mapInstanceRef.current.off('locationerror');
      setUserLocation(null);
      setIsLocating(false);
      if (locationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(locationMarkerRef.current);
        locationMarkerRef.current = null;
      }
    } else {
      setIsLocating(true);
      mapInstanceRef.current.locate({ setView: true, maxZoom: 16, watch: false });

      mapInstanceRef.current.on('locationfound', (e: L.LocationEvent) => {
        setUserLocation(e.latlng);
        setIsLocating(false);

        const locationIcon = L.divIcon({
          className: 'location-marker',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
          html: renderToString(MapLocatePulseIcon),
        });

        if (locationMarkerRef.current) {
          locationMarkerRef.current.setLatLng(e.latlng);
        } else {
          locationMarkerRef.current = L.marker(e.latlng, {
            icon: locationIcon,
            interactive: false,
          }).addTo(mapInstanceRef.current!);
        }
      });

      mapInstanceRef.current.on('locationerror', (e: L.ErrorEvent) => {
        console.error('Location error:', e.message);
        setIsLocating(false);
        setUserLocation(null);
      });
    }
  }

  return (
    <Field label={label} inline={inline} error={error} errors={errors}>
      <MapWrapper height={height}>
        <MapControlStyles />

        <ZoomAndLocationControlsContainer>
          <ControlButtonGroup>
            <ControlButton
              icon="plus"
              size="md"
              onClick={handleZoomIn}
              disabled={zoomLevel >= (mapInstanceRef.current?.getMaxZoom() || 18)}
              title={t(`editor.editorWidgets.map.controls.zoomIn`)}
              aria-label={t(`editor.editorWidgets.map.controls.zoomIn`)}
            />
            <ControlButton
              icon="minus"
              size="md"
              onClick={handleZoomOut}
              disabled={zoomLevel <= (mapInstanceRef.current?.getMinZoom() || 0)}
              title={t(`editor.editorWidgets.map.controls.zoomOut`)}
              aria-label={t(`editor.editorWidgets.map.controls.zoomOut`)}
            />
          </ControlButtonGroup>

          <ControlButton
            icon={isLocating ? 'loader-circle' : 'navigation'}
            size="md"
            active={!!userLocation}
            disabled={isLocating}
            onClick={handleLocateClick}
            title={
              isLocating
                ? t(`editor.editorWidgets.map.controls.locating.title`)
                : userLocation
                ? t(`editor.editorWidgets.map.controls.stopLocating.title`)
                : t(`editor.editorWidgets.map.controls.locateMyPosition.title`)
            }
            aria-label={
              isLocating
                ? t(`editor.editorWidgets.map.controls.locating.text`)
                : userLocation
                ? t(`editor.editorWidgets.map.controls.stopLocating.text`)
                : t(`editor.editorWidgets.map.controls.locateMyPosition.text`)
            }
          />
        </ZoomAndLocationControlsContainer>

        <DrawControlsContainer key={featureGroupRef.current?.getLayers().length || 0}>
          <ControlButtonGroup>
            {['marker', 'polyline', 'circle', 'rectangle', 'polygon'].map(tool => (
              <ControlButton
                key={tool}
                icon={
                  tool === 'marker'
                    ? 'map-pin'
                    : tool === 'polyline'
                    ? 'path'
                    : tool === 'rectangle'
                    ? 'square'
                    : tool === 'polygon'
                    ? 'pentagon'
                    : tool
                }
                size="md"
                active={activeDrawTool === tool}
                disabled={activeDrawTool === 'edit' || activeDrawTool === 'delete'}
                onClick={() => handleDrawTool(tool)}
                title={t(`editor.editorWidgets.map.draw.toolbar.buttons.${tool}`)}
                aria-label={t(`editor.editorWidgets.map.draw.toolbar.buttons.${tool}`)}
              />
            ))}
            <ControlButton
              icon="edit-3"
              size="md"
              active={activeDrawTool === 'edit'}
              onClick={handleEdit}
              disabled={!value}
              title={
                !value
                  ? t(`editor.editorWidgets.map.edit.toolbar.buttons.editDisabled`)
                  : t(`editor.editorWidgets.map.edit.toolbar.buttons.edit`)
              }
              aria-label={
                !value
                  ? t(`editor.editorWidgets.map.edit.toolbar.buttons.editDisabled`)
                  : t(`editor.editorWidgets.map.edit.toolbar.buttons.edit`)
              }
            />
            <ControlButton
              icon="trash-2"
              size="md"
              active={activeDrawTool === 'delete'}
              onClick={handleDelete}
              disabled={!value}
              title={
                !value
                  ? t(`editor.editorWidgets.map.edit.toolbar.buttons.removeDisabled`)
                  : t(`editor.editorWidgets.map.edit.toolbar.buttons.remove`)
              }
              aria-label={
                !value
                  ? t(`editor.editorWidgets.map.edit.toolbar.buttons.removeDisabled`)
                  : t(`editor.editorWidgets.map.edit.toolbar.buttons.remove`)
              }
            />
          </ControlButtonGroup>
        </DrawControlsContainer>

        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </MapWrapper>
    </Field>
  );
}

export default MapControl;

export function withMapControl() {
  return MapControl;
}
