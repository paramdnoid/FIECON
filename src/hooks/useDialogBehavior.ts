import { useEffect, type RefObject } from "react";

/**
 * Consolidates the three common dialog effects:
 * 1. Body scroll lock while open
 * 2. Escape key to close
 * 3. Focus a ref after 150ms when opened
 */
export function useDialogBehavior(
  open: boolean,
  onClose: () => void,
  focusRef: RefObject<HTMLElement | null>,
): void {
  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus ref on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => focusRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open, focusRef]);
}
