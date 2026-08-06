import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently most visible in the
 * viewport, for highlighting the matching navbar link — used by
 * components/landing/Navbar.jsx against the landing page's section ids.
 */
export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
    // `ids` is reduced to a stable primitive key on purpose — the array
    // literal passed in from the caller isn't referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return activeId;
}

export default useScrollSpy;
