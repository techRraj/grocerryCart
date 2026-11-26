import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";

const STEPS = ["Address", "Delivery", "Payment", "Review"];

export default function Checkout() {
  const cart = useCart();
  const orders = useOrders();
  const store = useStore();
  const { user } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: user?.name || "", phone: user?.phone || "", line1: "", area: "", city: "Mumbai", state: "Maharashtra", pin: "" });
  const [slot, setSlot] = useState("today-6-8");
  const [payment, setPayment] = useState("UPI");
  const [placing, setPlacing] = useState(false);

  if (cart.items.length === 0) {
    nav("/cart"); return null;
  }

  const validateAddr = () => {
    if (!addr.name || addr.name.length < 2) return "Enter your name";
    if (!/^[6-9]\d{9}$/.test(addr.phone.replace(/\D/g, "").slice(-10))) return "Enter valid 10-digit mobile";
    if (!addr.line1 || !addr.area) return "Enter full address";
    if (!/^\d{6}$/.test(addr.pin)) return "Enter valid 6-digit PIN";
    return null;
  };

  const next = () => {
    if (step === 0) { const e = validateAddr(); if (e) return toast.error(e); }
    setStep(s => Math.min(3, s + 1));
  };

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 600));
    const order = orders.placeOrder({
      customer: { name: addr.name, email: user?.email || `${addr.phone}@guest.demo`, phone: addr.phone },
      address: `${addr.line1}, ${addr.area}, ${addr.city}, ${addr.state} — ${addr.pin}`,
      slot,
      paymentMethod: payment,
      cart,
      totals: { total: cart.total },
    });
    cart.items.forEach(i => store.decrementStock(i.productId, i.variantId, i.qty));
    cart.clear();
    setPlacing(false);
    toast.success("Order placed successfully");
    nav(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? "bg-primary text-white" : "bg-gray-100 text-muted"}`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <div className={`text-xs ml-2 ${i <= step ? "text-ink font-semibold" : "text-muted"}`}>{s}</div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-primary" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="card p-5 space-y-4">
          {step === 0 && (
            <>
              <h2 className="font-bold">Delivery address</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="input" placeholder="Full name" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
                <input className="input" placeholder="Mobile number" value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="House / Flat / Building" value={addr.line1} onChange={e => setAddr({ ...addr, line1: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="Street / Area" value={addr.area} onChange={e => setAddr({ ...addr, area: e.target.value })} />
                <input className="input" placeholder="City" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
                <input className="input" placeholder="State" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} />
                <input className="input" placeholder="PIN code" value={addr.pin} onChange={e => setAddr({ ...addr, pin: e.target.value })} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-bold">Delivery slot</h2>
              {["today-6-8", "today-8-10", "tomorrow-8-10", "tomorrow-10-12"].map(s => (
                <label key={s} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${slot === s ? "border-primary bg-primary-light" : "border-gray-200"}`}>
                  <input type="radio" checked={slot === s} onChange={() => setSlot(s)} />
                  <span className="text-sm font-medium">{s.replace("-", " · ").replace("today", "Today").replace("tomorrow", "Tomorrow")}</span>
                </label>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-bold">Payment method (simulated)</h2>
              {[["UPI", "Demo UPI"], ["CARD", "Demo Card"], ["NETBANKING", "Demo Netbanking"], ["COD", "Cash on delivery"]].map(([v, l]) => (
                <label key={v} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${payment === v ? "border-primary bg-primary-light" : "border-gray-200"}`}>
                  <input type="radio" checked={payment === v} onChange={() => setPayment(v)} />
                  <span className="text-sm font-medium">{l}</span>
                </label>
              ))}
              <p className="text-xs text-muted">No real money is transferred. This is a demo prototype.</p>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-bold">Review & place order</h2>
              <div className="text-sm space-y-1">
                <div><b>Deliver to:</b> {addr.name}, {addr.line1}, {addr.area}, {addr.city} — {addr.pin}</div>
                <div><b>Slot:</b> {slot}</div>
                <div><b>Payment:</b> {payment}</div>
              </div>
              <div className="border-t pt-3 space-y-1.5 text-sm">
                {cart.items.map(i => (
                  <div key={`${i.productId}-${i.variantId}`} className="flex justify-between">
                    <span>{i.qty} × {i.product.name} ({i.variant.label})</span>
                    <span>{formatINR(i.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <button onClick={placeOrder} disabled={placing} className="btn-primary w-full">
                {placing ? "Placing order…" : `Place order · ${formatINR(cart.total)}`}
              </button>
            </>
          )}

          {step < 3 && (
            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} className="btn-ghost" disabled={step === 0}>Back</button>
              <button onClick={next} className="btn-primary">Continue</button>
            </div>
          )}
        </div>

        <div className="card p-4 h-fit space-y-2">
          <h3 className="font-bold">Summary</h3>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatINR(cart.subtotal)}</span></div>
          {cart.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Discount</span><span>− {formatINR(cart.discount)}</span></div>}
          <div className="flex justify-between text-sm"><span>Delivery</span><span>{cart.deliveryFee === 0 ? "FREE" : formatINR(cart.deliveryFee)}</span></div>
          <div className="flex justify-between text-sm"><span>GST</span><span>{formatINR(cart.tax)}</span></div>
          <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>{formatINR(cart.total)}</span></div>
        </div>
      </div>
    </div>
  );
}