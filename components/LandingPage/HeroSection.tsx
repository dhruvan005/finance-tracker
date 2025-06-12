
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        {/* Badge */}
        <div className="slide-in-up">
          <Badge className="mb-6 bg-green-400/10 text-green-400 border-green-400/20 px-4 py-2 text-sm font-medium">
            🎉 New AI-Powered Insights Available
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="slide-in-up text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Take Control of Your{" "}
          <span className="gradient-text">Financial Future</span>
        </h1>

        {/* Subheading */}
        <p className="fade-in-delay text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your financial habits with intelligent tracking, personalized insights, 
          and goal-based planning. Join thousands who've already mastered their money.
        </p>

        {/* CTA Buttons */}
        <div className="fade-in-delay flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-slate-900 font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 pulse-glow"
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-green-400 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:border-green-400/50"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="fade-in-delay grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-slate-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">$2.5M+</div>
            <div className="text-slate-400">Money Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">95%</div>
            <div className="text-slate-400">User Satisfaction</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="fade-in-delay animate-bounce">
          <ArrowDown className="w-6 h-6 mx-auto text-slate-400" />
        </div>
      </div>
    </section>
  );
};
