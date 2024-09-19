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
    <div>
      <SearchBar onSearch={handleSearch} />
      <MapboxMap position={center} searchPerformed={searchPerformed} />
    </div>
  );
};

export default App;
