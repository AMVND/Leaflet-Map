import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-draw';

const { BaseLayer } = LayersControl;

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

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs()[0];
      const distances = [];

      for (let i = 0; i < latlngs.length - 1; i++) {
        const distance = latlngs[i].distanceTo(latlngs[i + 1]);
        distances.push(distance);
        const midPoint = L.latLng(
          (latlngs[i].lat + latlngs[i + 1].lat) / 2,
          (latlngs[i].lng + latlngs[i + 1].lng) / 2
        );
        L.marker(midPoint, {
          icon: L.divIcon({
            className: 'distance-label',
            html: `${(distance / 1000).toFixed(2)} km`,
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
      L.marker(midPoint, {
        icon: L.divIcon({
          className: 'distance-label',
          html: `${(closingDistance / 1000).toFixed(2)} km`,
        }),
      }).addTo(distanceMarkers);
    });

    // Clear drawn items and distance markers
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

const Map = () => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    fetch('/layers.json')
      .then((response) => response.json())
      .then((data) => setLayers(data));
  }, []);


    return (
        <MapContainer center={[21.239269, 105.703560]} zoom={15} style={{ height: "100vh", width: "100%" }}>
            <LayersControl position="topright">
                {layers.map((layer, index) => (
                    <BaseLayer key={index} checked={layer.checked} name={layer.name}>
                        <TileLayer url={layer.url} attribution={layer.attribution} />
                    </BaseLayer>
                ))}
            </LayersControl>
            <DrawControl />
            {/* <UpdateMapSize /> */}
        </MapContainer>
    );
};

export default Map;
