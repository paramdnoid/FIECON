import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!_next|api|team|logo\\.svg|favicon|apple-touch|og-image|icon\\.svg|robots\\.txt|sitemap\\.xml).*)"],
};
