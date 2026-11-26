import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [form, setForm] = useState({ storeName: "FreshCart Demo", phone: "+91 90000 12345", address: "Mumbai, India", freeDelivery: 499 });
  
  const submit = (e) => {
    e.preventDefault();
    toast.success("Settings saved (demo)");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Store Settings</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Store Name</label>
          <input className="input" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Contact Phone</label>
          <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Address</label>
          <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted mb-1 block">Free Delivery Threshold (₹)</label>
          <input className="input" type="number" value={form.freeDelivery} onChange={e => setForm({ ...form, freeDelivery: +e.target.value })} />
        </div>
        <button className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}