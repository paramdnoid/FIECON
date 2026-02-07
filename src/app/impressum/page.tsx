import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "impressum" });

  return {
    title: `${t("title")} — ${COMPANY.name}`,
    description: `${t("info_title")} — ${COMPANY.fullName}`,
  };
}

export default function ImpressumPage() {
  const t = useTranslations("impressum");

  return (
    <section className="pt-32 pb-24">
      <Container size="sm">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-12 gradient-text">
          {t("title")}
        </h1>

        <div className="prose prose-lg max-w-none text-text-muted">
          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("info_title")}
          </h2>
          <p>
            {COMPANY.fullName}
            <br />
            {COMPANY.subtitle}
          </p>
          <p>
            {CONTACT.address.street}
            <br />
            {CONTACT.address.zip} {CONTACT.address.city}
            <br />
            {CONTACT.address.country}
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("contact_title")}
          </h2>
          <p>
            {t("phone_label")}: {CONTACT.phone}
            <br />
            {t("mobile_label")}: {CONTACT.mobile}
            <br />
            {t("email_label")}:{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-bordeaux-900 hover:text-bordeaux-700 transition-colors"
            >
              {CONTACT.email}
            </a>
            <br />
            {t("homepage_label")}: {COMPANY.website}
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("responsible_title")}
          </h2>
          <p>
            {t("responsible_name")}
            <br />
            {CONTACT.address.street}
            <br />
            {CONTACT.address.zip} {CONTACT.address.city}
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-10 mb-4">
            {t("disclaimer_title")}
          </h2>

          <h3 className="font-display text-lg font-semibold text-text-primary mt-6 mb-3">
            {t("disclaimer_content_title")}
          </h3>
          <p>{t("disclaimer_content_text")}</p>

          <h3 className="font-display text-lg font-semibold text-text-primary mt-6 mb-3">
            {t("disclaimer_links_title")}
          </h3>
          <p>{t("disclaimer_links_text")}</p>

          <h3 className="font-display text-lg font-semibold text-text-primary mt-6 mb-3">
            {t("copyright_title")}
          </h3>
          <p>{t("copyright_text")}</p>
        </div>
      </Container>
    </section>
  );
}
