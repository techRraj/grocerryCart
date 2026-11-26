import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">F</div>
            <span className="font-extrabold">FreshCart</span>
          </div>
          <p className="text-muted">Premium grocery delivery for modern Indian homes. Fresh produce, fast delivery.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-muted">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/category/fruits" className="hover:text-primary">Fruits</Link></li>
            <li><Link to="/category/vegetables" className="hover:text-primary">Vegetables</Link></li>
            <li><Link to="/category/dairy-eggs" className="hover:text-primary">Dairy & Eggs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-muted">
            <li><Link to="/account" className="hover:text-primary">My Account</Link></li>
            <li><Link to="/account" className="hover:text-primary">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-muted">
            <li>support@freshcart.demo</li>
            <li>+91 90000 12345</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted">
          <span>© {new Date().getFullYear()} FreshCart. Demo prototype — not a real store.</span>
          <span>All payments & GPS are simulated.</span>
        </div>
      </div>
    </footer>
  );
}