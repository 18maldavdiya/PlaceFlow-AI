import { useEffect, useState } from "react";

/**
 * Debounce a fast-changing value (typically search input) so dependent
 * effects — API calls, filtering — only run `delay` ms after the user stops
 * typing.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
