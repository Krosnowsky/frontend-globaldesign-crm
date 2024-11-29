
import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

// Styl kontenera mapy
const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px',

  marginTop:'40px',
};

const LocationMap = ({ latitude, longitude }) => {
  // Ustawienia domyślne (w razie braku danych)
  const defaultCenter = { lat: 52.379189, lng: 16.869267 };

  // Współrzędne dla mapy
  const mapCenter = {
    lat: parseFloat(latitude) || defaultCenter.lat,
    lng: parseFloat(longitude) || defaultCenter.lng,
  };

  console.log("Debug: Rendering map with center:", mapCenter);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBNC_0VwA2VQecZmZp5On6GlYPtdH95l5o">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
      >
        {/* Użycie Markera */}
        <MarkerF position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;
