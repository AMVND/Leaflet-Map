import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

const Map = () => {
    const UpdateMapSize = () => {
        const map = useMap();
        useEffect(() => {
            const handleResize = () => {
                map.invalidateSize();
            };
            window.addEventListener('resize', handleResize);
            map.invalidateSize();
        })
    }

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
            <UpdateMapSize />
        </MapContainer>
    );
};

export default Map;
