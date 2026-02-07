import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Philosophy } from "@/components/sections/Philosophy";
import { Offices } from "@/components/sections/Offices";
import { Contact } from "@/components/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollToSection } from "@/components/ScrollToSection";

export default function HomePage() {
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
