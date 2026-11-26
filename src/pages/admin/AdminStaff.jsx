export default function AdminStaff() {
  const staff = [
    { name: "Admin User", email: "admin@freshcart.demo", role: "Administrator" },
    { name: "Delivery Manager", email: "delivery@freshcart.demo", role: "Delivery" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff & Roles</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th></tr></thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3"><span className="badge bg-primary-light text-primary">{s.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}