function Input({ label, error, as: Field = "input", children, ...props }) {
  return (
    <div className="mb-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
        <Field
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...props}
        >
          {children}
        </Field>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
