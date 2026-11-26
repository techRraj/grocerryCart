import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/common/EmptyState";

export default function Shop() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const { products, categories } = useStore();

  const [query, setQuery] = useState(q);
  const [cat, setCat] = useState(slug || "");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(12);

  const brands = useMemo(() => [...new Set(products.map(p => p.brand))], [products]);
  const activeCat = cat || slug;

  const filtered = useMemo(() => {
    let list = products.slice();
    if (activeCat) list = list.filter(p => p.category === activeCat);
    if (query) list = list.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
    );
    if (brand) list = list.filter(p => p.brand === brand);
    list = list.filter(p => p.variants[0].price <= maxPrice);
    if (inStockOnly) list = list.filter(p => p.available && p.variants.some(v => v.stock > 0));
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.variants[0].price - b.variants[0].price); break;
      case "price-desc": list.sort((a, b) => b.variants[0].price - a.variants[0].price); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [products, activeCat, query, brand, sort, maxPrice, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold">
            {activeCat ? categories.find(c => c.id === activeCat)?.name || "Products" : "All Products"}
          </h1>
          <p className="text-muted text-sm">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input pl-9" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-2.5 rounded-xl border border-gray-200 bg-white">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="card p-4 space-y-4 sticky top-32">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button
                className="text-xs text-muted hover:text-primary"
                onClick={() => { setCat(""); setBrand(""); setMaxPrice(1000); setInStockOnly(false); setQuery(""); }}
              >
                Clear <X className="inline w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1.5">Category</div>
              <select value={activeCat} onChange={e => setCat(e.target.value)} className="input">
                <option value="">All categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1.5">Brand</div>
              <select value={brand} onChange={e => setBrand(e.target.value)} className="input">
                <option value="">All brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1.5">Max price: ₹{maxPrice}</div>
              <input type="range" min={20} max={1000} step={10} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> In stock only
            </label>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No products found" description="Try adjusting filters or search terms." />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.slice(0, pageSize).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {filtered.length > pageSize && (
                <div className="text-center mt-6">
                  <button onClick={() => setPageSize(pageSize + 12)} className="btn-ghost border border-gray-200">Load more</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}