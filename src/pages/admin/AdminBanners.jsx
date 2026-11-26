import { useState } from "react";
import { toast } from "sonner";

export default function AdminBanners() {
  const [banners, setBanners] = useState([
    { id: 1, title: "Summer Sale", active: true },
    { id: 2, title: "Free Delivery above ₹499", active: true }
  ]);
  
  const toggle = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success("Banner status updated");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Banners</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div key={b.id} className="card p-4 flex justify-between items-center">
            <div>
              <div className="font-bold">{b.title}</div>
              <div className="text-xs text-muted">{b.active ? "Active" : "Inactive"}</div>
            </div>
            <button onClick={() => toggle(b.id)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${b.active ? "bg-error/10 text-error" : "bg-primary text-white"}`}>
              {b.active ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}