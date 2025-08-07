import { HeroSection } from "@/components/LandingPage/HeroSection";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import { CTASection } from "@/components/LandingPage/CTASection";
import { Navbar } from "@/components/LandingPage/NavBar";
import { AnimatedBackground } from "@/components/LandingPage/AnimatedBackground";
import { FooterSection } from "@/components/LandingPage/FooterSection";

const Index = () => {
  return (
    <div className="bg-vintageBlue">
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 max-w-[90dvw] mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
          <div className="h-20"></div>
          <div className="border border-vintageOffWhiteSecondary/30 backdrop-blur-md shadow-lg min-h-[80dvh] relative rounded-2xl">
            <HeroSection />
          </div>
        </div>
      </div>
      <div className="bg-[#FCFAEE]">
        <FeaturesSection />
        <CTASection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
