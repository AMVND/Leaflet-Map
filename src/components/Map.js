import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl, Marker, Popup } from 'react-leaflet';
import Sidebar from './sidebar/SideBar';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-draw';

// Change MAP VIEW
const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  if (lat && lon) {
    map.setView([lat, lon], 16);
  }
  return null;
};


// Control Layers
const { BaseLayer } = LayersControl;


// Draw Polygon Control
const DrawControl = () => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    const distanceMarkers = new L.FeatureGroup(); // To hold distance labels
    map.addLayer(drawnItems);
    map.addLayer(distanceMarkers);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    //Calculate Angle of Distance Label
    const calculateAngle = (latlng1, latlng2) => {
      const dx = latlng2.lng - latlng1.lng;
      const dy = latlng2.lat - latlng1.lat;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    };

    //Calculate Distance 
    const calculateDistances = (layer) => {
      const latlngs = layer.getLatLngs()[0];
      const distances = [];
      for (let i = 0; i < latlngs.length - 1; i++) {
        const distance = latlngs[i].distanceTo(latlngs[i + 1]);
        distances.push(distance);
        const midPoint = L.latLng(
          (latlngs[i].lat + latlngs[i + 1].lat) / 2,
          (latlngs[i].lng + latlngs[i + 1].lng) / 2
        );
        const angle = calculateAngle(latlngs[i], latlngs[i + 1]);
        L.marker(midPoint, {
          icon: L.divIcon({
            className: 'distance-label',
            html: `<div style="transform: rotate(${angle}deg);">${(distance / 1000).toFixed(2)} km</div>`,
          }),
        }).addTo(distanceMarkers);
      }

      // Close the polygon by connecting the last point to the first point
      const closingDistance = latlngs[latlngs.length - 1].distanceTo(latlngs[0]);
      distances.push(closingDistance);
      const midPoint = L.latLng(
        (latlngs[latlngs.length - 1].lat + latlngs[0].lat) / 2,
        (latlngs[latlngs.length - 1].lng + latlngs[0].lng) / 2
      );
      const angle = calculateAngle(latlngs[latlngs.length - 1], latlngs[0]);
      L.marker(midPoint, {
        icon: L.divIcon({
          className: 'distance-label',
          html: `<div style="transform: rotate(${angle}deg);">${(closingDistance / 1000).toFixed(2)} km</div>`,
        }),
      }).addTo(distanceMarkers);
    };

    //CREATE DRAW
    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      calculateDistances(layer);
    });

    //EDIT DRAW
    map.on(L.Draw.Event.EDITED, function (event) {
      const layers = event.layers;
      distanceMarkers.clearLayers(); // Clear existing distance markers
      layers.eachLayer((layer) => {
        calculateDistances(layer);
      });
    });

    // DELETE DRAW
    map.on(L.Draw.Event.DELETED, function () {
      drawnItems.clearLayers();
      distanceMarkers.clearLayers();
    });

    return () => {
      map.removeControl(drawControl);
      drawnItems.clearLayers();
      distanceMarkers.clearLayers();
    };
  }, [map]);

  return null;
};

//SIDEBAR
const Map = () => {
  const [layers, setLayers] = useState([]);
  useEffect(() => {
    fetch('/layers.json')
      .then((response) => response.json())
      .then((data) => setLayers(data));
  }, []);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
    });
  };

  //Toggle Sidebar
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //ICON
  const animatedMarkerIcon = L.divIcon({
    className: 'animated-marker',
  });

  useEffect(() => {
    const mapControls = document.querySelectorAll('.leaflet-control');
    mapControls.forEach((control) => {
      control.style.marginLeft = isSidebarOpen ? '330px' : '10px';
    });
  }, [isSidebarOpen]);
  return (
    <>
      <Sidebar onPlaceSelected={handlePlaceSelected} onToggleSidebar={handleSidebarToggle} isOpen={isSidebarOpen} />
      <MapContainer center={[21.239269, 105.703560]} zoom={15} style={{ height: "100vh", width: "100%" }}>
        <LayersControl position="topright">
          {layers.map((layer, index) => (
            <BaseLayer key={index} checked={layer.checked} name={layer.name}>
              <TileLayer url={layer.url} attribution={layer.attribution} />
            </BaseLayer>
          ))}
        </LayersControl>
        <DrawControl />
        {selectedPlace && (
          <>
            <Marker
              position={[selectedPlace.lat, selectedPlace.lon]}
              icon={animatedMarkerIcon}
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