import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';

const LocationMarker = ({ active }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();  // Lấy đối tượng bản đồ từ hook useMap

  useMapEvents({
    click() {
      if (active) {
        map.locate();  // Sử dụng đối tượng bản đồ lấy từ useMap
      }
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());  // Di chuyển bản đồ đến vị trí
    }
  });

  useEffect(() => {
    if (active) {
      map.locate();
    }
  }, [map, active]);  // Tự động kích hoạt locate khi active là true

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default LocationMarker;
