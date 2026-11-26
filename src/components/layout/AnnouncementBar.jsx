export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
        <span className="hidden sm:inline">🚚 Free delivery on orders above ₹499</span>
        <span className="sm:hidden">🚚 Free delivery above ₹499</span>
        <span className="hidden md:inline opacity-70">·</span>
        <span className="hidden md:inline">Use code <b>FRESH50</b> for ₹50 off</span>
      </div>
    </div>
  );
}