import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF6aGFydWxwYXJhc2giLCJhIjoiY20xOWx4eWtwMTg5bTJxcjRuM3c3M245dCJ9.RaotAJ6FcHCKI8pIILI72w';

const MapboxMap = ({ position, searchPerformed }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe',
        zoom: searchPerformed ? 7 : 1, // Set zoom level based on searchPerformed
        center: position || [0, 0] // Default to [0, 0] if no position is provided
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.scrollZoom.disable();

      map.on('style.load', () => {
        map.setFog({});
      });

      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;

      let userInteracting = false;
      const spinEnabled = true;

      function spinGlobe() {
        const zoom = map.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.getCenter();
          center.lng -= distancePerSecond;
          map.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.on('mousedown', () => {
        userInteracting = true;
      });
      map.on('dragstart', () => {
        userInteracting = true;
      });

      map.on('moveend', () => {
        spinGlobe();
      });

      spinGlobe();

      return () => map.remove();
    }
  }, [position, searchPerformed]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default MapboxMap;
