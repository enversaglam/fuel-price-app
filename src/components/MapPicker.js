import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([52.52, 13.405]); // Varsayılan olarak Berlin
  
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
  
};

export default MapPicker;