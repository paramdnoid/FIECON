import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tServices = useTranslations("services");
  const tOffices = useTranslations("offices");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bordeaux-900 text-beige-200 pt-20 pb-8">
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-display text-2xl font-bold text-white tracking-tight block mb-4">
              FIECON
            </span>
            <p className="text-beige-400 text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("services_title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {tServices("consulting.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {tServices("finance.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {tServices("construction.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {tServices("yacht.title")}
                </a>
              </li>
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("offices_title")}
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-beige-400">
                {tOffices("hamburg.city")}, {tOffices("hamburg.country")}
              </li>
              <li className="text-sm text-beige-400">
                {tOffices("belgrade.city")}, {tOffices("belgrade.country")}
              </li>
              <li className="text-sm text-beige-400">
                {tOffices("texas.city")}, {tOffices("texas.country")}
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("legal_title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/impressum" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {t("impressum")}
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {t("datenschutz")}
                </a>
              </li>
            </ul>
            <div className="mt-6 text-sm text-beige-400">
              <p>{CONTACT.email}</p>
              <p className="mt-1">{CONTACT.phone}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-beige-400/60">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-xs text-beige-400/60">{COMPANY.website}</p>
        </div>
      </Container>
    </footer>
  );
}
