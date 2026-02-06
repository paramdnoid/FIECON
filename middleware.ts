import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";

const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "never",
  localeDetection: true,
});

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
