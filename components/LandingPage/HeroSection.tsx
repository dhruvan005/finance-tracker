import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[80dvh] px-6 overflow-hidden -mt-3">
      {/* Background Images */}
      <Image
        src="/assets/Group.svg"
        alt="Hero Illustration"
        width={190}
        height={190}
        className="absolute top-1/2 -left-10 rotate-12 opacity-80 z-0"
      />
      <Image
        src="/assets/stack-of-money.svg"
        alt="Hero Illustration"
        width={190}
        height={190}
        className="absolute top-0 -right-15 rotate-12 opacity-80 z-0"
      />

      <div className="relative  text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-vintageOffWhite/90 leading-tight font-lora-500 mb-4 fade-in-delay">
          Time is Money, Save Both.
        </h1>
        <p className="text-md md:text-lg text-vintageOffWhitePrimary/40 mb-8 font-serif-400 text-balance max-w-3xl mx-auto">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/dashboard`}>
            <Button className="bg-vintageOffWhiteSecondary/80 text-vintageBlue hover:bg-vintageOffWhiteSecondary font-roboto-flex px-5 py-2 rounded-md transition-all duration-300 hover:scale-105 text-md font-bold">
              Start Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
