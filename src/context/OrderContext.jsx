import { createContext, useContext, useEffect, useState } from "react";
import { ls } from "../utils/storage";
import { useNotifications } from "./NotificationContext";

const Ctx = createContext(null);
export const useOrders = () => useContext(Ctx);

export const STAGES = [
  "Order confirmed",
  "Preparing groceries",
  "Order packed",
  "Rider assigned",
  "Rider picked up order",
  "Out for delivery",
  "Approaching destination",
  "Delivered",
];

export const STAGE_TO_STATUS = [
  "Confirmed",
  "Processing",
  "Packed",
  "Ready for Pickup",
  "Shipped",
  "Out for Delivery",
  "Out for Delivery",
  "Delivered",
];

// Store → customer route (Mumbai, ~1.6 km) — SIMULATED
export const DELIVERY_ROUTE = [
  { lat: 19.0760, lng: 72.8777 },
  { lat: 19.0785, lng: 72.8750 },
  { lat: 19.0810, lng: 72.8720 },
  { lat: 19.0835, lng: 72.8695 },
  { lat: 19.0860, lng: 72.8670 },
  { lat: 19.0896, lng: 72.8656 },
];

function haversineKm(a, b) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function routeDistanceKm(route) {
  let d = 0;
  for (let i = 1; i < route.length; i++) d += haversineKm(route[i - 1], route[i]);
  return d;
}

function interpolate(route, t) {
  const segs = route.length - 1;
  const pos = Math.max(0, Math.min(1, t)) * segs;
  const i = Math.min(Math.floor(pos), segs - 1);
  const localT = pos - i;
  const a = route[i], b = route[i + 1];
  return { lat: a.lat + (b.lat - a.lat) * localT, lng: a.lng + (b.lng - a.lng) * localT };
}

const TOTAL_ROUTE_KM = routeDistanceKm(DELIVERY_ROUTE);

function freshTracking() {
  return {
    active: false,
    paused: false,
    speed: 1,
    progress: 0,
    position: { ...DELIVERY_ROUTE[0] },
    stage: 0,
    distanceKm: +TOTAL_ROUTE_KM.toFixed(2),
    etaMin: 30,
    riderId: null,
  };
}

export function OrderProvider({ children }) {
  const { push: notify } = useNotifications();
  const [orders, setOrders] = useState(() => ls.get("fc_orders", []));

  useEffect(() => { ls.set("fc_orders", orders); }, [orders]);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "fc_orders" && e.newValue) {
        try { setOrders(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // global simulation tick
  useEffect(() => {
    const id = setInterval(() => {
      setOrders(prev => {
        const anyActive = prev.some(o => o.tracking?.active && !o.tracking?.paused);
        if (!anyActive) return prev;
        return prev.map(o => {
          if (!o.tracking?.active || o.tracking?.paused) return o;
          const inc = 0.015 * (o.tracking.speed || 1);
          const progress = Math.min(1, (o.tracking.progress || 0) + inc);
          const position = interpolate(DELIVERY_ROUTE, progress);
          const stage = Math.min(7, Math.floor(progress * 7.999));
          const distanceKm = +(TOTAL_ROUTE_KM * (1 - progress)).toFixed(2);
          const etaMin = Math.max(0, Math.round(distanceKm / 0.4));
          const active = progress < 1;
          const status = STAGE_TO_STATUS[stage];
          return {
            ...o,
            status,
            tracking: { ...o.tracking, progress, position, stage, distanceKm, etaMin, active },
          };
        });
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const placeOrder = ({ customer, address, slot, paymentMethod, cart, totals }) => {
    const id = "FC" + Date.now().toString().slice(-8);
    const order = {
      id,
      createdAt: new Date().toISOString(),
      customer,
      address,
      slot,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      status: "Confirmed",
      items: cart.items.map(i => ({
        productId: i.productId, variantId: i.variantId, qty: i.qty,
        name: i.product.name, variant: i.variant.label,
        price: i.variant.price, lineTotal: i.lineTotal,
      })),
      totals: {
        subtotal: cart.subtotal, discount: cart.discount,
        deliveryFee: cart.deliveryFee, tax: cart.tax, total: cart.total,
      },
      tracking: { ...freshTracking(), stage: 0 },
    };
    setOrders(prev => [order, ...prev]);
    notify({ title: "Order placed", body: `${id} · ₹${totals.total}`, type: "success", audience: "customer" });
    notify({ title: "New order received", body: `${id} from ${customer.name}`, type: "info", audience: "admin" });
    return order;
  };

  const updateOrder = (id, patch) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const updateTracking = (id, patch) => {
    setOrders(prev => prev.map(o => o.id !== id ? o : { ...o, tracking: { ...o.tracking, ...patch } }));
  };

  const assignRider = (id, riderId) => {
    updateTracking(id, { riderId, active: true, stage: 3, progress: Math.max(3 / 7, 0) });
    updateOrder(id, { status: STAGE_TO_STATUS[3] });
    notify({ title: "Rider assigned", body: `Order ${id} assigned to rider`, type: "info", audience: "customer" });
  };

  const advanceStage = (id) => {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    const next = Math.min(7, (o.tracking?.stage || 0) + 1);
    const progress = next / 7;
    const pos = interpolate(DELIVERY_ROUTE, progress);
    updateTracking(id, { stage: next, progress, position: pos, active: next < 7 });
    updateOrder(id, { status: STAGE_TO_STATUS[next] });
  };

  const setPaused = (id, paused) => updateTracking(id, { paused });
  const setSpeed = (id, speed) => updateTracking(id, { speed });
  const markDelivered = (id) => {
    updateTracking(id, { stage: 7, progress: 1, position: { ...DELIVERY_ROUTE.at(-1) }, active: false, distanceKm: 0, etaMin: 0 });
    updateOrder(id, { status: "Delivered" });
    notify({ title: "Delivered", body: `Order ${id} delivered`, type: "success", audience: "customer" });
  };
  const cancelOrder = (id, reason) => {
    updateOrder(id, { status: "Cancelled", cancelReason: reason });
    notify({ title: "Order cancelled", body: `${id} — ${reason}`, type: "error", audience: "customer" });
  };

  return (
    <Ctx.Provider value={{
      orders, placeOrder, updateOrder, updateTracking,
      assignRider, advanceStage, setPaused, setSpeed, markDelivered, cancelOrder,
      STAGES, STAGE_TO_STATUS, DELIVERY_ROUTE, TOTAL_ROUTE_KM,
    }}>
      {children}
    </Ctx.Provider>
  );
}