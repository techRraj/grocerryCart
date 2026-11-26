import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { formatINR } from "../../utils/format";

export default function OrderConfirmation() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return <div className="max-w-3xl mx-auto p-6">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold">Order confirmed!</h1>
      <p className="text-muted mt-1">Your order <b>{order.id}</b> has been received.</p>

      <div className="card p-5 mt-6 text-left space-y-2">
        <div className="flex justify-between text-sm"><span className="text-muted">Payment</span><span>{order.paymentMethod} · {order.paymentStatus}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Slot</span><span>{order.slot}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Total</span><span className="font-bold">{formatINR(order.totals.total)}</span></div>
        <div className="border-t pt-2 space-y-1 text-sm">
          {order.items.map((i, k) => (
            <div key={k} className="flex justify-between"><span>{i.qty} × {i.name}</span><span>{formatINR(i.lineTotal)}</span></div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center mt-6">
        <Link to={`/track-order/${order.id}`} className="btn-primary">Track order</Link>
        <Link to="/account" className="btn-ghost border border-gray-200">My orders</Link>
      </div>
    </div>
  );
}