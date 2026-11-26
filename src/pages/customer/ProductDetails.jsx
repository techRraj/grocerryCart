import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Minus, Plus, Star, Truck, ShieldCheck, ChevronRight } from "lucide-react";
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
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return <div className="max-w-7xl mx-auto p-6">Product not found. <Link to="/shop" className="text-primary font-bold">Back to shop</Link></div>;

  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  const off = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);
  const wished = wish.has(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const images = product.images || [product.images?.[0] || ""];

  const addToCart = () => {
    if (variant.stock <= 0) return toast.error("Out of stock");
    cart.add(product.id, variant.id, qty);
    toast.success(`${qty} × ${product.name} added`);
  };
  const buyNow = () => { addToCart(); nav("/cart"); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-muted mb-4 font-medium">
        <Link to="/" className="hover:text-primary transition">Home</Link> 
        <ChevronRight className="w-3 h-3" />
        <Link to={`/category/${product.category}`} className="hover:text-primary transition">{product.category}</Link> 
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative shadow-soft">
            <img 
              src={images[activeImg]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {off > 0 && <span className="absolute top-4 left-4 bg-error text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">-{off}% OFF</span>}
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-3">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-primary shadow-sm" : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"}`}
              >
                <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-5">
          <div>
            <div className="text-sm font-bold text-primary tracking-wide uppercase">{product.brand} <span className="text-gray-300 mx-1">|</span> <span className="text-muted font-medium normal-case">SKU: {product.sku}</span></div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-1 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="badge bg-primary-light text-primary py-1"><Star className="w-3.5 h-3.5 fill-current" /> {product.rating}</span>
              <span className="text-muted underline cursor-pointer">{product.reviews} reviews</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-ink">{formatINR(variant.price)}</span>
              {variant.mrp > variant.price && <span className="text-lg text-muted line-through mb-1">{formatINR(variant.mrp)}</span>}
            </div>
            <div className="text-sm font-semibold text-success mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block"></span> In stock ({variant.stock} available)
            </div>
          </div>

          <p className="text-muted leading-relaxed">{product.description}</p>

          <div className="space-y-3 pt-2">
            <div className="text-sm font-bold text-ink">Select Size / Variant</div>
            <div className="flex flex-wrap gap-3">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${v.id === variantId ? "border-primary bg-primary-light text-primary" : "border-gray-200 hover:border-primary/40 text-muted"}`}
                >
                  {v.label} — {formatINR(v.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-3 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 text-muted hover:text-primary"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center font-extrabold text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-1 text-muted hover:text-primary"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={addToCart} className="btn-primary flex-1 py-3 text-lg">Add to cart</button>
          </div>
          
          <div className="flex gap-3">
            <button onClick={buyNow} className="btn-ghost flex-1 border-2 border-primary/20 bg-primary-light text-primary font-bold py-3">Buy Now</button>
            <button onClick={() => wish.toggle(product.id)} className={`p-3 rounded-xl border-2 transition-colors ${wished ? "border-error bg-red-50 text-error" : "border-gray-200 text-muted hover:border-error/40 hover:text-error"}`}>
              <Heart className={`w-6 h-6 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3"><Truck className="w-6 h-6 text-primary" /><div><div className="text-sm font-bold text-ink">Fast Delivery</div><div className="text-xs text-muted">In 20–30 mins</div></div></div>
            <div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-primary" /><div><div className="text-sm font-bold text-ink">Fresh Guarantee</div><div className="text-xs text-muted">Quality checked</div></div></div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-extrabold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}