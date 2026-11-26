import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const submit = (e) => {
    e.preventDefault();
    if (form.name.length < 2 || !form.email.includes("@") || form.password.length < 6) {
      return toast.error("Please fill all fields correctly (password ≥ 6 chars).");
    }
    toast.success("Account created (demo). Please sign in.");
    nav("/login");
  };
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <form onSubmit={submit} className="space-y-3 mt-4">
          <input className="input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Mobile" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary w-full">Create account</button>
        </form>
        <p className="text-xs text-muted text-center mt-4">Already registered? <Link to="/login" className="text-primary font-semibold">Sign in</Link></p>
      </div>
    </div>
  );
}