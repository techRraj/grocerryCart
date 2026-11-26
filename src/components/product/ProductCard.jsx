import { Link, useNavigate } from "react-router-dom";
import { Heart, Plus, Minus, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const cart = useCart();
  const wish = useWishlist();
  const nav = useNavigate();
  const variant = product.variants[0];
  const price = variant.price;
  const mrp = variant.mrp;
  const off = Math.round(((mrp - price) / mrp) * 100);
  const inCart = cart.items.find(i => i.productId === product.id && i.variantId === variant.id);
  const wished = wish.has(product.id);
  const outOfStock = !product.available || variant.stock <= 0;

  const addToCart = (e) => {
    e?.preventDefault();
    if (outOfStock) return;
    cart.add(product.id, variant.id, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group card overflow-hidden hover:shadow-card transition">
      <Link to={`/product/${product.id}`} className="block">
        <div className={`relative aspect-square bg-gradient-to-br ${product.tint || "from-primary-light to-mint"} flex items-center justify-center`}>
          <span className="text-6xl group-hover:scale-105 transition-transform">{product.emoji}</span>
          {off > 0 && <span className="absolute top-2 left-2 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{off}%</span>}
          {product.tags?.includes("bestseller") && <span className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">BEST</span>}
          <button
            onClick={(e) => { e.preventDefault(); wish.toggle(product.id); }}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center ${wished ? "text-error" : "text-muted"}`}
            aria-label="wishlist"
          >
            <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="p-3">
          <div className="text-[11px] text-muted">{product.brand}</div>
          <div className="font-semibold text-sm truncate">{product.name}</div>
          <div className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
            <Star className="w-3 h-3 fill-accent text-accent" /> {product.rating} · {variant.label}
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3 flex items-end justify-between gap-2">
        <div>
          <div className="font-bold text-sm">{formatINR(price)}</div>
          {mrp > price && <div className="text-[11px] text-muted line-through">{formatINR(mrp)}</div>}
        </div>
        {inCart ? (
          <div className="flex items-center gap-1 bg-primary text-white rounded-lg">
            <button onClick={() => cart.updateQty(product.id, variant.id, inCart.qty - 1)} className="p-1.5"><Minus className="w-3.5 h-3.5" /></button>
            <span className="text-xs font-bold w-4 text-center">{inCart.qty}</span>
            <button onClick={() => cart.updateQty(product.id, variant.id, inCart.qty + 1)} className="p-1.5"><Plus className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <button
            onClick={addToCart}
            disabled={outOfStock}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold disabled:opacity-40"
          >
            {outOfStock ? "Out" : "Add"}
          </button>
        )}
      </div>
    </div>
  );
}