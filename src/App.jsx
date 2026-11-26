import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { OrderProvider } from "./context/OrderContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/customer/Home";
import Shop from "./pages/customer/Shop";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import TrackOrder from "./pages/customer/TrackOrder";
import Wishlist from "./pages/customer/Wishlist";
import Account from "./pages/customer/Account";
import NotFound from "./pages/customer/NotFound";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";
import Terms from "./pages/customer/Terms";
import Privacy from "./pages/customer/Privacy";
import Refund from "./pages/customer/Refund";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import VerifyEmail from "./pages/auth/VerifyEmail";

import AdminLogin from "./pages/admin/AdminLogin";
import Overview from "./pages/admin/Overview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminTracking from "./pages/admin/AdminTracking";
import AdminReports from "./pages/admin/AdminReports";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReviews from "./pages/admin/AdminReviews";

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <StoreProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster position="top-right" richColors closeButton />
                <Routes>
                  <Route element={<CustomerLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/search" element={<Shop />} />
                    <Route path="/category/:slug" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                    <Route path="/track-order/:id" element={<TrackOrder />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refund-policy" element={<Refund />} />
                  </Route>

                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Overview />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/coupons" element={<AdminCoupons />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/tracking" element={<AdminTracking />} />
                    
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/audit-logs" element={<AdminAudit />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/banners" element={<AdminBanners />} />
                    <Route path="/admin/staff" element={<AdminStaff />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </StoreProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}