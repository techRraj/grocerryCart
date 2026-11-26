import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Clock, Star, ChevronRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/product/ProductCard";

export default function Home() {
  const { products, categories } = useStore();
  
  const featured = products.filter(p => p.tags?.includes("featured")).slice(0, 8);
  const best = products.filter(p => p.tags?.includes("bestseller")).slice(0, 8);
  const essentials = products.filter(p => ["dairy-eggs", "atta-flour", "rice-grains"].includes(p.category)).slice(0, 8);
  const trending = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative bg-[#EAF7EF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm border border-primary/10">
              <Sparkles className="w-4 h-4 fill-primary" /> Fresh picks delivered today
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-ink">
              Your daily groceries, <br />
              <span className="text-primary">delivered in minutes.</span>
            </h1>
            <p className="text-lg text-muted max-w-md leading-relaxed">
              Shop farm-fresh fruits, vegetables, dairy, and household essentials. Quality guaranteed, straight to your door.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link to="/shop" className="btn-primary flex items-center gap-2 px-8 py-3.5 text-lg shadow-lg hover:shadow-xl transition-all">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/category/fruits" className="bg-white text-ink border border-gray-200 hover:border-gray-300 font-bold rounded-xl px-8 py-3.5 flex items-center gap-2 transition">
                Explore Fruits
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4 text-sm font-medium text-muted">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="user" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="user" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+10k</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <div>Trusted by 10,000+ locals</div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[500px] hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" 
              alt="Fresh groceries" 
              className="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-2xl"
            />
            {/* Floating tags */}
            <div className="absolute top-8 -left-6 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Truck className="w-5 h-5" /></div>
              <div><div className="text-xs text-muted font-semibold">Delivery in</div><div className="font-bold text-ink">15-20 min</div></div>
            </div>
            <div className="absolute bottom-12 -right-4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500"><ShieldCheck className="w-5 h-5" /></div>
              <div><div className="text-xs text-muted font-semibold">100%</div><div className="font-bold text-ink">Fresh Produce</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        {/* CATEGORIES */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">Shop by Category</h2>
              <p className="text-muted text-sm mt-1">Everything you need, delivered fast.</p>
            </div>
            <Link to="/shop" className="text-sm font-bold text-primary hover:text-primary-dark transition flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {categories.map(c => (
              <Link key={c.id} to={`/category/${c.id}`} className="group flex flex-col items-center gap-3">
                <div className={`w-full aspect-square rounded-full overflow-hidden ${c.tint} shadow-sm border border-gray-100 group-hover:shadow-md transition-all group-hover:-translate-y-1 relative`}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-xs font-bold text-center leading-tight text-ink group-hover:text-primary transition-colors">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* PROMO BANNERS */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden relative min-h-[220px] flex items-center p-8 bg-gradient-to-r from-primary-dark to-primary text-white">
            <div className="relative z-10 w-2/3">
              <div className="text-xs font-bold tracking-wider uppercase mb-2 opacity-80">Limited Time</div>
              <div className="text-3xl font-extrabold mb-3 leading-tight">Save ₹50 on your <br/> first order</div>
              <p className="text-sm text-white/80 mb-5">Use code <b className="bg-white/20 px-2 py-0.5 rounded">FRESH50</b> at checkout.</p>
              <Link to="/shop" className="bg-white text-primary rounded-xl px-5 py-2.5 text-sm font-bold inline-block hover:bg-gray-50 transition">Shop Now</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-30 mix-blend-overlay" alt="promo" />
          </div>
          <div className="rounded-3xl overflow-hidden relative min-h-[220px] flex items-center p-8 bg-gradient-to-r from-orange-400 to-accent text-white">
            <div className="relative z-10 w-2/3">
              <div className="text-xs font-bold tracking-wider uppercase mb-2 opacity-80">Daily Essentials</div>
              <div className="text-3xl font-extrabold mb-3 leading-tight">Free delivery <br/> over ₹499</div>
              <p className="text-sm text-white/90 mb-5">Stock up on milk, bread & eggs.</p>
              <Link to="/category/dairy-eggs" className="bg-white text-accent rounded-xl px-5 py-2.5 text-sm font-bold inline-block hover:bg-gray-50 transition">Order Dairy</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-30 mix-blend-overlay" alt="promo" />
          </div>
        </section>

        {/* PRODUCT ROWS */}
        <ProductRow title="Featured Products" subtitle="Hand-picked just for you" items={featured} />
        <ProductRow title="Best Sellers" subtitle="Loved by 10,000+ customers" items={best} />
        <ProductRow title="Daily Essentials" subtitle="Restock your kitchen" items={essentials} />
        <ProductRow title="Trending Now" subtitle="Most popular this week" items={trending} />

        {/* WHY CHOOSE US */}
        <section className="bg-mint rounded-3xl p-8 md:p-12 border border-primary-light">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-ink">Why choose FreshCart?</h2>
            <p className="text-muted mt-2">We do groceries differently.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Truck, t: "Fast Delivery", d: "Get your groceries in 15-20 minutes flat." },
              { icon: ShieldCheck, t: "Farm Fresh", d: "Sourced directly from local farmers daily." },
              { icon: Clock, t: "Flexible Slots", d: "Choose a delivery window that suits you." },
              { icon: Sparkles, t: "Best Prices", d: "Unbeatable daily deals and discounts." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-primary shadow-sm flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
                <div className="font-bold text-ink mb-2">{t}</div>
                <div className="text-sm text-muted leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductRow({ title, subtitle, items }) {
  if (!items.length) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">{title}</h2>
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
        <Link to="/shop" className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition">
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}