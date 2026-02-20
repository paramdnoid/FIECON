"use client";

import { useState, useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(query: string): boolean {
  return window.matchMedia(query).matches;
}

const SERVER_SNAPSHOT = false;

export function useMediaQuery(query: string): boolean {
  const [q] = useState(query);

  return useSyncExternalStore(
    (cb) => subscribe(q, cb),
    () => getSnapshot(q),
    () => SERVER_SNAPSHOT,
  );
}
