import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Clock } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ProductCard from "../../components/product/ProductCard";

export default function Home() {
  const { products, categories } = useStore();
  const featured = products.filter(p => p.tags?.includes("featured")).slice(0, 8);
  const best = products.filter(p => p.tags?.includes("bestseller")).slice(0, 8);
  const essentials = products.filter(p => ["dairy-eggs", "atta-flour", "rice-grains"].includes(p.category)).slice(0, 8);
  const trending = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light via-mint to-white border border-green-100 p-6 md:p-12">
        <div className="max-w-xl space-y-4">
          <span className="badge bg-white text-primary border border-green-100"><Sparkles className="w-3 h-3" /> Fresh picks of the day</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Groceries delivered <span className="text-primary">fresh & fast</span>
          </h1>
          <p className="text-muted text-sm md:text-base">Farm-fresh fruits, dairy, staples and snacks — delivered to your door in minutes.</p>
          <div className="flex gap-3">
            <Link to="/shop" className="btn-primary">Shop now <ArrowRight className="inline w-4 h-4" /></Link>
            <Link to="/category/fruits" className="btn-ghost border border-primary/20">Explore fruits</Link>
          </div>
        </div>
        <div className="hidden md:flex absolute right-8 bottom-0 text-[160px] opacity-20 select-none">🥑</div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Shop by category</h2>
          <Link to="/shop" className="text-sm text-primary font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
          {categories.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className={`card p-3 text-center hover:shadow-card transition bg-gradient-to-br ${c.tint}`}>
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-1.5 text-xs font-semibold leading-tight">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <ProductRow title="Featured products" subtitle="Hand-picked for you" items={featured} />
      <ProductRow title="Best sellers" subtitle="Loved by our customers" items={best} />

      {/* Promo banner */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white p-8 relative overflow-hidden">
          <div className="text-2xl font-extrabold max-w-xs">Use code FRESH50 and save ₹50</div>
          <p className="opacity-80 text-sm mt-1">On orders above ₹499</p>
          <div className="text-6xl absolute -right-2 bottom-2 opacity-30">🥕</div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-accent to-orange-400 text-white p-8 relative overflow-hidden">
          <div className="text-2xl font-extrabold max-w-xs">Free delivery over ₹499</div>
          <p className="opacity-90 text-sm mt-1">No minimum on milk, eggs & bread</p>
          <div className="text-6xl absolute -right-2 bottom-2 opacity-30">🥛</div>
        </div>
      </section>

      <ProductRow title="Daily essentials" subtitle="Restock the basics" items={essentials} />
      <ProductRow title="Trending now" subtitle="Most popular this week" items={trending} />

      {/* Why choose */}
      <section className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Truck, t: "Fast delivery", d: "20–30 min in your area" },
          { icon: ShieldCheck, t: "Fresh guarantee", d: "Quality checked daily" },
          { icon: Clock, t: "Flexible slots", d: "Pick your time window" },
          { icon: Sparkles, t: "Best prices", d: "Unbeatable daily deals" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="card p-5">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
            <div className="font-semibold text-sm">{t}</div>
            <div className="text-xs text-muted">{d}</div>
          </div>
        ))}
      </section>

      {/* Newsletter */}
      <section className="card p-8 text-center bg-gradient-to-br from-primary-light to-mint border border-green-100">
        <h3 className="text-xl font-bold">Get weekly deals in your inbox</h3>
        <p className="text-muted text-sm mt-1">Subscribe for special offers and new arrivals.</p>
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-4" onSubmit={e => e.preventDefault()}>
          <input className="input" placeholder="you@example.com" />
          <button className="btn-primary">Subscribe</button>
        </form>
      </section>
    </div>
  );
}

function ProductRow({ title, subtitle, items }) {
  if (!items.length) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <Link to="/shop" className="text-sm text-primary font-semibold">View all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}