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

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white/80 overflow-hidden relative">
      {/* Background Effects */}
      {/* <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>

      {/* Animated Grid Background */}
      {/* <div className="fixed inset-0 opacity-[0.2]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, #22c55e 1px, transparent 1px),
            linear-gradient(to bottom, #22c55e 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>  */}
      {/* Main Content */} <AnimatedBackground />
      <div className="relative z-10 max-w-[90dvw] mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <Navbar />
        <div className="h-25"></div>
        <div className="border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-md ">
          <HeroSection />
        </div>
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
};

export default Index;
