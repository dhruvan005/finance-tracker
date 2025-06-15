import { Calendar, ChartBar, Settings, ArrowRight } from "lucide-react";
import {
  BentoCard,
  BentoCardBody,
  BentoCardDescription,
  BentoCardFooter,
  BentoCardHeader,
  BentoCardIcon,
  BentoCardStats,
  BentoCardTitle,
  BentoGrid
} from "../ui/bento-grid";

type FeatureType = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  stats: string;
};

// Example features data
const featuresData: FeatureType[] = [
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
];

export function ModularFeaturesBento() {
  return (
    <div className="container mx-auto">
      <BentoGrid cols={2} className="max-w-5xl mx-auto">
        {/* Primary large feature card */}
        <BentoCard colSpan={1} rowSpan={2}>
          <BentoCardHeader>
            <BentoCardIcon 
              icon={featuresData[0].icon} 
              color={featuresData[0].color} 
              className="w-14 h-14"
            />
            <BentoCardTitle className="text-2xl mb-3">
              {featuresData[0].title}
            </BentoCardTitle>
            <BentoCardStats>
              {featuresData[0].stats}
            </BentoCardStats>
          </BentoCardHeader>
          <BentoCardBody className="flex flex-col flex-grow">
            <BentoCardDescription className="text-lg">
              {featuresData[0].description}
            </BentoCardDescription>
            
            <BentoCardFooter>
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-300">Monthly expenses</span>
                  <span className="text-green-400 font-medium">-18%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  View detailed report
                </span>
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </BentoCardFooter>
          </BentoCardBody>
        </BentoCard>

        {/* Secondary features column */}
        <div className="flex flex-col space-y-8">
          {featuresData.slice(1, 3).map((feature, index) => (
            <BentoCard key={index}>
              <BentoCardHeader>
                <BentoCardIcon 
                  icon={feature.icon} 
                  color={feature.color}
                />
                <BentoCardTitle>
                  {feature.title}
                </BentoCardTitle>
                <BentoCardStats>
                  {feature.stats}
                </BentoCardStats>
              </BentoCardHeader>
              <BentoCardBody>
                <BentoCardDescription>
                  {feature.description}
                </BentoCardDescription>
              </BentoCardBody>
            </BentoCard>
          ))}
        </div>
      </BentoGrid>
    </div>
  );
}
