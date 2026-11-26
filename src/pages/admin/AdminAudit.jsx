export default function AdminAudit() {
  const logs = [
    { id: 1, action: "Admin logged in", time: "Just now", user: "admin@freshcart.demo" },
    { id: 2, action: "Product updated (p01)", time: "10 mins ago", user: "admin@freshcart.demo" },
    { id: 3, action: "Order FC123456 marked delivered", time: "1 hour ago", user: "delivery@freshcart.demo" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-mint text-left text-xs text-muted"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Action</th></tr></thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-muted">{l.time}</td>
                <td className="px-4 py-3">{l.user}</td>
                <td className="px-4 py-3 font-medium">{l.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}