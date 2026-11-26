import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ls } from "../utils/storage";
import { useStore } from "./StoreContext";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 499;
const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const store = useStore();
  const [items, setItems] = useState(() => ls.get("fc_cart", []));
  const [coupon, setCoupon] = useState(() => ls.get("fc_coupon", null));

  useEffect(() => { ls.set("fc_cart", items); }, [items]);
  useEffect(() => { coupon ? ls.set("fc_coupon", coupon) : ls.remove("fc_coupon"); }, [coupon]);

  const add = (productId, variantId, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.productId === productId && x.variantId === variantId);
      if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + qty }; return next; }
      return [...prev, { productId, variantId, qty }];
    });
  };
  const remove = (productId, variantId) =>
    setItems(prev => prev.filter(x => !(x.productId === productId && x.variantId === variantId)));
  const updateQty = (productId, variantId, qty) => {
    if (qty <= 0) return remove(productId, variantId);
    setItems(prev => prev.map(x =>
      (x.productId === productId && x.variantId === variantId) ? { ...x, qty } : x));
  };
  const clear = () => { setItems([]); setCoupon(null); };

  const enriched = useMemo(() => items.map(it => {
    const product = store.findProduct(it.productId);
    const variant = product?.variants.find(v => v.id === it.variantId);
    if (!product || !variant) return null;
    return { ...it, product, variant, lineTotal: variant.price * it.qty };
  }).filter(Boolean), [items, store.products]);

  const count = enriched.reduce((s, i) => s + i.qty, 0);
  const subtotal = enriched.reduce((s, i) => s + i.lineTotal, 0);

  let discount = 0;
  if (coupon && subtotal >= (coupon.minCart || 0)) {
    discount = coupon.type === "percent"
      ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.maxDiscount || Infinity)
      : Math.min(coupon.value, coupon.maxDiscount || Infinity);
  }
  const deliveryFee = enriched.length === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);

  const applyCoupon = (code) => {
    const c = store.findCoupon(code);
    if (!c) return { ok: false, error: "Invalid or expired coupon code." };
    if (subtotal < (c.minCart || 0)) return { ok: false, error: `Minimum cart ₹${c.minCart} required.` };
    setCoupon(c);
    return { ok: true, coupon: c };
  };

  return (
    <Ctx.Provider value={{
      items: enriched, count, subtotal, discount, deliveryFee, tax, total,
      coupon, applyCoupon, clearCoupon: () => setCoupon(null),
      add, remove, updateQty, clear,
      constants: { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, TAX_RATE },
    }}>
      {children}
    </Ctx.Provider>
  );
}