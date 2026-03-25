import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FourPointPlanDetail } from "@/components/sections/FourPointPlanDetail";
import { COMPANY, isFourPointPlanLocale } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isFourPointPlanLocale(locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "fourPointPlan.detail" });

  return {
    title: `${t("meta_title")} — ${COMPANY.name}`,
    description: t("meta_description"),
    alternates: { canonical: `/${locale}/four-point-plan` },
    openGraph: {
      title: `${t("meta_title")} — ${COMPANY.name}`,
      description: t("meta_description"),
      url: `/${locale}/four-point-plan`,
    },
  };
}

export default async function FourPointPlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isFourPointPlanLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  await getTranslations({ locale, namespace: "fourPointPlan.detail" });

  return <FourPointPlanDetail />;
}
