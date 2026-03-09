"use client";

import { lazy, Suspense, useCallback, useMemo, useState } from "react";

const ContactDialog = lazy(() =>
  import("@/components/ui/ContactDialog").then((m) => ({
    default: m.ContactDialog,
  })),
);

export function useContactDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const dialogNode = useMemo(() => {
    if (!isOpen) return null;
    return (
      <Suspense>
        <ContactDialog open={isOpen} onClose={closeDialog} />
      </Suspense>
    );
  }, [closeDialog, isOpen]);

  return { isOpen, openDialog, closeDialog, dialogNode };
}
