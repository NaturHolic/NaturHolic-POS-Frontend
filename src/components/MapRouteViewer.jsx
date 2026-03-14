import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWgtbW91ZG9vZCIsImEiOiJjbWp6eTY0NngyeGw2M21xM2gxcnFsd2V3In0.NGX1K3kh6u-i3YWNUTBGnw';

export default function MapRouteViewer({ stops, routePath }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [67.0011, 24.8607], // Karachi
      zoom: 10,
    });

    map.current.on('load', () => {
      console.log('🗺️ Map loaded');

      // Add route line source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] },
        },
      });

      map.current.addLayer({
        id: 'routeLine',
        type: 'line',
        source: 'route',
        paint: {
          'line-width': 5,
          'line-color': '#3b82f6',
          'line-opacity': 0.8,
        },
      });

      // Add points source and layer
      map.current.addSource('points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.current.addLayer({
        id: 'routePoints',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 10,
          'circle-color': '#ef4444',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add labels for stop numbers
      map.current.addLayer({
        id: 'routeLabels',
        type: 'symbol',
        source: 'points',
        layout: {
          'text-field': ['get', 'stopNumber'],
          'text-size': 14,
          'text-offset': [0, 0],
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      setMapLoaded(true);
      console.log('✅ Map sources and layers added');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when stops or routePath changes AND map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) {
      console.log('⏳ Waiting for map to load...');
      return;
    }

    console.log('📍 Updating map with:', {
      stops: stops.length,
      routePath: routePath?.length || 0,
    });

    updatePoints();
    updateRoute();
  }, [stops, routePath, mapLoaded]);

  const updatePoints = () => {
    if (!map.current || !map.current.getSource('points')) {
      console.log('❌ Points source not ready');
      return;
    }

    const features = stops.map((stop, index) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [stop.lng, stop.lat] },
      properties: { stopNumber: (index + 1).toString() },
    }));

    map.current.getSource('points').setData({
      type: 'FeatureCollection',
      features,
    });

    console.log('✅ Points updated:', features.length);
  };

  const updateRoute = () => {
    if (!map.current || !map.current.getSource('route')) {
      console.log('❌ Route source not ready');
      return;
    }

    if (!routePath || routePath.length === 0) {
      console.log('⚠️ No route path data');
      map.current.getSource('route').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [] },
      });
      return;
    }

    console.log('🛣️ Drawing route with', routePath.length, 'coordinates');
    console.log('📊 First coordinate:', routePath[0]);
    console.log('📊 Last coordinate:', routePath[routePath.length - 1]);

    // Set the route data
    map.current.getSource('route').setData({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: routePath },
    });

    // Fit map to route bounds with padding
    try {
      const bounds = new mapboxgl.LngLatBounds();
      
      routePath.forEach((coord) => {
        bounds.extend(coord);
      });

      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000,
        maxZoom: 14,
      });

      console.log('✅ Route displayed and bounds fitted');
    } catch (error) {
      console.error('❌ Error fitting bounds:', error);
    }
  };

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        border: '2px solid var(--color-neutral-200)',
      }}
    />
  );
}