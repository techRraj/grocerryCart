import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/format";

export default function CartDrawer({ isOpen, onClose }) {
  const cart = useCart();
  const nav = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your Cart ({cart.count})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center text-muted mt-10">Your cart is empty.</div>
          ) : cart.items.map(i => (
            <div key={`${i.productId}-${i.variantId}`} className="flex gap-3">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${i.product.tint} flex items-center justify-center text-3xl shrink-0`}>{i.product.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{i.product.name}</div>
                <div className="text-xs text-muted">{i.variant.label}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="font-bold text-sm">{formatINR(i.variant.price * i.qty)}</div>
                  <div className="flex items-center gap-2 bg-mint rounded-lg px-2 py-0.5 text-xs font-bold">
                    <button onClick={() => cart.updateQty(i.productId, i.variantId, i.qty - 1)}>−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => cart.updateQty(i.productId, i.variantId, i.qty + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Subtotal</span><span>{formatINR(cart.subtotal)}</span>
            </div>
            <button onClick={() => { onClose(); nav("/checkout"); }} className="btn-primary w-full flex justify-center items-center gap-2">
              Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => { onClose(); nav("/cart"); }} className="w-full text-center text-sm font-semibold text-primary mt-3 hover:underline">
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}