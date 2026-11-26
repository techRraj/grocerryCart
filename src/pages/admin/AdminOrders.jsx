import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { formatINR, formatDateTime } from "../../utils/format";

export default function AdminOrders() {
  const { orders } = useOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const filtered = orders.filter(o =>
    (!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.customer?.name.toLowerCase().includes(q.toLowerCase())) &&
    (!status || o.status === status)
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <input className="input w-52" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
          <select className="input w-44" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["Confirmed","Processing","Packed","Ready for Pickup","Shipped","Out for Delivery","Delivered","Cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 hidden md:table-cell">Placed</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-t border-gray-100 hover:bg-mint/40">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">{o.customer?.name}</td>
                <td className="px-4 py-3 text-muted hidden md:table-cell">{formatDateTime(o.createdAt)}</td>
                <td className="px-4 py-3">{formatINR(o.totals.total)}</td>
                <td className="px-4 py-3"><span className="badge bg-primary-light text-primary">{o.status}</span></td>
                <td className="px-4 py-3 text-xs text-muted">{o.paymentMethod} · {o.paymentStatus}</td>
                <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="text-primary font-semibold text-xs">Open →</Link></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}