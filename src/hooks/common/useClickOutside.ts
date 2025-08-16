import { useEffect, useRef, RefObject } from "react";

/**
 * Hook para detectar clicks fuera de un elemento
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  handler: () => void,
  enabled: boolean = true
): RefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler, enabled]);

  return ref;
};
