import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT } from "@/lib/constants";

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
            Telefon: {CONTACT.phone}
            <br />
            Mobil: {CONTACT.mobile}
            <br />
            E-Mail:{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-bordeaux-900 hover:text-bordeaux-700 transition-colors"
            >
              {CONTACT.email}
            </a>
            <br />
            Homepage: {COMPANY.website}
          </p>
        </div>
      </Container>
    </section>
  );
}
