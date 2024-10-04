import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import L from 'leaflet'; // Import Leaflet

const LocateControl = ({ setActive }) => {
  const map = useMap();

  useEffect(() => {
    // Tạo button icon khi map được khởi tạo
    const locateButton = L.control({ position: 'topright' });

    locateButton.onAdd = () => {
      const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
      button.innerHTML = '🎯';  // Biểu tượng icon
      button.style.backgroundColor = 'white';
      button.style.width = '30px';
      button.style.height = '30px';

      // Sự kiện click vào button
      L.DomEvent.on(button, 'click', () => {
        setActive(true); // Kích hoạt xác định vị trí
      });

      return button;
    };

    locateButton.addTo(map);
  }, [map, setActive]);

  return null;
};

const MapWithRouting = () => {
  const [active, setActive] = useState(false);  // Trạng thái để kích hoạt xác định vị trí

  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Thêm button custom trên bản đồ */}
      <LocateControl setActive={setActive} />

      {/* Sử dụng LocationMarker khi "active" */}
      <LocationMarker active={active} />
    </MapContainer>
  );
};

export default MapWithRouting;
