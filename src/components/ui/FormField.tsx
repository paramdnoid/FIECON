"use client";

import { forwardRef } from "react";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  id: string;
  multiline?: boolean;
  rows?: number;
  onChange: (value: string) => void;
};

const baseClasses =
  "w-full px-4 py-3 rounded-lg bg-beige-50 border text-text-primary placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:bg-white focus:border-bordeaux-700 focus:ring-2 focus:ring-bordeaux-700/10";

const errorClasses = "border-red-300 bg-red-50/30";
const normalClasses = "border-beige-200";

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>(
  (
    {
      label,
      placeholder,
      value,
      error,
      type = "text",
      id,
      multiline = false,
      rows = 5,
      onChange,
    },
    ref,
  ) => {
    const errorId = `${id}-error`;
    const className = `${baseClasses} ${error ? errorClasses : normalClasses}${multiline ? " resize-none" : ""}`;

    const sharedProps = {
      id,
      value,
      placeholder,
      "aria-invalid": !!error as boolean,
      "aria-describedby": error ? errorId : undefined,
      className,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => onChange(e.target.value),
    };

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-semibold tracking-[0.15em] uppercase text-text-muted mb-2"
        >
          {label}
        </label>
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            {...sharedProps}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            {...sharedProps}
          />
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormField.displayName = "FormField";
