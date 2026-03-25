import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { FourPointPlan } from "@/components/sections/FourPointPlan";
import { Gesetze } from "@/components/sections/Gesetze";
import { Philosophy } from "@/components/sections/Philosophy";
import { Offices } from "@/components/sections/Offices";
import { Contact } from "@/components/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollToSection } from "@/components/layout/ScrollToSection";
import { isFourPointPlanLocale } from "@/lib/constants";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const showFourPointPlan = isFourPointPlanLocale(locale);
  return (
    <>
      <ScrollToSection />
      <Hero />
      <SectionDivider variant="diamond" />
      <About />
      <SectionDivider variant="line" />
      <Services />
      {showFourPointPlan ? <SectionDivider variant="line" /> : null}
      {showFourPointPlan ? <FourPointPlan /> : null}
      <SectionDivider variant="dots" />
      <Gesetze />
      <SectionDivider variant="line" />
      <Philosophy />
      <SectionDivider variant="line" />
      <Offices />
      <SectionDivider variant="diamond" />
      <SectionDivider variant="line" />
      <Contact />
    </>
  );
}
