export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-6">Privacy Policy</h1>
      <p className="text-muted mb-4">We value your privacy. This demo app does not send any data to external servers.</p>
      <h3 className="font-bold text-lg mt-6 mb-2">Data Storage</h3>
      <p className="text-sm text-muted mb-4">All personal details (address, name, phone) are stored purely in your browser's LocalStorage to simulate a login session.</p>
      <h3 className="font-bold text-lg mt-6 mb-2">Cookies</h3>
      <p className="text-sm text-muted mb-4">We use LocalStorage to remember your cart and wishlist, not traditional cookies.</p>
    </div>
  );
}