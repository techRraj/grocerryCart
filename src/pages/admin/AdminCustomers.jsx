import { useOrders } from "../../context/OrderContext";
import { formatINR } from "../../utils/format";

export default function AdminCustomers() {
  const { orders } = useOrders();
  const map = {};
  orders.forEach(o => {
    const key = o.customer?.email || o.customer?.name;
    if (!map[key]) map[key] = { ...o.customer, orders: 0, total: 0 };
    map[key].orders += 1;
    map[key].total += o.totals.total;
  });
  const list = Object.values(map);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Orders</th><th className="px-3 py-2">Lifetime value</th></tr></thead>
          <tbody>
            {list.map((c, k) => (
              <tr key={k} className="border-t border-gray-100">
                <td className="px-3 py-2 font-semibold">{c.name}</td>
                <td className="px-3 py-2 text-muted">{c.email}</td>
                <td className="px-3 py-2">{c.orders}</td>
                <td className="px-3 py-2 font-bold">{formatINR(c.total)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}