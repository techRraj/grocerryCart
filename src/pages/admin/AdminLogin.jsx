import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@freshcart.demo");
  const [password, setPassword] = useState("Admin@123");
  const submit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) return toast.error(res.error);
    if (res.user.role !== "admin" && res.user.role !== "delivery") return toast.error("This account does not have admin access.");
    toast.success("Welcome to admin console");
    nav("/admin");
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary-light to-mint">
      <div className="w-full max-w-md card p-8">
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl mb-4">F</div>
        <h1 className="text-2xl font-bold">FreshCart Admin</h1>
        <p className="text-muted text-sm mt-1">Demo admin credentials pre-filled below.</p>
        <form onSubmit={submit} className="space-y-3 mt-5">
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin email" />
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button className="btn-primary w-full">Sign in</button>
        </form>
        <p className="text-xs text-muted text-center mt-4">admin@freshcart.demo / Admin@123</p>
      </div>
    </div>
  );
}