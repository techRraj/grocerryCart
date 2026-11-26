export const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
export const formatDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
export const cn = (...c) => c.filter(Boolean).join(" ");