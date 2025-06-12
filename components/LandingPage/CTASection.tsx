import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-500/10 rounded-3xl p-8 md:p-16 text-center border border-green-400/20 relative overflow-hidden">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-blue-500/5 rounded-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="gradient-text">Financial Life?</span>
            </h2>

            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who have already taken control of their
              finances. Start your free trial today and see the difference in
              just 7 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-slate-900 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 pulse-glow"
              >
                Start Free Trial - No Credit Card Required
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                14-day free trial
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel anytime
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Premium support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
