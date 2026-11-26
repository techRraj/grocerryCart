export default function AdminReviews() {
  const reviews = [
    { id: 1, product: "Alphonso Mango", user: "Priya", rating: 5, text: "Super fresh!" },
    { id: 2, product: "Full Cream Milk", user: "Rahul", rating: 4, text: "Good quality." },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reviews</h1>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{r.product}</div>
                <div className="text-xs text-muted">by {r.user}</div>
              </div>
              <div className="text-accent">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
            </div>
            <p className="text-sm mt-2">"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}