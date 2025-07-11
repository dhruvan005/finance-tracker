import { HeroSection } from "@/components/LandingPage/HeroSection";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import { CTASection } from "@/components/LandingPage/CTASection";
import { Navbar } from "@/components/LandingPage/NavBar";
import { AnimatedBackground } from "@/components/LandingPage/AnimatedBackground";

import Image from "next/image";
import { FooterSection } from "@/components/LandingPage/FooterSection";

const Index = () => {
  return (
    <div className="bg-vintageBlue">
      <div className="min-h-screen overflow-hidden relative">
        <AnimatedBackground />
        <div className="relative z-10 max-w-[90dvw]  mx-auto px-4 sm:px-6 lg:px-8 py-0">
          <Navbar />
          <div className="h-25"></div>
          <div className="border border-vintageOffWhiteSecondary/30 backdrop-blur-md overflow-hidden shadow-lg min-h-[80dvh] relative rounded-lg">
            <Image
              src="/assets/Group.svg"
              alt="Hero Illustration"
              width={190}
              height={190}
              className="rounded-lg  fade-in-delay z-10 absolute top-2/4 -left-10 rotate-15  max-w-md h-auto opacity-65"
            />
            <Image
              src="/assets/stack-of-money.svg"
              alt="Hero Illustration"
              width={190}
              height={190}
              className="rounded-lg fade-in-delay z-10 absolute top-0 -right-15 rotate-15  max-w-md h-auto opacity-65"
            />
            <HeroSection />
          </div>
        </div>
      </div>
      <div className="h-10"></div>
      <div className="bg-[#FCFAEE] p-20 backdrop-blur-xl overflow-hidden  ">
        <FeaturesSection />
        <CTASection />
      </div>
      
      <FooterSection />
    </div>
  );
};

export default Index;
