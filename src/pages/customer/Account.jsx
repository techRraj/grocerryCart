import { Link, useNavigate } from "react-router-dom";
import { Package, LogOut, Heart, MapPin, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { formatINR, formatDateTime } from "../../utils/format";

export default function Account() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const nav = useNavigate();
  if (!user) { nav("/login"); return null; }
  const mine = orders.filter(o => o.customer?.email === user.email || o.customer?.name === user.name);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted text-sm">{user.email} · {user.role}</p>
        </div>
        <button onClick={() => { logout(); nav("/"); }} className="btn-ghost border border-gray-200"><LogOut className="inline w-4 h-4 mr-1" /> Logout</button>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="card p-3 h-fit space-y-1">
          <Link to="/account" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-light text-primary text-sm font-semibold"><Package className="w-4 h-4" /> My orders</Link>
          <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-mint"><Heart className="w-4 h-4" /> Wishlist</Link>
          <Link to="/cart" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-mint"><MapPin className="w-4 h-4" /> Cart</Link>
          <Link to="/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-mint"><Bell className="w-4 h-4" /> Notifications</Link>
        </aside>

        <div className="space-y-3">
          <h2 className="font-bold text-lg">Your orders</h2>
          {mine.length === 0 ? (
            <div className="card p-8 text-center text-muted">No orders yet. <Link to="/shop" className="text-primary font-semibold">Start shopping</Link></div>
          ) : mine.map(o => (
            <div key={o.id} className="card p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-xs text-muted">{formatDateTime(o.createdAt)} · {o.items.length} items</div>
                </div>
                <span className={`badge ${o.status === "Delivered" ? "bg-success/10 text-success" : o.status === "Cancelled" ? "bg-error/10 text-error" : "bg-primary-light text-primary"}`}>{o.status}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="font-bold">{formatINR(o.totals.total)}</div>
                <div className="flex gap-2">
                  <Link to={`/track-order/${o.id}`} className="btn-ghost border border-gray-200 text-sm">Track</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}