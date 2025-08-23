import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className=" relative flex items-center justify-center min-h-[75vh] md:min-h-[80vh] px-4 sm:px-6 lg:px-8 overflow-hidden -mt-3">
      {/* Background Images - Responsive positioning and sizing */}
      <Image
        src="/assets/stack-of-money.svg"
        alt="Hero Illustration"
        width={120}
        height={120}
        className="absolute top-0 -right-10 rotate-12 opacity-50 md:opacity-80 z-0 w-34 h-34  md:w-36 md:h-36 lg:w-42 lg:h-42"
      />
      <Image
        src="/assets/Group.svg"
        alt="Hero Illustration"
        width={120}
        height={120}
        className="absolute bottom-0 -left-5 sm:-left-8 md:-left-10 rotate-12 opacity-50  md:opacity-80 z-0 w-34 h-34 md:w-36 md:h-36 lg:w-42 lg:h-42"
      />

      <div className="relative text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto z-10">
        {/* Responsive Typography */}
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-vintageOffWhite/90 leading-tight font-lora-500 mb-3 fade-in-delay">
          Time is Money, <br className="block sm:hidden" />
          Save Both.
        </h1>

        {/* Responsive Description */}
        <p className="text-md   text-vintageOffWhitePrimary/40 mb-6 sm:mb-7 md:mb-8 font-serif-400 text-balance max-w-2xl  mx-auto px-2 sm:px-0">
          Track your money, reach your goals, and actually stick to your budget.
        </p>

        {/* Responsive Button */}
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-vintageOffWhiteSecondary/80 text-vintageBlue hover:bg-vintageOffWhiteSecondary font-serif px-6 py-3 rounded-md transition-all duration-300 hover:scale-105 text-md font-semibold">
              Start Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};


