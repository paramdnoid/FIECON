import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="pt-32 pb-24 min-h-[60vh] flex items-center">
      <Container size="sm">
        <p className="text-7xl font-display font-semibold gradient-text mb-6">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-text-muted mb-8">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-bordeaux-900 text-white text-sm font-medium rounded-lg hover:bg-bordeaux-700 transition-colors"
        >
          {t("back")}
        </Link>
      </Container>
    </section>
  );
}
