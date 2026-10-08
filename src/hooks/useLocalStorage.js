import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    function syncValue(event) {
      if (event.key !== key) return;
      try {
        setValue(event.detail);
      } catch {
        // Abaikan data localStorage yang tidak valid.
      }
    }
    window.addEventListener("lms-storage-change", syncValue);
    return () => window.removeEventListener("lms-storage-change", syncValue);
  }, [key]);

  function setStoredValue(nextValue) {
    setValue((currentValue) => {
      const resolvedValue = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolvedValue));
        window.dispatchEvent(new CustomEvent("lms-storage-change", { detail: resolvedValue, key }));
      } catch (error) {
        console.error(`Gagal menyimpan ${key} ke localStorage.`, error);
      }
      return resolvedValue;
    });
  }

  return [value, setStoredValue];
}

export default useLocalStorage;
