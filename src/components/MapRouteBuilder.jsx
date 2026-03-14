import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWgtbW91ZG9vZCIsImEiOiJjbWp6eTY0NngyeGw2M21xM2gxcnFsd2V3In0.NGX1K3kh6u-i3YWNUTBGnw';

export default function MapRouteBuilder({ stops, onStopsChange, onRouteDataChange }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [encodedPolyline, setEncodedPolyline] = useState(null);
  const [decodedCoordinates, setDecodedCoordinates] = useState([]);

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
          'line-width': 4,
          'line-color': '#3b82f6',
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
          'circle-radius': 8,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2,
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
          'text-size': 12,
          'text-offset': [0, 0],
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Pointer cursor on hover
      map.current.on('mouseenter', 'routePoints', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'routePoints', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Remove stop on click
      map.current.on('click', 'routePoints', (e) => {
        const clicked = e.features[0].geometry.coordinates;
        const newStops = stops.filter(
          (s) => !(s.lng === clicked[0] && s.lat === clicked[1])
        );
        onStopsChange(newStops);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when stops change
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    updatePoints();
    refreshRoute();
  }, [stops]);

  const updatePoints = () => {
    if (!map.current || !map.current.getSource('points')) return;

    map.current.getSource('points').setData({
      type: 'FeatureCollection',
      features: stops.map((stop, index) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [stop.lng, stop.lat] },
        properties: { stopNumber: (index + 1).toString() },
      })),
    });
  };

  const refreshRoute = async () => {
    if (!map.current || !map.current.getSource('route')) return;

    if (stops.length < 2) {
      map.current.getSource('route').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [] },
      });
      setDecodedCoordinates([]);
      setEncodedPolyline(null);
      onRouteDataChange(null, []);
      return;
    }

    try {
      const coords = stops.map((s) => `${s.lng},${s.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=polyline6&access_token=${mapboxgl.accessToken}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const encoded = route.geometry;
        const decoded = decodePolyline6(encoded);

        setEncodedPolyline(encoded);
        setDecodedCoordinates(decoded);

        map.current.getSource('route').setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: decoded },
        });

        // Pass route data to parent
        onRouteDataChange(encoded, decoded);

        // Fit map to route bounds
        if (decoded.length > 0) {
          const bounds = decoded.reduce(
            (bounds, coord) => bounds.extend(coord),
            new mapboxgl.LngLatBounds(decoded[0], decoded[0])
          );
          map.current.fitBounds(bounds, { padding: 50 });
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Decode polyline6
  const decodePolyline6 = (encoded) => {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [];

    while (index < encoded.length) {
      let shift = 0,
        result = 0,
        byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push([lng / 1e6, lat / 1e6]);
    }
    return coordinates;
  };

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    />
  );
}