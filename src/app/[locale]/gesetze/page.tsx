import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GesetzeDocsLayout } from "@/components/sections/gesetze/docs/GesetzeDocsLayout";
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
      <GesetzeDocsLayout />
    </>
  );
}
