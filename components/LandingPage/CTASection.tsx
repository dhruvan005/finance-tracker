import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const CTASection = () => {
  return (
    <section className="py-20 px-6 ">
      <div className="container mx-auto  ">
        <div className="text-center border border-green-400/20 relative overflow-hidden rounded-2xl bg-vintageBlue p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 shadow-lg">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-sora-800 mb-6 max-w-3xl text-balance mx-auto">
              Unlock your AI Financial{" "}
              <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-pink-200 to-amber-300 text-transparent bg-clip-text  bg-size-200 animate-gradient-x font-bold text-lora-Italic">
                superpowers
              </span>
            </h2>

            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who have already taken control of their
              finances. Start today and see the difference in just 7 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href={`/dashboard`}>
                <Button
                  size="lg"
                  className="bg-vintageOffWhiteSecondary text-vintageBlue font-light font-serif px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:bg-vintageOffWhitePrimary hover:text-vintageBlue pulse-glow"
                >
                  Start Trial - No Credits Required
                </Button>
              </Link>
            </div>
            <div className="">
              <Image
                src="/assets/arrow.svg"
                alt="arrow"
                width={80}
                height={80}
                className="absolute inset-0 left-2/10 top-9/10 -rotate-15"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
