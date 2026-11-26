export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}