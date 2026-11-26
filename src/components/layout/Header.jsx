import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, MapPin } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import CartDrawer from "../cart/CartDrawer";

export default function Header() {
  const cart = useCart();
  const wish = useWishlist();
  const { user } = useAuth();
  const { products } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const sug = q.length >= 1
    ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setShowSug(false);
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 md:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">F</div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline">FreshCart</span>
          </Link>

          <div className="relative flex-1 max-w-xl">
            <form onSubmit={submit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowSug(true); }}
                onFocus={() => setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 150)}
                placeholder="Search for mangoes, milk, atta…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-mint border border-transparent focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </form>
            {showSug && sug.length > 0 && (
              <div className="absolute mt-1 w-full bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden z-50">
                {sug.map(p => (
                  <button
                    key={p.id}
                    onMouseDown={() => { setShowSug(false); nav(`/product/${p.id}`); }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-mint text-left text-sm"
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-muted text-xs">{p.brand}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button className="hidden md:flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-mint text-sm text-muted">
              <MapPin className="w-4 h-4" /> <span>Mumbai 400001</span>
            </button>
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-mint">
              <Heart className="w-5 h-5" />
              {wish.ids.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wish.ids.length}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg hover:bg-mint">
              <ShoppingBag className="w-5 h-5" />
              {cart.count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.count}
                </span>
              )}
            </button>
            <Link to={user ? "/account" : "/login"} className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-mint text-sm font-medium">
              <User className="w-4 h-4" /> {user ? user.name.split(" ")[0] : "Login"}
            </Link>
          </div>
        </div>

        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm font-medium text-muted overflow-x-auto">
            <NavLink to="/shop" className="hover:text-primary whitespace-nowrap">All Products</NavLink>
            <NavLink to="/category/fruits" className="hover:text-primary whitespace-nowrap">Fruits</NavLink>
            <NavLink to="/category/vegetables" className="hover:text-primary whitespace-nowrap">Vegetables</NavLink>
            <NavLink to="/category/dairy-eggs" className="hover:text-primary whitespace-nowrap">Dairy & Eggs</NavLink>
            <NavLink to="/category/snacks" className="hover:text-primary whitespace-nowrap">Snacks</NavLink>
            <NavLink to="/category/beverages" className="hover:text-primary whitespace-nowrap">Beverages</NavLink>
            <NavLink to="/category/household" className="hover:text-primary whitespace-nowrap">Household</NavLink>
            <span className="ml-auto text-primary font-semibold whitespace-nowrap">Delivery in 20–30 min</span>
          </div>
        </nav>
      </header>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}