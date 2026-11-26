import { createContext, useContext, useEffect, useState } from "react";
import { ls } from "../utils/storage";
import { seedProducts } from "../data/products";
import { categories as seedCategories } from "../data/categories";
import { seedCoupons } from "../data/coupons";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => ls.get("fc_products", seedProducts));
  const [categories, setCategories] = useState(() => ls.get("fc_categories", seedCategories));
  const [coupons, setCoupons] = useState(() => ls.get("fc_coupons", seedCoupons));

  useEffect(() => { ls.set("fc_products", products); }, [products]);
  useEffect(() => { ls.set("fc_categories", categories); }, [categories]);
  useEffect(() => { ls.set("fc_coupons", coupons); }, [coupons]);

  const findProduct = (id) => products.find(p => p.id === id);
  const findVariant = (productId, variantId) => {
    const p = findProduct(productId);
    return p?.variants.find(v => v.id === variantId);
  };

  const upsertProduct = (product) => {
    setProducts(prev => {
      const i = prev.findIndex(p => p.id === product.id);
      if (i >= 0) { const next = [...prev]; next[i] = product; return next; }
      return [{ ...product, id: product.id || `p_${Date.now()}` }, ...prev];
    });
  };
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  const decrementStock = (productId, variantId, qty) => {
    setProducts(prev => prev.map(p => p.id !== productId ? p : {
      ...p,
      variants: p.variants.map(v => v.id !== variantId ? v : { ...v, stock: Math.max(0, v.stock - qty) }),
    }));
  };

  const findCoupon = (code) =>
    coupons.find(c => c.code.toLowerCase() === String(code).toLowerCase() && c.active);

  const upsertCoupon = (c) => setCoupons(prev => {
    const i = prev.findIndex(x => x.code === c.code);
    if (i >= 0) { const next = [...prev]; next[i] = c; return next; }
    return [c, ...prev];
  });
  const deleteCoupon = (code) => setCoupons(prev => prev.filter(x => x.code !== code));

  return (
    <Ctx.Provider value={{
      products, categories, coupons,
      findProduct, findVariant, upsertProduct, deleteProduct, decrementStock,
      findCoupon, upsertCoupon, deleteCoupon,
    }}>
      {children}
    </Ctx.Provider>
  );
}