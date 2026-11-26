import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/shop", icon: Search, label: "Shop" },
  { to: "/cart", icon: ShoppingBag, label: "Cart" },
  { to: "/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/account", icon: User, label: "Account" },
];

export default function BottomNav() {
  const loc = useLocation();
  const cart = useCart();
  const wish = useWishlist();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100">
      <div className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
          const badge = to === "/cart" ? cart.count : to === "/wishlist" ? wish.ids.length : 0;
          return (
            <Link key={to} to={to} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${active ? "text-primary" : "text-muted"}`}>
              <Icon className="w-5 h-5" />
              {badge > 0 && (
                <span className="absolute top-1 right-1/4 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{badge}</span>
              )}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}