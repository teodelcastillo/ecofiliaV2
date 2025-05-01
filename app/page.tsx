import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SolutionSection } from "@/components/solution-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { HeroSection } from "@/components/hero-section"
import { ValuePropositionSection } from "@/components/value-proposition-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValuePropositionSection />
        <SolutionSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
