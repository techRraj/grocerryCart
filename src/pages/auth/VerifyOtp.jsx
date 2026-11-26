import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyOtp() {
  const nav = useNavigate();
  const [otp, setOtp] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      toast.success("OTP Verified! Set new password.");
      nav("/verify-email");
    } else {
      toast.error("Invalid OTP. Use 123456");
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="card p-6 text-center">
        <h1 className="text-2xl font-bold">Enter OTP</h1>
        <p className="text-muted text-sm mt-1 mb-2">We sent a code to your email.</p>
        <p className="text-xs font-bold text-accent bg-orange-50 py-1 rounded mb-4">Demo OTP: 123456</p>
        <form onSubmit={submit} className="space-y-3">
          <input className="input text-center tracking-[1em] font-bold text-lg" maxLength={6} placeholder="••••••" value={otp} onChange={e => setOtp(e.target.value)} />
          <button className="btn-primary w-full">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}