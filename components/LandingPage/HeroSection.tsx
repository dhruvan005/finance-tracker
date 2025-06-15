import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="mt-15 pb-10 px-6 ">
      <div className=" mx-auto text-center ">
        {/* Badge */}
        <div className="slide-in-up">
          <Badge className="mb-6 bg-green-400/10 text-green-400 border-green-400/20 px-4 py-2 text-sm font-medium">
            🎉 New AI-Powered Insights Available
          </Badge>
        </div>
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight ">
          Make every{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Rupee count
          </span>
        </h1>{" "}
        {/* Subheading */}
        <p className="fade-in-delay text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>
        {/* CTA Buttons */}
        <div className="fade-in-delay flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-slate-900 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 pulse-glow"
          >
            Start Trial
          </Button>
        </div>
        {/* Stats */}
        {/* Scroll Indicator */}
        {/* <div className="fade-in-delay animate-bounce">
          <ArrowDown className="w-6 h-6 mx-auto text-slate-400" />
        </div> */}
      </div>
    </section>
  );
};
