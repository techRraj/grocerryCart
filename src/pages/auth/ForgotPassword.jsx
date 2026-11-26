import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    toast.success("Demo reset link sent! (Check console)");
    console.log("Mock reset link: /verify-otp?email=" + email);
    nav("/verify-otp");
  };
  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="card p-6 text-center">
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="text-muted text-sm mt-1 mb-4">Enter your email and we'll send a demo OTP.</p>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn-primary w-full">Send Reset Link</button>
        </form>
        <Link to="/login" className="text-sm text-primary font-semibold mt-4 inline-block">Back to login</Link>
      </div>
    </div>
  );
}