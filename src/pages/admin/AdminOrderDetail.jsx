import { useParams, Link } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { seedRiders } from "../../data/riders";
import { formatINR, formatDateTime } from "../../utils/format";
import { toast } from "sonner";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { orders, assignRider, advanceStage, markDelivered, setPaused, setSpeed, cancelOrder, updateOrder } = useOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return <div>Order not found.</div>;

  const tracking = order.tracking || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Link to="/admin/orders" className="text-xs text-primary font-semibold">← All orders</Link>
          <h1 className="text-2xl font-bold">{order.id}</h1>
          <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.tracking?.riderId ? (
            <button onClick={() => setPaused(order.id, !tracking.paused)} className="btn-ghost border border-gray-200">
              {tracking.paused ? "Resume" : "Pause"}
            </button>
          ) : null}
          <select className="input w-auto" value={tracking.speed || 1} onChange={e => setSpeed(order.id, +e.target.value)}>
            <option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option>
          </select>
          <button onClick={() => advanceStage(order.id)} className="btn-ghost border border-gray-200">Next stage</button>
          <button onClick={() => markDelivered(order.id)} className="btn-primary">Mark delivered</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4 space-y-3">
          <h2 className="font-bold">Customer</h2>
          <div className="text-sm">{order.customer?.name}<br/>{order.customer?.email}<br/>{order.customer?.phone}</div>
          <div>
            <div className="text-xs text-muted mb-1">Delivery address</div>
            <div className="text-sm">{order.address}</div>
          </div>
          <div className="text-xs text-muted">Slot: {order.slot}</div>
        </div>

        <div className="card p-4 space-y-3">
          <h2 className="font-bold">Payment & status</h2>
          <div className="text-sm">Method: <b>{order.paymentMethod}</b></div>
          <div className="text-sm">Payment status: <b>{order.paymentStatus}</b></div>
          <div className="text-sm">Order status: <b>{order.status}</b></div>
          <div>
            <label className="text-xs font-semibold text-muted">Assign rider</label>
            <select className="input mt-1" value={tracking.riderId || ""} onChange={e => { assignRider(order.id, e.target.value); toast.success("Rider assigned & simulation started"); }}>
              <option value="">— Select rider —</option>
              {seedRiders.map(r => <option key={r.id} value={r.id}>{r.name} · {r.vehicle}</option>)}
            </select>
          </div>
          <button onClick={() => cancelOrder(order.id, "Admin cancellation")} className="text-xs text-error hover:underline">Cancel order</button>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-bold mb-3">Items</h2>
        <div className="space-y-2">
          {order.items.map((i, k) => (
            <div key={k} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
              <span>{i.qty} × {i.name} ({i.variant})</span>
              <span>{formatINR(i.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-3">
          <span>Total</span><span>{formatINR(order.totals.total)}</span>
        </div>
      </div>
    </div>
  );
}