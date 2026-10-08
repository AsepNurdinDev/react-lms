import { useState } from "react";

// Hook sederhana: state biasa yang nilainya juga disimpan di localStorage.
// Dipakai seperti useState: const [nilai, setNilai] = useLocalStorage("kunci", nilaiAwal)
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setStoredValue(newValue) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, setStoredValue];
}

export default useLocalStorage;
