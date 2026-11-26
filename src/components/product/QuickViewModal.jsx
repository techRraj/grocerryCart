import { X, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";

export default function QuickViewModal({ product, onClose }) {
  const cart = useCart();
  const wish = useWishlist();
  const [variantId, setVariantId] = useState(product?.variants[0]?.id || "");
  
  if (!product) return null;
  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  const wished = wish.has(product.id);

  const handleAdd = () => {
    cart.add(product.id, variant.id, 1);
    toast.success(`${product.name} added`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-gray-100 z-10"><X className="w-5 h-5" /></button>
        
        <div className={`md:w-1/2 aspect-square md:aspect-auto bg-gradient-to-br ${product.tint} flex items-center justify-center`}>
          <span className="text-[120px]">{product.emoji}</span>
        </div>
        
        <div className="p-6 md:w-1/2 flex flex-col">
          <div className="text-xs text-muted mb-1">{product.brand}</div>
          <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="badge bg-primary-light text-primary">★ {product.rating}</span>
            <span className="text-xs text-muted">{product.reviews} reviews</span>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-2xl font-extrabold text-primary">{formatINR(variant.price)}</span>
            {variant.mrp > variant.price && <span className="text-sm text-muted line-through">{formatINR(variant.mrp)}</span>}
          </div>

          <p className="text-sm text-muted mt-3 line-clamp-3">{product.description}</p>

          <div className="mt-4">
            <div className="text-xs font-semibold text-muted mb-2">Select Size</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button key={v.id} onClick={() => setVariantId(v.id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${v.id === variantId ? "border-primary bg-primary-light text-primary" : "border-gray-200 hover:border-primary/50"}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={handleAdd} className="btn-primary flex-1 flex justify-center items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => wish.toggle(product.id)} className={`p-3 rounded-xl border ${wished ? "border-error text-error" : "border-gray-200 text-muted"}`}>
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}