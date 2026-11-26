import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ls } from "../utils/storage";

const Ctx = createContext(null);
export const useNotifications = () => useContext(Ctx);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(() => ls.get("fc_notifs", []));
  useEffect(() => { ls.set("fc_notifs", items); }, [items]);

  const push = useCallback((n) => {
    setItems(prev => [{
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(), read: false, audience: "all",
      ...n,
    }, ...prev].slice(0, 100));
  }, []);

  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clear = () => setItems([]);

  return <Ctx.Provider value={{ items, push, markRead, clear }}>{children}</Ctx.Provider>;
}