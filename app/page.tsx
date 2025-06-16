import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Calendar, ChartBar, Settings } from "lucide-react";
import { HeroSection } from "@/components/LandingPage/HeroSection";
import { FeaturesSection } from "@/components/LandingPage/FeaturesSection";
import { CTASection } from "@/components/LandingPage/CTASection";
import { Navbar } from "@/components/LandingPage/NavBar";
import { AnimatedBackground } from "@/components/LandingPage/AnimatedBackground";
import dynamic from "next/dynamic";

// Import the font demo component
import Image from "next/image";

const Index = () => {
  return (
    <div className="min-h-screen bg-vintageBlue  overflow-hidden relative">
      {/* Main Content */} <AnimatedBackground />
      <div className="relative z-10 max-w-[90dvw]  mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <Navbar />
        <div className="h-25"></div>
        <div className="border border-vintageOffWhiteSecondary/30 rounded-2xl  backdrop-blur-md overflow-hidden shadow-lg">
          <Image
            src="./assets/Group.svg"
            alt="Hero Illustration"
            width={190}
            height={190}
            className="rounded-lg  fade-in-delay z-10 absolute top-2/4 -left-10 rotate-15  max-w-md h-auto opacity-65"
          />
          <Image
            src="./assets/stack-of-money.svg"
            alt="Hero Illustration"
            width={190}
            height={190}
            className="rounded-lg fade-in-delay z-10 absolute top-0 -right-15 rotate-15  max-w-md h-auto opacity-65"
          />
          <HeroSection />
        </div>
        <div className="h-25"></div>
        <div className="border border-vintageOffWhiteSecondary/30 rounded-2xl  backdrop-blur-md overflow-hidden shadow-lg">
          <FeaturesSection />
        </div>
        <CTASection />
      </div>
    </div>
  );
};

export default Index;
