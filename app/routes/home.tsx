import HomeNav from "~/components/home/HomeNav"
import HeroSection from "~/components/home/HeroSection"
import PhilosophySection from "~/components/home/PhilosophySection"
import HowItWorksSection from "~/components/home/HowItWorksSection"
import FeaturesSection from "~/components/home/FeaturesSection"
import CTABanner from "~/components/home/CTABanner"
import HomeFooter from "~/components/home/HomeFooter"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <HomeNav />
      <HeroSection />
      <PhilosophySection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTABanner />
      <HomeFooter />
    </div>
  )
}
