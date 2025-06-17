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
        {/* Main Heading */}{" "}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-vintageOffWhiteSecondary/80 bg-clip-text  leading-tight font-sora-700 mb-4 fade-in-delay">
          Make every{" "}
          <span className="">
            <span className="font-lora-700 text-vintageOffWhitePrimary bg-clip-text  shadow-sm">
              Rupee
            </span>{" "}
            count
          </span>
        </h1>{" "}
        {/* Subheading */}
        <p className=" text-lg md:text-xl text-vintageOffWhitePrimary/40 mb-8  leading-relaxed font-sans-500 tracking-tight text-balance max-w-2xl mx-auto ">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {" "}
          <Button
            size="lg"
            className="bg-[#DDA853]/90 text-vintageBlue hover:bg-[DDA853]/50  font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 "
          >
            Start Trial
          </Button>
        </div>
      </div>
    </section>
  );
};
