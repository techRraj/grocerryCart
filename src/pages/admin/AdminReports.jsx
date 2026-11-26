import { useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";

export default function AdminReports() {
  const { orders } = useOrders();
  
  const exportCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Total", "Status"];
    const rows = orders.map(o => [o.id, new Date(o.createdAt).toLocaleDateString(), o.customer?.name, o.totals.total, o.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "freshcart_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("CSV Exported");
  };

  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.totals.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <button onClick={exportCSV} className="btn-primary">Export CSV</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><div className="text-muted text-sm">Total Revenue</div><div className="text-2xl font-extrabold">{formatINR(revenue)}</div></div>
        <div className="card p-5"><div className="text-muted text-sm">Total Orders</div><div className="text-2xl font-extrabold">{orders.length}</div></div>
        <div className="card p-5"><div className="text-muted text-sm">Avg. Order Value</div><div className="text-2xl font-extrabold">{formatINR(orders.length ? revenue / orders.length : 0)}</div></div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">{o.customer?.name}</td>
                <td className="px-4 py-3">{formatINR(o.totals.total)}</td>
                <td className="px-4 py-3"><span className="badge bg-primary-light text-primary">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}