import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BASE_URL, COMPANY, CONTACT, TEAM_MEMBERS } from "@/lib/constants";
import { TeamProfileHero } from "@/components/sections/team/TeamProfileHero";
import { TeamProfileBio } from "@/components/sections/team/TeamProfileBio";
import { TeamProfileCompetencies } from "@/components/sections/team/TeamProfileCompetencies";
import { TeamProfileQuote } from "@/components/sections/team/TeamProfileQuote";
import { TeamProfileCta } from "@/components/sections/team/TeamProfileCta";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { TEAM_PAGE_CONFIG } from "../team-config";
import { COMPETENCY_ICONS } from "../competency-icons";

export function generateStaticParams() {
  return Object.keys(TEAM_PAGE_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const config = TEAM_PAGE_CONFIG[slug];
  if (!config) return {};

  const member = TEAM_MEMBERS[config.memberIndex];
  const t = await getTranslations({ locale, namespace: member.translationKey });

  const title = `${t("meta_title")} — ${COMPANY.name}`;
  const description = t("meta_description");

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/team/${member.slug}` },
    openGraph: {
      title,
      description,
      url: `/${locale}/team/${member.slug}`,
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

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const config = TEAM_PAGE_CONFIG[slug];
  if (!config) notFound();

  setRequestLocale(locale);

  const member = TEAM_MEMBERS[config.memberIndex];
  const icons = COMPETENCY_ICONS[slug];
  const t = await getTranslations({ locale, namespace: member.translationKey });
  const tTeam = await getTranslations({ locale, namespace: "team" });

  const headerStore = await headers();
  const nonce = headerStore.get("x-nonce") ?? undefined;

  const competencies = config.competencies.map((c, i) => ({
    id: c.id,
    title: t(`competency_${i + 1}_title`),
    description: t(`competency_${i + 1}_description`),
    icon: icons[c.iconKey],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: member.name,
            jobTitle: t("hero_role"),
            description: t("meta_description"),
            image: `https://${COMPANY.website}${member.imageSrc}`,
            url: `https://${COMPANY.website}/${locale}/team/${member.slug}`,
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
            knowsLanguage: config.languages,
          }),
        }}
      />

      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: tTeam("breadcrumb_home"),
                item: `${BASE_URL}/${locale}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: member.name,
                item: `${BASE_URL}/${locale}/team/${member.slug}`,
              },
            ],
          }),
        }}
      />

      <TeamProfileHero
        name={t("hero_name")}
        role={t("hero_role")}
        tagline={t("hero_tagline")}
        imageSrc={member.imageSrc}
        imageAlt={member.name}
        breadcrumbs={[
          { label: tTeam("breadcrumb_home"), href: `/${locale}` },
          { label: member.name },
        ]}
      />

      <TeamProfileBio
        badge={t("bio_badge")}
        paragraphs={[t("bio_1"), t("bio_2"), t("bio_3")]}
        imageSrc={member.imageSrc}
        imageAlt={member.name}
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
        imageSrc={member.imageSrc}
        imageAlt={member.name}
      />

      <TeamProfileCta
        headline={tTeam("cta_headline")}
        subline={tTeam("cta_subline")}
        ctaLabel={tTeam("cta_button")}
      />
    </>
  );
}
