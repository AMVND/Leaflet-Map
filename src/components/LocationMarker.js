import React, { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';

const LocationMarker = ({ onLocationSelected }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelected(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default LocationMarker;
