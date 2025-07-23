import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="mt-15 pb-10 px-6 ">
      <div className=" mx-auto text-center ">
        <div className="slide-in-up">
          <div className="h-20"></div>
        </div>{" "}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-vintageOffWhiteSecondary/80 bg-clip-text  leading-tight font-sora-700 mb-4 fade-in-delay">
          Make every{" "}
          <span className="font-lora-400  text-vintageOffWhiteSecondary">
            Rupee
          </span>{" "}
          count
        </h1>{" "}
        <p className=" text-md md:text-lg text-vintageOffWhitePrimary/40 mb-8 font-serif-400  text-balance max-w-2xl mx-auto">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {" "}
          <Link href={`/dashboard`}>
            <Button className="bg-vintageOffWhiteSecondary/70 text-vintageBlue hover:bg-vintageOffWhiteSecondary  font-bold px-6 py-2 text-lg rounded-xl transition-all duration-300 hover:scale-105 ">
              Start Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
