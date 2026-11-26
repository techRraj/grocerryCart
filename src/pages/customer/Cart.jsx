import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Trash2, Ticket, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/format";
import EmptyState from "../../components/common/EmptyState";
import { toast } from "sonner";

export default function Cart() {
  const cart = useCart();
  const nav = useNavigate();
  const [code, setCode] = useState("");

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add fresh groceries to get started."
          action={<Link to="/shop" className="btn-primary">Start shopping</Link>}
        />
      </div>
    );
  }

  const applyCoupon = (e) => {
    e.preventDefault();
    const res = cart.applyCoupon(code);
    if (res.ok) toast.success(`Coupon ${res.coupon.code} applied`);
    else toast.error(res.error);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold mb-2">Shopping cart</h1>
        {cart.items.map(i => (
          <div key={`${i.productId}-${i.variantId}`} className="card p-3 flex items-center gap-3">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${i.product.tint} flex items-center justify-center text-3xl shrink-0`}>{i.product.emoji}</div>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${i.productId}`} className="font-semibold text-sm hover:text-primary">{i.product.name}</Link>
              <div className="text-xs text-muted">{i.variant.label} · {i.product.brand}</div>
              <div className="text-sm font-bold mt-0.5">{formatINR(i.variant.price)}</div>
            </div>
            <div className="flex items-center gap-1 bg-mint rounded-lg">
              <button onClick={() => cart.updateQty(i.productId, i.variantId, i.qty - 1)} className="p-1.5"><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-sm font-bold w-5 text-center">{i.qty}</span>
              <button onClick={() => cart.updateQty(i.productId, i.variantId, i.qty + 1)} className="p-1.5"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={() => cart.remove(i.productId, i.variantId)} className="p-2 text-muted hover:text-error"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="card p-4 h-fit md:sticky md:top-32 space-y-3">
        <h2 className="font-bold">Order summary</h2>
        <form onSubmit={applyCoupon} className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Coupon code" className="input" />
          <button className="btn-primary whitespace-nowrap"><Ticket className="w-4 h-4 inline" /></button>
        </form>
        {cart.coupon && (
          <div className="flex items-center justify-between text-xs bg-primary-light text-primary rounded-lg px-2 py-1.5">
            <span>{cart.coupon.code} applied</span>
            <button onClick={cart.clearCoupon}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
          {cart.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>− {formatINR(cart.discount)}</span></div>}
          <div className="flex justify-between"><span>Delivery</span><span>{cart.deliveryFee === 0 ? "FREE" : formatINR(cart.deliveryFee)}</span></div>
          <div className="flex justify-between"><span>GST (5%)</span><span>{formatINR(cart.tax)}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatINR(cart.total)}</span></div>
        </div>
        <button onClick={() => nav("/checkout")} className="btn-primary w-full">Checkout</button>
        <Link to="/shop" className="block text-center text-sm text-primary font-semibold">Continue shopping</Link>
      </div>
    </div>
  );
}