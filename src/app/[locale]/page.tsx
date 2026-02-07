import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Philosophy } from "@/components/sections/Philosophy";
import { Offices } from "@/components/sections/Offices";
import { Contact } from "@/components/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollToSection } from "@/components/layout/ScrollToSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ScrollToSection />
      <Hero />
      <SectionDivider variant="diamond" />
      <About />
      <SectionDivider variant="line" />
      <Services />
      <SectionDivider variant="dots" />
      <Philosophy />
      <SectionDivider variant="line" />
      <Offices />
      <SectionDivider variant="diamond" />
      <Contact />
    </>
  );
}
