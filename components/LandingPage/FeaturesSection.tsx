import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ChartBar, Settings, ArrowUp, ArrowDown } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize and track your daily expenses with AI-powered insights.",
    color: "from-green-400 to-emerald-500",
    stats: "+23% savings average",
  },
  {
    icon: ChartBar,
    title: "Income Management",
    description:
      "Monitor multiple income streams and optimize your earning potential.",
    color: "from-blue-400 to-cyan-500",
    stats: "Real-time tracking",
  },
  {
    icon: Settings,
    title: "Budget Creation",
    description:
      "Create flexible budgets that adapt to your lifestyle and financial goals.",
    color: "from-purple-400 to-pink-500",
    stats: "90% goal achievement",
  },
  {
    icon: ArrowUp,
    title: "Savings Goals",
    description:
      "Set and achieve your savings targets with personalized recommendations.",
    color: "from-orange-400 to-red-500",
    stats: "2x faster results",
  },
  {
    icon: ChartBar,
    title: "Analytics & Reports",
    description:
      "Visualize your financial patterns with beautiful charts and insights.",
    color: "from-teal-400 to-green-500",
    stats: "Deep insights",
  },
  {
    icon: ArrowDown,
    title: "Smart Alerts",
    description:
      "Never miss a payment or exceed your budget with intelligent notifications.",
    color: "from-indigo-400 to-purple-500",
    stats: "100% on-time payments",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="gradient-text">Smart Money Management</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Everything you need to take control of your finances, backed by AI
            and designed for simplicity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700/50 hover-lift group"
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </CardTitle>
                <div className="text-sm text-green-400 font-medium mb-3">
                  {feature.stats}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 md:p-12 border border-slate-600/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                AI-Powered{" "}
                <span className="gradient-text">Financial Insights</span>
              </h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Our advanced AI analyzes your spending patterns and provides
                personalized recommendations to help you save more and spend
                smarter.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Predictive spending alerts
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Personalized saving strategies
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Investment opportunity detection
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-xl p-6 backdrop-blur-sm border border-green-400/20">
                <div className="text-green-400 text-sm font-medium mb-2">
                  Monthly Report
                </div>
                <div className="text-2xl font-bold text-white mb-4">
                  You saved 23% more this month!
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Groceries</span>
                    <span className="text-green-400">-15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Dining Out</span>
                    <span className="text-green-400">-30%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Entertainment</span>
                    <span className="text-green-400">-8%</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-float"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
