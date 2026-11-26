import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { DELIVERY_ROUTE } from "../../context/OrderContext";

function divIcon(html, className) {
  return L.divIcon({
    html: `<div class="${className}">${html}</div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

const storeIcon = divIcon("🏬", "w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-card text-lg border-2 border-white");
const customerIcon = divIcon("🏠", "w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-card text-lg border-2 border-white");
const riderIcon = divIcon("🛵", "w-10 h-10 rounded-full bg-white ring-4 ring-primary/30 flex items-center justify-center shadow-card text-lg animate-pulse");

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    try { map.fitBounds(points.map(p => [p.lat, p.lng]), { padding: [40, 40] }); } catch {}
  }, [map, points]);
  return null;
}

export default function TrackingMap({ riderPosition, height = 380 }) {
  const store = DELIVERY_ROUTE[0];
  const customer = DELIVERY_ROUTE.at(-1);
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-soft" style={{ height }}>
      <MapContainer center={[riderPosition?.lat || store.lat, riderPosition?.lng || store.lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={DELIVERY_ROUTE.map(p => [p.lat, p.lng])} pathOptions={{ color: "#168653", weight: 5, dashArray: "8 8" }} />
        <Marker position={[store.lat, store.lng]} icon={storeIcon}><Popup>FreshCart Store</Popup></Marker>
        <Marker position={[customer.lat, customer.lng]} icon={customerIcon}><Popup>Delivery Address</Popup></Marker>
        {riderPosition && <Marker position={[riderPosition.lat, riderPosition.lng]} icon={riderIcon}><Popup>Rider (Simulated GPS)</Popup></Marker>}
        <FitBounds points={[store, customer, ...(riderPosition ? [riderPosition] : [])]} />
      </MapContainer>
    </div>
  );
}