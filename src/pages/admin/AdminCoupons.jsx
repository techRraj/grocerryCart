import { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { formatINR } from "../../utils/format";

export default function AdminCoupons() {
  const { coupons, upsertCoupon, deleteCoupon } = useStore();
  const [form, setForm] = useState({ code: "", type: "percent", value: 10, minCart: 499, maxDiscount: 200, active: true, expiry: "2026-12-31", usageLimit: 100 });
  const submit = (e) => { e.preventDefault(); upsertCoupon(form); setForm({ ...form, code: "" }); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <form onSubmit={submit} className="card p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <input className="input" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="percent">Percent</option><option value="fixed">Fixed</option>
        </select>
        <input className="input" type="number" placeholder="Value" value={form.value} onChange={e => setForm({ ...form, value: +e.target.value })} />
        <input className="input" type="number" placeholder="Min cart" value={form.minCart} onChange={e => setForm({ ...form, minCart: +e.target.value })} />
        <button className="btn-primary">Add coupon</button>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted"><tr><th className="px-3 py-2">Code</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Value</th><th className="px-3 py-2">Min cart</th><th className="px-3 py-2">Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.code} className="border-t border-gray-100">
                <td className="px-3 py-2 font-semibold">{c.code}</td>
                <td className="px-3 py-2">{c.type}</td>
                <td className="px-3 py-2">{c.type === "percent" ? `${c.value}%` : formatINR(c.value)}</td>
                <td className="px-3 py-2">{formatINR(c.minCart)}</td>
                <td className="px-3 py-2">{c.active ? "Yes" : "No"}</td>
                <td className="px-3 py-2"><button onClick={() => deleteCoupon(c.code)} className="text-error text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}