export default function Refund() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Refund & Cancellation Policy</h1>
      <h3 className="font-bold text-lg mt-6 mb-2">Demo Orders</h3>
      <p className="text-sm text-muted mb-4">Since no real money is transferred, refunds are also simulated. Admin can trigger a "Refund Initiated" status on demo orders.</p>
      <h3 className="font-bold text-lg mt-6 mb-2">Cancellations</h3>
      <p className="text-sm text-muted mb-4">Orders can be cancelled by the admin from the dashboard. The customer will immediately see the updated status.</p>
    </div>
  );
}