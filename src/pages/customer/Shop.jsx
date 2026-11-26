import { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, Search, X, LayoutGrid, List, ChevronRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/common/EmptyState";

export default function Shop() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const { products, categories } = useStore();

  // Filter States
  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState(slug || "");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Sync category if URL slug changes (e.g., clicking from Header)
  useEffect(() => {
    setCat(slug || "");
  }, [slug]);

  // Sync search query if URL search changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Extract unique brands
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products]);
  
  // Active category object (for breadcrumb/title)
  const activeCategoryObj = categories.find(c => c.id === cat);
  const activeCat = cat; 

  // Filtering & Sorting Logic
  const filtered = useMemo(() => {
    let list = products.slice();
    
    if (activeCat) list = list.filter(p => p.category === activeCat);
    
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    
    if (brand) list = list.filter(p => p.brand === brand);
    list = list.filter(p => p.variants[0].price <= maxPrice);
    if (inStockOnly) list = list.filter(p => p.available && p.variants.some(v => v.stock > 0));
    
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.variants[0].price - b.variants[0].price); break;
      case "price-desc": list.sort((a, b) => b.variants[0].price - a.variants[0].price); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.popularity - a.popularity); // popularity
    }
    return list;
  }, [products, activeCat, query, brand, sort, maxPrice, inStockOnly]);

  const clearFilters = () => {
    setCat(""); setBrand(""); setMaxPrice(1000); setInStockOnly(false); setQuery(""); setSort("popularity");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-muted mb-4 font-medium capitalize">
        <Link to="/" className="hover:text-primary transition">Home</Link> 
        <ChevronRight className="w-3 h-3" />
        {activeCategoryObj ? (
          <>
            <Link to="/shop" className="hover:text-primary transition">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink">{activeCategoryObj.name}</span>
          </>
        ) : (
          <span className="text-ink">All Products</span>
        )}
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">
            {activeCategoryObj ? activeCategoryObj.name : query ? `Search: "${query}"` : "All Products"}
          </h1>
          <p className="text-muted text-sm mt-1">
            Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search products..." 
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm" 
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            className="py-2 px-3 rounded-xl bg-white border border-gray-200 focus:border-primary/50 focus:outline-none text-sm shadow-sm font-medium"
          >
            <option value="popularity">Sort by: Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>

          {/* View Toggle (Desktop) */}
          <div className="hidden md:flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-light text-primary' : 'text-muted hover:bg-gray-50'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-light text-primary' : 'text-muted hover:bg-gray-50'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-2 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft sticky top-32 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
                Clear all
              </button>
            </div>

            {/* Category */}
            <div>
              <div className="text-sm font-bold text-ink mb-3">Category</div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input type="radio" name="cat" checked={cat === ""} onChange={() => setCat("")} className="accent-primary" />
                  All Categories
                </label>
                {categories.map(c => (
                  <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                    <input type="radio" name="cat" checked={cat === c.id} onChange={() => setCat(c.id)} className="accent-primary" />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div>
              <div className="text-sm font-bold text-ink mb-3">Brand</div>
              <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none">
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-ink">Max Price</div>
                <div className="text-sm font-bold text-primary">₹{maxPrice}</div>
              </div>
              <input 
                type="range" min={20} max={1000} step={10} 
                value={maxPrice} 
                onChange={e => setMaxPrice(+e.target.value)} 
                className="w-full accent-primary" 
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>₹20</span><span>₹1000+</span></div>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-primary rounded" /> 
                In Stock Only
              </label>
            </div>
            
            {/* Apply button for mobile */}
            <div className="md:hidden pt-2">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">Show Results</button>
            </div>
          </div>
        </aside>

        {/* Product Grid / List */}
        <div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft">
              <EmptyState 
                icon={Search} 
                title="No products found" 
                description="Try adjusting your filters or search terms to find what you're looking for." 
                action={<button onClick={clearFilters} className="btn-primary mt-2">Clear Filters</button>}
              />
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filtered.slice(0, pageSize).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.slice(0, pageSize).map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-card transition">
                      <div className="w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="text-xs text-muted uppercase tracking-wider font-semibold">{p.brand}</div>
                        <Link to={`/product/${p.id}`} className="text-lg font-bold text-ink hover:text-primary transition">{p.name}</Link>
                        <p className="text-sm text-muted mt-1 line-clamp-2">{p.description}</p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-extrabold text-ink">₹{p.variants[0].price}</span>
                            {p.variants[0].mrp > p.variants[0].price && <span className="text-sm text-muted line-through ml-2">₹{p.variants[0].mrp}</span>}
                          </div>
                          <Link to={`/product/${p.id}`} className="btn-primary py-2 px-6">View Product</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {filtered.length > pageSize && (
                <div className="text-center mt-10">
                  <button 
                    onClick={() => setPageSize(pageSize + 12)} 
                    className="bg-white border border-gray-200 text-ink font-bold rounded-xl px-8 py-3 hover:border-primary hover:text-primary transition shadow-sm"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}