import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { IndianRupee, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useStore } from "../../context/StoreContext";
import { formatINR, formatDateTime } from "../../utils/format";

const COLORS = ["#168653", "#FFAA45", "#22A06B", "#F2A541", "#E05252", "#758078"];

export default function Overview() {
  const { orders } = useOrders();
  const { products, categories } = useStore();

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.totals.total, 0);
    const pending = orders.filter(o => ["Confirmed", "Processing", "Packed"].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;
    const lowStock = products.filter(p => p.variants.some(v => v.stock < 10)).length;
    return { revenue, pending, delivered, cancelled, lowStock };
  }, [orders, products]);

  const weekly = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString("en-IN", { weekday: "short" }), revenue: 0 };
    });
    orders.forEach(o => {
      const idx = days.findIndex((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return new Date(o.createdAt).toDateString() === d.toDateString();
      });
      if (idx >= 0) days[idx].revenue += o.totals.total;
    });
    return days;
  }, [orders]);

  const catRevenue = useMemo(() => {
    const map = {};
    orders.forEach(o => o.items.forEach(it => {
      const p = products.find(x => x.id === it.productId);
      const cat = p?.category || "other";
      map[cat] = (map[cat] || 0) + it.lineTotal;
    }));
    return Object.entries(map).map(([id, value]) => ({
      name: categories.find(c => c.id === id)?.name || id, value,
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [orders, products, categories]);

  const statusDist = useMemo(() => {
    const map = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI icon={IndianRupee} label="Revenue" value={formatINR(stats.revenue)} />
        <KPI icon={ShoppingCart} label="Orders" value={orders.length} />
        <KPI icon={TrendingUp} label="Pending" value={stats.pending} />
        <KPI icon={Package} label="Low stock" value={stats.lowStock} />
        <KPI icon={Users} label="Delivered" value={stats.delivered} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-bold mb-3">Weekly revenue</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#168653" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h2 className="font-bold mb-3">Revenue by category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={catRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="#168653" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h2 className="font-bold mb-3">Order status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h2 className="font-bold mb-3">Recent orders</h2>
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-mint">
                <div>
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-xs text-muted">{o.customer?.name} · {formatDateTime(o.createdAt)}</div>
                </div>
                <span className="text-xs font-bold">{formatINR(o.totals.total)}</span>
              </Link>
            ))}
            {orders.length === 0 && <div className="text-sm text-muted py-4 text-center">No orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs text-muted"><Icon className="w-3.5 h-3.5" /> {label}</div>
      <div className="font-extrabold text-lg mt-1">{value}</div>
    </div>
  );
}