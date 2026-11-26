import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { formatINR } from "../../utils/format";
import { toast } from "sonner";

const blank = () => ({
  id: "", name: "", brand: "", category: "fruits", emoji: "🍎",
  tint: "from-primary-light to-mint", sku: "", description: "",
  variants: [{ id: "v1", label: "500 g", mrp: 100, price: 80, stock: 20 }],
  rating: 4.5, reviews: 0, tags: [], available: true, popularity: 50, createdAt: new Date().toISOString().slice(0,10),
});

export default function AdminProducts() {
  const { products, upsertProduct, deleteProduct, categories } = useStore();
  const [edit, setEdit] = useState(null);

  const save = () => {
    if (!edit.name || !edit.brand || !edit.sku) return toast.error("Fill name, brand, SKU");
    upsertProduct(edit);
    toast.success("Product saved");
    setEdit(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setEdit(blank())} className="btn-primary"><Plus className="inline w-4 h-4 mr-1" /> Add product</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted">
            <tr><th className="px-3 py-2">Product</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Price</th><th className="px-3 py-2">Stock</th><th className="px-3 py-2"></th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-3 py-2 flex items-center gap-2"><span className="text-xl">{p.emoji}</span><div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted">{p.sku}</div></div></td>
                <td className="px-3 py-2 text-muted">{categories.find(c => c.id === p.category)?.name}</td>
                <td className="px-3 py-2">{formatINR(p.variants[0].price)}</td>
                <td className="px-3 py-2">{p.variants[0].stock}</td>
                <td className="px-3 py-2 flex gap-1">
                  <button onClick={() => setEdit(p)} className="p-1.5 hover:bg-mint rounded"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm("Delete product?")) { deleteProduct(p.id); toast.success("Deleted"); } }} className="p-1.5 hover:bg-mint rounded text-error"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-3">{edit.id ? "Edit product" : "New product"}</h2>
            <div className="grid grid-cols-2 gap-2">
              <input className="input col-span-2" placeholder="Name" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} />
              <input className="input" placeholder="Brand" value={edit.brand} onChange={e => setEdit({ ...edit, brand: e.target.value })} />
              <input className="input" placeholder="SKU" value={edit.sku} onChange={e => setEdit({ ...edit, sku: e.target.value })} />
              <select className="input" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input className="input" placeholder="Emoji" value={edit.emoji} onChange={e => setEdit({ ...edit, emoji: e.target.value })} />
              <input className="input" placeholder="MRP" type="number" value={edit.variants[0].mrp} onChange={e => setEdit({ ...edit, variants: [{ ...edit.variants[0], mrp: +e.target.value }] })} />
              <input className="input" placeholder="Price" type="number" value={edit.variants[0].price} onChange={e => setEdit({ ...edit, variants: [{ ...edit.variants[0], price: +e.target.value }] })} />
              <input className="input" placeholder="Label" value={edit.variants[0].label} onChange={e => setEdit({ ...edit, variants: [{ ...edit.variants[0], label: e.target.value }] })} />
              <input className="input" placeholder="Stock" type="number" value={edit.variants[0].stock} onChange={e => setEdit({ ...edit, variants: [{ ...edit.variants[0], stock: +e.target.value }] })} />
              <textarea className="input col-span-2" rows={2} placeholder="Description" value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEdit(null)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}