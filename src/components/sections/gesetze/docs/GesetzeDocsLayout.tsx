"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { GesetzeDocsContent } from "./GesetzeDocsContent";
import { GesetzeDocsToc } from "./GesetzeDocsToc";
import { GESETZE_DOCS_LAWS } from "./gesetze-docs.config";
import { useGesetzeScrollSpy } from "./useGesetzeScrollSpy";

export function GesetzeDocsLayout() {
  const t = useTranslations("gesetze_page");
  const activeSection = useGesetzeScrollSpy();

  return (
    <>
      {/* Hero */}
      <section
        id="overview"
        tabIndex={-1}
        className="relative overflow-hidden bg-beige-50 pt-32 pb-12 scroll-mt-28 outline-hidden focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 sm:pt-40 sm:pb-16"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-display text-[24rem] leading-none text-bordeaux-900 opacity-[0.012] sm:text-[32rem] lg:block"
        >
          §
        </span>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent"
        />

        <Container size="lg">
          <nav aria-label={t("breadcrumb_current")} className="mb-10">
            <ol className="flex items-center gap-2 text-sm text-text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  {t("breadcrumb_home")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-beige-400">
                /
              </li>
              <li>
                <span aria-current="page" className="font-medium text-text-primary">
                  {t("breadcrumb_current")}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <span className="inline-block text-sm font-medium uppercase tracking-[0.4em] text-accent">
                {t("hero_badge")}
              </span>
              <div aria-hidden="true" className="my-5 h-px w-10 bg-accent/40" />
              <h1 className="gradient-text font-display text-4xl font-light italic tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {t("hero_headline")}
              </h1>
            </div>

            <div className="lg:col-span-7 lg:pt-4">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-text-muted">{t("hero_intro_1")}</p>
                <p className="text-lg leading-relaxed text-text-muted">{t("hero_intro_2")}</p>
              </div>
            </div>
          </div>

          <section aria-label={t("hero_headline")} className="mt-10 sm:mt-12">
            <div className="flex flex-wrap gap-2.5">
              {GESETZE_DOCS_LAWS.map((law) => (
                <a
                  key={law.id}
                  href={`#${law.id}`}
                  className="rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20 transition-shadow duration-300 hover:shadow-[0_4px_20px_-6px_rgba(98,25,28,0.10)]"
                >
                  <span className="inline-flex items-center rounded-xl bg-beige-50/80 px-4 py-2 text-sm font-medium text-accent transition-colors duration-300 hover:bg-white">
                    {t(`hero_chip_${law.id}`)}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </Container>
      </section>

      {/* Content + right sidebar */}
      <section className="relative bg-white pt-6 pb-16 sm:pt-10 sm:pb-24">
        <Container size="lg">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <main className="min-w-0 flex-1">
              <div className="mb-10 lg:hidden">
                <GesetzeDocsToc activeSection={activeSection} mobile />
              </div>
              <GesetzeDocsContent />
            </main>

            <aside className="hidden shrink-0 lg:block lg:w-60 xl:w-64">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <GesetzeDocsToc activeSection={activeSection} />
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
