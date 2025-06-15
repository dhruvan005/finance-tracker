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
          <div className="h-20"></div>
        </div>
        {/* Main Heading */}        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white bg-clip-text  leading-tight font-sora-700 mb-4 fade-in-delay">
          Make every{" "}
          <span className="">
            <span className="font-lora-700 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent shadow-sm">
              Rupee
            </span>{" "}
            count
          </span>
        </h1>{" "}
        {/* Subheading */}
        <p className="fade-in-delay text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed font-sans-500 tracking-tight">
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
      </div>
    </section>
  );
};
