import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("customer@freshcart.demo");
  const [password, setPassword] = useState("Demo@123");

  const submit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Welcome, ${res.user.name}`);
    nav(res.user.role === "admin" ? "/admin" : "/");
  };

  const demo = (role) => {
    const map = {
      customer: ["customer@freshcart.demo", "Demo@123"],
      admin: ["admin@freshcart.demo", "Admin@123"],
      delivery: ["delivery@freshcart.demo", "Delivery@123"],
    };
    const [em, pw] = map[role];
    const res = login(em, pw);
    if (res.ok) { toast.success(`Logged in as ${role}`); nav(role === "customer" ? "/" : "/admin"); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted text-sm mt-1">Sign in to your FreshCart account</p>
        <form onSubmit={submit} className="space-y-3 mt-4">
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn-primary w-full">Sign in</button>
        </form>
        <div className="mt-4 text-xs text-muted text-center">Demo accounts</div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button onClick={() => demo("customer")} className="btn-ghost border border-gray-200 text-xs">Customer</button>
          <button onClick={() => demo("admin")} className="btn-ghost border border-gray-200 text-xs">Admin</button>
          <button onClick={() => demo("delivery")} className="btn-ghost border border-gray-200 text-xs">Delivery</button>
        </div>
        <p className="text-xs text-muted text-center mt-4">New here? <Link to="/register" className="text-primary font-semibold">Create an account</Link></p>
      </div>
    </div>
  );
}