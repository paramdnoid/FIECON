type LogLevel = "info" | "warn" | "error" | "debug";

type LogMeta = Record<string, unknown>;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function formatEntry(level: LogLevel, message: string, meta?: LogMeta): string {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  if (isProduction()) {
    return JSON.stringify(entry);
  }
  return `${entry.timestamp} [${level.toUpperCase()}] ${message}${
    meta && Object.keys(meta).length > 0 ? " " + JSON.stringify(meta) : ""
  }`;
}

function captureSentryError(meta?: LogMeta): void {
  const err = meta?.error;
  if (err instanceof Error) {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.captureException(err);
    });
  }
}

function write(level: LogLevel, message: string, meta?: LogMeta): void {
  const out = formatEntry(level, message, meta);
  if (level === "error") {
    captureSentryError(meta);
    // eslint-disable-next-line no-console
    console.error(out);
  } else if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(out);
  } else {
    // eslint-disable-next-line no-console
    console.log(out);
  }
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    write("info", message, meta);
  },
  warn(message: string, meta?: LogMeta): void {
    write("warn", message, meta);
  },
  error(message: string, meta?: LogMeta): void {
    write("error", message, meta);
  },
  debug(message: string, meta?: LogMeta): void {
    if (!isProduction()) {
      write("debug", message, meta);
    }
  },
};
