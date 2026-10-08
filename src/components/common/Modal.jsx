// Modal muncul di tengah (desktop) atau dari bawah (mobile).
function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-lg sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} aria-label="Tutup" className="text-xl text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
