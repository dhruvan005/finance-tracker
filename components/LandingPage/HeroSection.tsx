import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="mt-15 pb-10 px-6 ">
      <div className=" mx-auto text-center ">
        <div className="slide-in-up">
          <div className="h-20"></div>
        </div>{" "}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-vintageOffWhite/90 bg-clip-text  leading-tight font-lora-500  mb-4 fade-in-delay">
          Time is Money, Save Both.
        </h1>{" "}
        <p className=" text-md md:text-lg text-vintageOffWhitePrimary/40 mb-8 font-serif-400  text-balance max-w-3xl mx-auto">
          Transform your financial habits with intelligent tracking,
          personalized insights, and goal-based planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {" "}
          <Link href={`/dashboard`}>
            <Button className="bg-vintageOffWhiteSecondary/70 text-vintageBlue hover:bg-vintageOffWhiteSecondary  font-roboto-flex px-6 py-2 text-lg rounded-xl transition-all duration-300 hover:scale-105 ">
              Start Trial
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
