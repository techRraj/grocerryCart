import { createContext, useContext, useEffect, useState } from "react";
import { ls } from "../utils/storage";

const Ctx = createContext(null);
export const useWishlist = () => useContext(Ctx);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => ls.get("fc_wishlist", []));
  useEffect(() => { ls.set("fc_wishlist", ids); }, [ids]);

  const has = (id) => ids.includes(id);
  const toggle = (id) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const remove = (id) => setIds(prev => prev.filter(x => x !== id));

  return <Ctx.Provider value={{ ids, has, toggle, remove }}>{children}</Ctx.Provider>;
}