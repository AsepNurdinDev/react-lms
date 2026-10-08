import { useRef } from "react";

function FileUpload({ label, accept, value, onChange, helper = "Pilih file dari perangkat kamu." }) {
  const inputRef = useRef(null);

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 2 MB untuk demo frontend ini.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ name: file.name, type: file.type, size: file.size, data: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{value?.name || "Belum ada file dipilih"}</p>
            <p className="mt-1 text-xs text-gray-500">{helper}</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Pilih File
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
