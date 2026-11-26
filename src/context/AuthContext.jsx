import { createContext, useContext, useEffect, useState } from "react";
import { ls } from "../utils/storage";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const DEMO = {
  "customer@freshcart.demo": { password: "Demo@123",    name: "Priya Sharma",    role: "customer",   phone: "+91 98765 11111" },
  "admin@freshcart.demo":    { password: "Admin@123",   name: "Admin User",      role: "admin",      phone: "+91 98111 22222" },
  "delivery@freshcart.demo": { password: "Delivery@123", name: "Delivery Manager", role: "delivery",  phone: "+91 98222 33333" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => ls.get("fc_user", null));
  useEffect(() => { user ? ls.set("fc_user", user) : ls.remove("fc_user"); }, [user]);

  const login = (email, password) => {
    const rec = DEMO[email.trim().toLowerCase()];
    if (!rec || rec.password !== password) return { ok: false, error: "Invalid credentials. Use a demo account." };
    const next = { email: email.trim().toLowerCase(), name: rec.name, role: rec.role, phone: rec.phone };
    setUser(next);
    return { ok: true, user: next };
  };
  const logout = () => setUser(null);
  const is = (role) => user?.role === role;

  return <Ctx.Provider value={{ user, login, logout, is }}>{children}</Ctx.Provider>;
}