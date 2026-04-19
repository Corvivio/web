import HomeNav from "~/components/home/HomeNav"
import HeroSection from "~/components/home/HeroSection"
import HowItWorksSection from "~/components/home/HowItWorksSection"
import PhilosophySection from "~/components/home/PhilosophySection"
import FeaturesSection from "~/components/home/FeaturesSection"
import CTABanner from "~/components/home/CTABanner"
import HomeFooter from "~/components/home/HomeFooter"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <HomeNav />
      <HeroSection />
      <HowItWorksSection />
      <PhilosophySection />
      <FeaturesSection />
      <CTABanner />
      <HomeFooter />
    </div>
  )
}
