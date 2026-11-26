import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Minus, Plus, Star, Truck, ShieldCheck } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";
import ProductCard from "../../components/product/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { products, findProduct } = useStore();
  const cart = useCart();
  const wish = useWishlist();
  const product = findProduct(id);
  const [variantId, setVariantId] = useState(product?.variants?.[0]?.id);
  const [qty, setQty] = useState(1);

  if (!product) return <div className="max-w-7xl mx-auto p-6">Product not found. <Link to="/shop" className="text-primary">Back to shop</Link></div>;

  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  const off = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);
  const wished = wish.has(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const addToCart = () => {
    if (variant.stock <= 0) return toast.error("Out of stock");
    cart.add(product.id, variant.id, qty);
    toast.success(`${qty} × ${product.name} added`);
  };
  const buyNow = () => { addToCart(); nav("/cart"); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> / <Link to={`/category/${product.category}`} className="hover:text-primary">{product.category}</Link> / <span>{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className={`aspect-square rounded-3xl bg-gradient-to-br ${product.tint} flex items-center justify-center relative`}>
          <span className="text-[140px]">{product.emoji}</span>
          {off > 0 && <span className="absolute top-4 left-4 bg-error text-white text-xs font-bold px-2 py-1 rounded">-{off}%</span>}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted">{product.brand} · SKU {product.sku}</div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span className="badge bg-primary-light text-primary"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>
              <span className="text-muted">{product.reviews} reviews</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatINR(variant.price)}</span>
            {variant.mrp > variant.price && <span className="text-muted line-through">{formatINR(variant.mrp)}</span>}
            <span className="text-sm font-semibold text-success">In stock ({variant.stock})</span>
          </div>

          <p className="text-sm text-muted">{product.description}</p>

          <div>
            <div className="text-xs font-semibold text-muted mb-2">Choose variant</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${v.id === variantId ? "border-primary bg-primary-light text-primary" : "border-gray-200 hover:border-primary/40"}`}
                >
                  {v.label} — {formatINR(v.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-mint rounded-xl px-2 py-1.5">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1"><Minus className="w-4 h-4" /></button>
              <span className="w-6 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-1"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={addToCart} className="btn-primary flex-1">Add to cart</button>
            <button onClick={buyNow} className="btn-ghost border border-primary/30 flex-1">Buy now</button>
            <button onClick={() => wish.toggle(product.id)} className={`p-3 rounded-xl border ${wished ? "border-error text-error" : "border-gray-200 text-muted"}`}>
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="card p-3 flex items-center gap-2 text-sm"><Truck className="w-5 h-5 text-primary" /> Delivery in 20–30 min</div>
            <div className="card p-3 flex items-center gap-2 text-sm"><ShieldCheck className="w-5 h-5 text-primary" /> Freshness guarantee</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}