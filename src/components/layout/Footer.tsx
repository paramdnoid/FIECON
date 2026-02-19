"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT, SERVICES, TEAM_MEMBERS } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tServices = useTranslations("services");
  const tOffices = useTranslations("offices");
  const tTeam = useTranslations("team");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bordeaux-900 text-beige-200 pt-20 pb-8">
      <Container size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.svg"
                alt={COMPANY.name}
                width={36}
                height={36}
                className="brightness-0 invert"
              />
              <span className="font-display text-xl font-normal text-white tracking-tight">
                {COMPANY.name}
              </span>
            </div>
            <p className="text-beige-400 text-sm leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-medium text-sm uppercase tracking-[0.3em] mb-4">
              {t("services_title")}
            </h3>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-sm text-beige-400 hover:text-white transition-colors"
                  >
                    {tServices(`${service.id}.title`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-white font-medium text-sm uppercase tracking-[0.3em] mb-4">
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

          {/* Legal & Team */}
          <div>
            <h3 className="text-white font-medium text-sm uppercase tracking-[0.3em] mb-4">
              {t("legal_title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/impressum" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {t("impressum")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-beige-400 hover:text-white transition-colors">
                  {t("datenschutz")}
                </Link>
              </li>
            </ul>

            <h3 className="text-white font-medium text-sm uppercase tracking-[0.3em] mt-8 mb-4">
              {tTeam("nav_label")}
            </h3>
            <ul className="space-y-3">
              {TEAM_MEMBERS.map((member) => (
                <li key={member.slug}>
                  <Link
                    href={`/team/${member.slug}`}
                    className="text-sm text-beige-400 hover:text-white transition-colors"
                  >
                    {member.name}
                  </Link>
                </li>
              ))}
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
