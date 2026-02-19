import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { COMPANY, CONTACT, TEAM_MEMBERS } from "@/lib/constants";
import { TeamProfileHero } from "@/components/sections/team/TeamProfileHero";
import { TeamProfileBio } from "@/components/sections/team/TeamProfileBio";
import { TeamProfileCompetencies } from "@/components/sections/team/TeamProfileCompetencies";
import { TeamProfileQuote } from "@/components/sections/team/TeamProfileQuote";
import { TeamProfileCta } from "@/components/sections/team/TeamProfileCta";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { CompetencyIcons } from "./competency-icons";

const MEMBER = TEAM_MEMBERS[0];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: MEMBER.translationKey,
  });

  const title = `${t("meta_title")} — ${COMPANY.name}`;
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/team/${MEMBER.slug}` },
    openGraph: {
      title,
      description,
      url: `/${locale}/team/${MEMBER.slug}`,
      type: "profile",
      siteName: COMPANY.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PeterFieglerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: MEMBER.translationKey });
  const tTeam = await getTranslations({ locale, namespace: "team" });

  const headerStore = await headers();
  const nonce = headerStore.get("x-nonce") ?? undefined;

  const competencies = [
    {
      id: "corporate-law",
      title: t("competency_1_title"),
      description: t("competency_1_description"),
      icon: CompetencyIcons.corporateLaw,
    },
    {
      id: "international",
      title: t("competency_2_title"),
      description: t("competency_2_description"),
      icon: CompetencyIcons.international,
    },
    {
      id: "finance",
      title: t("competency_3_title"),
      description: t("competency_3_description"),
      icon: CompetencyIcons.finance,
    },
    {
      id: "strategy",
      title: t("competency_4_title"),
      description: t("competency_4_description"),
      icon: CompetencyIcons.strategy,
    },
  ];

  return (
    <>
      {/* Person structured data */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: MEMBER.name,
            jobTitle: t("hero_role"),
            description: t("meta_description"),
            image: `https://${COMPANY.website}${MEMBER.imageSrc}`,
            url: `https://${COMPANY.website}/${locale}/team/${MEMBER.slug}`,
            worksFor: {
              "@type": "Organization",
              name: COMPANY.fullName,
              url: `https://${COMPANY.website}`,
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: CONTACT.address.street,
              postalCode: CONTACT.address.zip,
              addressLocality: CONTACT.address.city,
              addressCountry: "DE",
            },
            knowsLanguage: ["de", "en", "sr"],
          }),
        }}
      />

      <TeamProfileHero
        name={t("hero_name")}
        role={t("hero_role")}
        tagline={t("hero_tagline")}
        imageSrc={MEMBER.imageSrc}
        imageAlt={MEMBER.name}
        breadcrumbs={[
          { label: tTeam("breadcrumb_home"), href: `/${locale}` },
          { label: MEMBER.name },
        ]}
      />

      <TeamProfileBio
        badge={t("bio_badge")}
        paragraphs={[t("bio_1"), t("bio_2"), t("bio_3")]}
        imageSrc={MEMBER.imageSrc}
        imageAlt={MEMBER.name}
        imagePosition="left"
      />

      <SectionDivider variant="diamond" />

      <TeamProfileCompetencies
        headline={tTeam("competencies_headline")}
        competencies={competencies}
      />

      <SectionDivider variant="dots" />

      <TeamProfileQuote
        quote={t("quote")}
        attribution={t("quote_attribution")}
        imageSrc={MEMBER.imageSrc}
        imageAlt={MEMBER.name}
      />

      <TeamProfileCta
        headline={tTeam("cta_headline")}
        subline={tTeam("cta_subline")}
        ctaLabel={tTeam("cta_button")}
      />
    </>
  );
}
