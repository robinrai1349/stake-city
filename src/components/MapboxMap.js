import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaW5yYWkxMzQ5IiwiYSI6ImNtMTlsOHN5aDFob2gya3NjZGo5MmNneWYifQ.cJcoZ2HGa3koVMYFWPTJFw';

const MapboxMap = ({ position, searchPerformed }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // Ref to store the map instance

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/robinrai1349/cm1apho4200fz01pc323f11og',
        projection: 'globe',
        zoom: searchPerformed ? 7 : 1, // Initial zoom level
        center: position || [0, 0], // Initial position, default to [0, 0]
      });

      mapRef.current = map; // Store the map instance in the ref

      map.addControl(new mapboxgl.NavigationControl()); // Add zoom and rotation controls

      map.on('style.load', () => {
        map.setFog({}); // Optional fog effect
      });

      // Spin the globe when no search is performed
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

      map.on('mousedown', () => { userInteracting = true; });
      map.on('dragstart', () => { userInteracting = true; });

      map.on('moveend', () => { spinGlobe(); });
      spinGlobe();

      return () => map.remove();
    }
  }, []);

  // Animate the map when a new search is performed
  useEffect(() => {
    if (searchPerformed && position && mapRef.current) {
      mapRef.current.flyTo({
        center: position, // The [longitude, latitude] of the location
        zoom: 10,         // Target zoom level
        speed: 1.5,       // Fly speed (1 is default, higher is faster)
        curve: 1.2,       // How the animation should progress (1 is linear)
        easing: (t) => t, // Easing function (can be customized)
        essential: true   // This animation is essential, so the user cannot stop it
      });
    }
  }, [position, searchPerformed]); // Trigger this effect when position or searchPerformed changes

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default MapboxMap;