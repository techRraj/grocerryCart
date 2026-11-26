import { useStore } from "../../context/StoreContext";
export default function AdminInventory() {
  const { products, upsertProduct } = useStore();
  const lowStock = products.filter(p => p.variants.some(v => v.stock < 10));

  const addStock = (p, vid, amt) => {
    upsertProduct({
      ...p,
      variants: p.variants.map(v => v.id === vid ? { ...v, stock: Math.max(0, v.stock + amt) } : v),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-4"><div className="text-xs text-muted">SKUs</div><div className="text-2xl font-extrabold">{products.length}</div></div>
        <div className="card p-4"><div className="text-xs text-muted">Low stock</div><div className="text-2xl font-extrabold text-warning">{lowStock.length}</div></div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted">
            <tr><th className="px-3 py-2">Product</th><th className="px-3 py-2">Variant</th><th className="px-3 py-2">Stock</th><th className="px-3 py-2">Adjust</th></tr>
          </thead>
          <tbody>
            {products.flatMap(p => p.variants.map(v => (
              <tr key={`${p.id}-${v.id}`} className="border-t border-gray-100">
                <td className="px-3 py-2 flex items-center gap-2"><span className="text-lg">{p.emoji}</span>{p.name}</td>
                <td className="px-3 py-2 text-muted">{v.label}</td>
                <td className={`px-3 py-2 font-bold ${v.stock < 10 ? "text-warning" : ""}`}>{v.stock}</td>
                <td className="px-3 py-2 space-x-1">
                  <button onClick={() => addStock(p, v.id, -5)} className="px-2 py-1 border rounded text-xs">−5</button>
                  <button onClick={() => addStock(p, v.id, 5)} className="px-2 py-1 border rounded text-xs">+5</button>
                  <button onClick={() => addStock(p, v.id, 25)} className="px-2 py-1 border rounded text-xs">+25</button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}