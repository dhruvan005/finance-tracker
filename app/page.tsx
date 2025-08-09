import { HeroSection } from "@/components/LandingPage/HeroSection";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import { CTASection } from "@/components/LandingPage/CTASection";
import { Navbar } from "@/components/LandingPage/Navbar";
import { AnimatedBackground } from "@/components/LandingPage/AnimatedBackground";
import { FooterSection } from "@/components/LandingPage/FooterSection";
import { SecuritySection } from "@/components/LandingPage/SecuritySection";

const Index = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-vintageBlue min-h-screen relative ">
          <div className="h-20"></div>
        <div className="relative z-10 max-w-[90dvw] mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedBackground />
          <div className="border border-vintageOffWhiteSecondary/30 backdrop-blur-md shadow-lg min-h-[80dvh] relative rounded-2xl">
            <HeroSection />
          </div>
        </div>
      </div>
      {/* Other sections without animated background */}
      <div className="bg-[#FCFAEE]">
        <FeaturesSection />
        <CTASection />
      </div>
      <div className="bg-vintageBlue ">
        <SecuritySection
          heading="Top-notch Security"
          description="Your financial data is protected with enterprise-grade encryption and security measures."
          image={{
            src: "/assets/insurance.svg",
            alt: "Hero section demo image showing interface components",
          }}
        />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
