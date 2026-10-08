function EmptyState({ title, message, children }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default EmptyState;
