import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/common/EmptyState";

export default function Wishlist() {
  const wish = useWishlist();
  const { products } = useStore();
  const items = products.filter(p => wish.ids.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save products you love for later." action={<Link to="/shop" className="btn-primary">Browse products</Link>} />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}