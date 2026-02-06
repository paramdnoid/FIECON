import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT } from "@/lib/constants";

export default function DatenschutzPage() {
  const t = useTranslations("datenschutz");

  return (
    <section className="pt-32 pb-24">
      <Container size="sm">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-12 gradient-text">
          {t("title")}
        </h1>

        <div className="prose prose-lg max-w-none text-text-muted space-y-6">
          <p className="text-lg">{t("intro")}</p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_1_title")}
          </h2>
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

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_2_title")}
          </h2>
          <p>{t("section_2_text")}</p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_3_title")}
          </h2>
          <p>{t("section_3_text")}</p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            {t("section_4_title")}
          </h2>
          <p>{t("section_4_text_1")}</p>
          <p>{t("section_4_text_2")}</p>
        </div>
      </Container>
    </section>
  );
}
