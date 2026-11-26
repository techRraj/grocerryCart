export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-4">About FreshCart</h1>
      <p className="text-muted mb-4">FreshCart is a premium grocery delivery platform built for the modern Indian home. We source the freshest produce directly from farms and deliver it to your doorstep in minutes.</p>
      <p className="text-muted mb-4">This is a demonstration prototype showcasing a complete e-commerce flow including real-time simulated tracking, admin inventory management, and a seamless checkout experience.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="card p-5"><h3 className="font-bold text-lg">Our Mission</h3><p className="text-sm text-muted mt-2">To make healthy, fresh food accessible to everyone with zero hassle.</p></div>
        <div className="card p-5"><h3 className="font-bold text-lg">Our Vision</h3><p className="text-sm text-muted mt-2">To be India's most loved grocery brand, known for quality and speed.</p></div>
      </div>
    </div>
  );
}