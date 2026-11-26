import { useParams, Link } from "react-router-dom";
import { Phone, Bike, Clock, MapPin } from "lucide-react";
import { useOrders, STAGES } from "../../context/OrderContext";
import { seedRiders } from "../../data/riders";
import TrackingMap from "../../components/tracking/TrackingMap";
import TrackingTimeline from "../../components/tracking/TrackingTimeline";

export default function TrackOrder() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return <div className="max-w-3xl mx-auto p-6">Order not found. <Link to="/account" className="text-primary">Back</Link></div>;
  const rider = order.tracking?.riderId ? seedRiders.find(r => r.id === order.tracking.riderId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Track order · {order.id}</h1>
          <p className="text-muted text-sm">Status: <b className="text-primary">{order.status}</b> · GPS & ETA are simulated.</p>
        </div>
        <Link to="/account" className="btn-ghost border border-gray-200">My orders</Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <TrackingMap riderPosition={order.tracking?.position} height={420} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat icon={Clock} label="ETA" value={`${order.tracking?.etaMin ?? "—"} min`} />
            <Stat icon={MapPin} label="Distance" value={`${order.tracking?.distanceKm ?? "—"} km`} />
            <Stat icon={Bike} label="Stage" value={STAGES[order.tracking?.stage ?? 0]} />
          </div>
          <div className="card p-4">
            <h3 className="font-bold mb-3">Delivery progress</h3>
            <TrackingTimeline currentStage={order.tracking?.stage ?? 0} />
          </div>
        </div>

        <aside className="space-y-4">
          {rider && (
            <div className="card p-4">
              <h3 className="font-bold mb-3">Your rider</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">{rider.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold">{rider.name}</div>
                  <div className="text-xs text-muted">{rider.vehicle} · {rider.plate}</div>
                </div>
                <a href={`tel:${rider.phone}`} className="p-2 bg-primary-light text-primary rounded-lg"><Phone className="w-4 h-4" /></a>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-bold mb-2">Delivery address</h3>
            <div className="text-sm text-muted">{order.address}</div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold mb-2">Items ({order.items.length})</h3>
            <div className="space-y-1.5 text-sm">
              {order.items.map((i, k) => (
                <div key={k} className="flex justify-between">
                  <span>{i.qty} × {i.name}</span>
                  <span className="text-muted">{i.variant}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-2 text-xs text-muted"><Icon className="w-3.5 h-3.5" /> {label}</div>
      <div className="font-bold mt-0.5 text-sm">{value}</div>
    </div>
  );
}