import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';
import Sidebar from './sidebar/SideBar';
import DrawControl from './DrawControl';
import MapUpdater from './MapUpdater';
import LocationMarker from './LocationMarker';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-draw';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import '../customDraw.css'; 

const { BaseLayer } = LayersControl;

const Map = () => {
  const [layers, setLayers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef();
  const routingControlRef = useRef(null);

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

  useEffect(() => {
    const mapControls = document.querySelectorAll('.leaflet-control');
    mapControls.forEach((control) => {
      control.style.marginLeft = isSidebarOpen ? 'var(--sidebar-toggle-width)' : 'var(--map-control-margin)';
    });
  }, [isSidebarOpen]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
    });
  };

  const handleLocationSelected = (latlng) => {
    if (mapRef.current && currentLocation) {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(currentLocation.lat, currentLocation.lon),
          L.latLng(latlng.lat, latlng.lng),
        ],
        routeWhileDragging: true,
      }).addTo(mapRef.current);
    }
  };



  return (
    <>
      <button
        className={`open-button ${!isSidebarOpen ? 'visible' : ''}`}
        onClick={handleSidebarToggle}
      >
        =
      </button>
      <Sidebar onPlaceSelected={handlePlaceSelected} onToggleSidebar={handleSidebarToggle} isOpen={isSidebarOpen} />
      <MapContainer center={[21.239269, 105.703560]} zoom={15} style={{ height: "100vh", width: "100%" }} whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}>
        <LayersControl position="topright">
          {layers.map((layer, index) => (
            <BaseLayer key={index} checked={layer.checked} name={layer.name}>
              <TileLayer url={layer.url} attribution={layer.attribution} />
            </BaseLayer>
          ))}
        </LayersControl>
        <DrawControl />
        <LocationMarker onLocationSelected={handleLocationSelected} />
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
