import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { GesetzeHero } from "@/components/sections/gesetze/GesetzeHero";
import { GesetzeDetail } from "@/components/sections/gesetze/GesetzeDetail";
import { GesetzeCtaSection } from "@/components/sections/gesetze/GesetzeCtaSection";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gesetze_page" });

  return {
    title: `${t("meta_title")} — ${COMPANY.name}`,
    description: t("meta_description"),
    alternates: { canonical: `/${locale}/gesetze` },
    openGraph: {
      title: `${t("meta_title")} — ${COMPANY.name}`,
      description: t("meta_description"),
      url: `/${locale}/gesetze`,
    },
  };
}

export default async function GesetzePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <GesetzeHero />
      <SectionDivider variant="diamond" />
      <GesetzeDetail lawKey="kwg" index={0} />
      <SectionDivider variant="line" />
      <GesetzeDetail lawKey="vag" index={1} />
      <SectionDivider variant="line" />
      <GesetzeDetail lawKey="estg" index={2} />
      <SectionDivider variant="diamond" />
      <GesetzeCtaSection />
    </>
  );
}
