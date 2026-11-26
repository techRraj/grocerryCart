import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent (demo)");
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 text-center">Contact Us</h1>
      <p className="text-muted text-center mb-8">We usually reply within 24 hours.</p>
      {submitted ? (
        <div className="card p-8 text-center bg-primary-light border-primary/20">
          <h3 className="font-bold text-lg text-primary">Thank you!</h3>
          <p className="text-sm mt-1">Your demo message has been received.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" placeholder="Your Name" required />
            <input className="input" type="email" placeholder="Your Email" required />
          </div>
          <input className="input" placeholder="Subject" required />
          <textarea className="input" rows={4} placeholder="How can we help?" required></textarea>
          <button className="btn-primary w-full">Send Message</button>
        </form>
      )}
    </div>
  );
}