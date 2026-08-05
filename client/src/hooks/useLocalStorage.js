import { useCallback, useEffect, useState } from "react";

/**
 * Sync a piece of state with localStorage, including across browser tabs
 * via the `storage` event. `key` should come from a constants file rather
 * than being inlined at each call site.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        }
        return nextValue;
      });
    },
    [key],
  );

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) setStoredValue(readValue());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
