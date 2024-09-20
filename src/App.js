import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import MapboxMap from './components/MapboxMap';

const App = () => {
  const [center, setCenter] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (location) => {
    setCenter(location);
    setSearchPerformed(true); // Mark that a search has been performed
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <SearchBar 
        onSearch={handleSearch} 
        style={{ 
          position: 'absolute', 
          top: '20px',  // Margin from the top of the screen
          left: '20px', // Margin from the left of the screen
          width: '45%', // Restrict width to less than 50%
          maxWidth: '400px', // Maximum width cap
          zIndex: 10,   // Keep it on top of the map
          padding: '10px', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: for visibility
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Optional shadow effect
        }} 
      />
      <MapboxMap 
        position={center} 
        searchPerformed={searchPerformed} 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default App;
