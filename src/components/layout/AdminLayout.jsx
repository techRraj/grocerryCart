import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Package, Boxes, Users,
  MapPin, Ticket, LogOut, Store, BarChart3, Settings,
  Image, ShieldAlert, Star, UserCog
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const nav = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/tracking", icon: MapPin, label: "Live Tracking" },
  { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { to: "/admin/reviews", icon: Star, label: "Reviews" },
  { to: "/admin/banners", icon: Image, label: "Banners" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports & Analytics" },
  { to: "/admin/staff", icon: UserCog, label: "Staff & Roles" },
  { to: "/admin/settings", icon: Settings, label: "Store Settings" },
  { to: "/admin/audit-logs", icon: ShieldAlert, label: "Audit Logs" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav2 = useNavigate();
  const [open, setOpen] = useState(false);
  
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin" && user.role !== "delivery") return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className={`bg-white border-r border-gray-100 w-64 fixed md:static inset-y-0 z-40 transition-transform flex flex-col ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">F</div>
            <div>
              <div className="font-extrabold">FreshCart</div>
              <div className="text-[11px] text-muted">Admin Console</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${isActive ? "bg-primary-light text-primary" : "text-muted hover:bg-mint hover:text-ink"}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:bg-mint">
            <Store className="w-4 h-4" /> View Store
          </NavLink>
          <button
            onClick={() => { logout(); nav2("/admin/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:bg-mint"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <button className="md:hidden p-2 rounded-lg hover:bg-mint" onClick={() => setOpen(!open)}>☰</button>
          <div className="text-sm text-muted">Signed in as <b className="text-ink">{user.name}</b></div>
        </header>
        <main className="p-4 md:p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}