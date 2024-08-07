import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 16);
    }
  }, [lat, lon, map]);
  return null;
};

export default MapUpdater;
