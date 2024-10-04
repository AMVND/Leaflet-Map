import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';

import DrawControl from './DrawControl';
import MapUpdater from './MapUpdater';
import RoutingMachine from './RoutingMachine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-draw';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import '../customDraw.css'; 


const { BaseLayer } = LayersControl;

const Map = () => {
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Các vị trí bắt đầu và kết thúc (bạn có thể tuỳ chỉnh hoặc nhận từ input của người dùng)
  const start = currentLocation;  // Hà Nội
  const end = [21.003117, 105.820140];    // Vị trí khác ở Hà Nội


  useEffect(() => {
    fetch('/layers.json')
      .then((response) => response.json())
      .then((data) => setLayers(data))
      .catch((error) => console.error('Error fetching layers:', error));
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error('Error getting geolocation:', error)
      );
    }
  }, []);

  

 
  return (
    <>
      <MapContainer center={start} zoom={15} style={{ height: "100vh", width: "100%" }} whenCreated={setMap}>
        <LayersControl position="topright">
          {layers.map((layer, index) => (
            <BaseLayer key={index} checked={layer.checked} name={layer.name}>
              <TileLayer url={layer.url} attribution={layer.attribution} />
              {map && <RoutingMachine map={map} start={start} end={end} />}
            </BaseLayer>
          ))}
        </LayersControl>
        <DrawControl />
        {selectedPlace && (
          <>
            <Marker
              position={[selectedPlace.lat, selectedPlace.lon]}
              
            >
              <Popup>{selectedPlace.display_name}</Popup>
            </Marker>
            <MapUpdater lat={selectedPlace.lat} lon={selectedPlace.lon} />
          </>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
