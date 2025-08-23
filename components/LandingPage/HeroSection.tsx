import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className=" relative flex items-center justify-center min-h-[70dvh] sm:min-h-[75dvh] md:min-h-[80dvh] px-4 sm:px-6 lg:px-8 overflow-hidden -mt-3">
      {/* Background Images - Responsive positioning and sizing */}
      <Image
        src="/assets/Group.svg"
        alt="Hero Illustration"
        width={120}
        height={120}
        className="absolute top-1/2 -left-5 sm:-left-8 md:-left-10 rotate-12 opacity-60 sm:opacity-70 md:opacity-80 z-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48"
      />
      <Image
        src="/assets/stack-of-money.svg"
        alt="Hero Illustration"
        width={120}
        height={120}
        className="absolute top-2 sm:top-0 -right-5 sm:-right-10 md:-right-15 rotate-12 opacity-60 sm:opacity-70 md:opacity-80 z-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48"
      />

      <div className="relative text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto z-10">
        {/* Responsive Typography */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-vintageOffWhite/90 leading-tight font-lora-500 mb-3 sm:mb-4 md:mb-6 fade-in-delay">
          Time is Money, Save Both.
        </h1>

        {/* Responsive Description */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-vintageOffWhitePrimary/40 mb-6 sm:mb-7 md:mb-8 font-serif-400 text-balance max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>

        {/* Responsive Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href={`/dashboard`} className="w-full sm:w-auto">
            <Button className="bg-vintageOffWhiteSecondary/80 text-vintageBlue hover:bg-vintageOffWhiteSecondary font-roboto-flex px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md transition-all duration-300 hover:scale-105 text-sm sm:text-base md:text-lg font-bold w-full sm:w-auto min-w-[120px] sm:min-w-[140px]">
              Start Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
