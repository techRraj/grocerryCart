import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div className="card p-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Email Verified</h1>
        <p className="text-muted text-sm mt-1 mb-6">Your account is secure. You can now log in.</p>
        <Link to="/login" className="btn-primary w-full block">Back to Login</Link>
      </div>
    </div>
  );
}