import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "datenschutz" });

  return {
    title: `${t("title")} — ${COMPANY.name}`,
    description: t("intro"),
    alternates: { canonical: `/${locale}/datenschutz` },
  };
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "datenschutz" });

  return (
    <article className="pt-32 pb-24">
      <Container size="sm">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-12 gradient-text">
          {t("title")}
        </h1>

        <div className="prose prose-lg max-w-none text-text-muted space-y-6">
          <p className="text-lg">{t("intro")}</p>

          {/* 1. Verantwortliche Stelle */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_1_title")}
          </h2>
          <p>{t("section_1_text")}</p>
          <p>
            {COMPANY.fullName}
            <br />
            {CONTACT.address.street}
            <br />
            {CONTACT.address.zip} {CONTACT.address.city}
            <br />
            {t("email_label")}:{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-bordeaux-900 hover:text-bordeaux-700 transition-colors"
            >
              {CONTACT.email}
            </a>
          </p>

          {/* 2. Erhebung und Verarbeitung */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_2_title")}
          </h2>
          <p>{t("section_2_text")}</p>
          <p>{t("section_2_legal_basis")}</p>
          <p>{t("section_2_retention")}</p>

          {/* 3. Kontaktaufnahme */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_3_title")}
          </h2>
          <p>{t("section_3_text")}</p>
          <p>{t("section_3_legal_basis")}</p>
          <p>{t("section_3_retention")}</p>

          {/* 4. E-Mail-Versand */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_4_title")}
          </h2>
          <p>{t("section_4_text")}</p>

          {/* 5. Ihre Rechte */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_5_title")}
          </h2>
          <p>{t("section_5_text_1")}</p>
          <ul className="list-disc pl-6 space-y-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <li key={i}>{t(`section_5_rights_${i}`)}</li>
            ))}
          </ul>
          <p>{t("section_5_text_2")}</p>

          {/* 6. Cookies */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_6_title")}
          </h2>
          <p>{t("section_6_text")}</p>

          {/* 7. Aktualität */}
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_7_title")}
          </h2>
          <p>{t("section_7_text")}</p>
        </div>
      </Container>
    </article>
  );
}
