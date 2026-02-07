export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip characters that could inject additional email headers (CRLF injection). */
export function sanitizeHeaderValue(str: string): string {
  return str.replace(/[\r\n\t]/g, "").trim();
}

import { HEADER_HEIGHT, SERVICES_SCROLL_OFFSET } from "./constants";

/** Scroll to a page section by its id, accounting for the fixed header. */
export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth",
): void {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const offset = sectionId === "services" ? SERVICES_SCROLL_OFFSET : HEADER_HEIGHT;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior });
}
