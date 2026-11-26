import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-12 text-center">
      <div className="text-8xl">🥕</div>
      <h1 className="text-3xl font-extrabold mt-4">Page not found</h1>
      <p className="text-muted mt-1">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary inline-block mt-6">Back to home</Link>
    </div>
  );
}