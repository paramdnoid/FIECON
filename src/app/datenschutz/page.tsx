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
            1. Verantwortliche Stelle
          </h2>
          <p>
            {COMPANY.fullName}
            <br />
            {CONTACT.address.street}
            <br />
            {CONTACT.address.zip} {CONTACT.address.city}
            <br />
            E-Mail:{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-bordeaux-900 hover:text-bordeaux-700 transition-colors"
            >
              {CONTACT.email}
            </a>
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            2. Erhebung und Verarbeitung personenbezogener Daten
          </h2>
          <p>
            Beim Besuch unserer Website werden automatisch Informationen
            allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles)
            beinhalten etwa die Art des Webbrowsers, das verwendete
            Betriebssystem, den Domainnamen Ihres Internet-Service-Providers und
            ähnliches. Hierbei handelt es sich ausschließlich um Informationen,
            welche keine Rückschlüsse auf Ihre Person zulassen.
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            3. Kontaktaufnahme
          </h2>
          <p>
            Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben
            einschließlich der von Ihnen dort angegebenen Kontaktdaten zwecks
            Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
            gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung
            weiter.
          </p>

          <h2 className="font-display text-xl font-semibold text-text-primary mt-8 mb-4">
            4. Ihre Rechte
          </h2>
          <p>
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
            und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung,
            Sperrung oder Löschung dieser Daten.
          </p>
          <p>
            Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten
            können Sie sich jederzeit über die im Impressum angegebenen
            Kontaktdaten an uns wenden.
          </p>
        </div>
      </Container>
    </section>
  );
}
