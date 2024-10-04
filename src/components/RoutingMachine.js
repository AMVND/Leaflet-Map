import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ map, waypoints, lineOptions }) => {
  useEffect(() => {
    if (!map || waypoints.length === 0) return;

    // Tạo tuyến đường với nhiều điểm dừng
    const routingControl = L.Routing.control({
      waypoints: waypoints.map(point => L.latLng(point[0], point[1])), // Tạo các điểm dừng
      routeWhileDragging: true,
      lineOptions: lineOptions || { styles: [{ color: 'blue', weight: 4 }] } // Tùy chỉnh phong cách đường
    }).addTo(map);

    // Cleanup khi component unmount
    return () => map.removeControl(routingControl);
  }, [map, waypoints, lineOptions]);

  return null;
};

export default RoutingMachine;
