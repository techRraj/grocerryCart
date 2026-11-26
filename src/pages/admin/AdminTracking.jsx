import { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { seedRiders } from "../../data/riders";
import TrackingMap from "../../components/tracking/TrackingMap";
import TrackingTimeline from "../../components/tracking/TrackingTimeline";
import { formatINR } from "../../utils/format";

export default function AdminTracking() {
  const { orders, setPaused, setSpeed, advanceStage, markDelivered } = useOrders();
  const active = orders.filter(o => o.tracking?.riderId);
  const [selectedId, setSelectedId] = useState(active[0]?.id);
  const selected = orders.find(o => o.id === selectedId) || active[0];

  if (active.length === 0) return (
    <div className="card p-8 text-center text-muted">No active deliveries. Assign riders from the Orders screen.</div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Live Tracking</h1>
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <div className="card p-2 space-y-1 max-h-[80vh] overflow-y-auto">
          {active.map(o => {
            const rider = seedRiders.find(r => r.id === o.tracking.riderId);
            return (
              <button key={o.id} onClick={() => setSelectedId(o.id)}
                className={`w-full text-left p-3 rounded-xl ${o.id === selected?.id ? "bg-primary-light" : "hover:bg-mint"}`}>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{o.id}</span>
                  <span className="text-xs text-primary">{o.status}</span>
                </div>
                <div className="text-xs text-muted">{rider?.name} · {o.tracking.distanceKm} km · {o.tracking.etaMin} min</div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="space-y-4">
            <TrackingMap riderPosition={selected.tracking.position} height={360} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">Order {selected.id}</h3>
                  <span className="badge bg-primary-light text-primary">{selected.status}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div><b>Customer:</b> {selected.customer.name}</div>
                  <div><b>Address:</b> {selected.address}</div>
                  <div><b>Total:</b> {formatINR(selected.totals.total)}</div>
                  <div><b>Distance:</b> {selected.tracking.distanceKm} km · ETA {selected.tracking.etaMin} min</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setPaused(selected.id, !selected.tracking.paused)} className="btn-ghost border border-gray-200 text-xs">
                    {selected.tracking.paused ? "Resume" : "Pause"}
                  </button>
                  <select className="input w-auto text-xs" value={selected.tracking.speed || 1} onChange={e => setSpeed(selected.id, +e.target.value)}>
                    <option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option>
                  </select>
                  <button onClick={() => advanceStage(selected.id)} className="btn-ghost border border-gray-200 text-xs">Next</button>
                  <button onClick={() => markDelivered(selected.id)} className="btn-primary text-xs">Delivered</button>
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-bold mb-3">Timeline</h3>
                <TrackingTimeline currentStage={selected.tracking.stage} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}