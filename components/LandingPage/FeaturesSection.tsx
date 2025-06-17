import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  ChartBar,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
// Import our new Bento grid components
import {
  BentoGrid,
  BentoCard,
  BentoCardIcon,
  BentoCardHeader,
  BentoCardBody,
  BentoCardTitle,
  BentoCardStats,
  BentoCardDescription,
  BentoCardFooter,
} from "../ui/bento-grid";

// Types for our feature components
type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  className?: string;
  children?: ReactNode;
};

type FeatureListType = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  imageSrc?: string; // Optional image source property
  imagePosition?: string; // Optional position property
  imageSize?: string; // Optional size property
};

const features: FeatureListType[] = [
  {
    icon: Calendar,
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize and track your daily expenses with AI-powered insights.",
    color: "from-[#DDA853] to-[#DDA853]/80",
    imageSrc: "/assets/analyze-data.svg",
    imagePosition: "right-0 bottom-0",
    imageSize: "w-28 h-28",
  },
  {
    icon: ChartBar,
    title: "Income Management",
    description:
      "Monitor multiple income streams and optimize your earning potential.",
    color: "from-vintageBlue to-vintageNevyBlue",
    imageSrc: "/assets/stack-of-money.svg",
    imagePosition: "right-2 bottom-2",
    imageSize: "w-24 h-24",
  },
  {
    icon: Settings,
    title: "Budget Creation",
    description:
      "Create flexible budgets that adapt to your lifestyle and financial goals.",
    color: "from-[#DDA853] to-[#DDA853]/80",
    // Example of a feature without an image
  },
  {
    icon: ArrowUp,
    title: "Savings Goals",
    description:
      "Set and achieve your savings targets with personalized recommendations.",
    color: "from-vintageBlue to-vintageNevyBlue",
    imageSrc: "/assets/project-timeline.svg",
    imagePosition: "right-2 bottom-2",
    imageSize: "w-32 h-32",
  },
  {
    icon: ChartBar,
    title: "Analytics & Reports",
    description:
      "Visualize your financial patterns with beautiful charts and insights.",
    color: "from-[#DDA853] to-[#DDA853]/80",
    imageSrc: "/assets/filling-survey.svg",
    imagePosition: "right-0 bottom-0",
    imageSize: "w-24 h-24",
  },
  {
    icon: ArrowDown,
    title: "Smart Alerts",
    description:
      "Never miss a payment or exceed your budget with intelligent notifications.",
    color: "from-vintageBlue to-vintageNevyBlue",
    // Example of a feature with only partial image properties
    imageSrc: "/assets/credit-card-declined (1).svg",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        {" "}
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-vintageOffWhiteSecondary/80">
            Powerful Features for{" "}
            <span className="font-lora-700 text-vintageOffWhitePrimary">
              Smart Financial Planning{" "}
            </span>
          </h2>
          <p className="text-xl text-vintageOffWhitePrimary/40 max-w-3xl mx-auto text-balance">
            Everything you need to take control of your finances, backed by AI
            and designed for simplicity.
          </p>{" "}
        </div>{" "}
        {/* Using our new modular Bento Grid System */}
        <div className="  ">
          {/* 
          <BentoGrid cols={2} className="">
            <BentoCard colSpan={1} rowSpan={2}>
              <BentoCardHeader>
                <BentoCardIcon
                  icon={features[0].icon}
                  color={features[0].color}
                  className="w-14 h-14"
                />
                <BentoCardTitle className="text-2xl">
                  {features[0].title}
                </BentoCardTitle>
                <BentoCardStats>{features[0].stats}</BentoCardStats>
              </BentoCardHeader>
              <BentoCardBody className="flex-grow flex flex-col">
                <BentoCardDescription className="text-lg">
                  {features[0].description}
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
            </BentoCard>{" "}
            <div className="grid grid-rows-2 h-full">
              {features.slice(1, 3).map((feature, index) => (
                <BentoCard key={index} className="h-full flex flex-col">
                  <BentoCardHeader>
                    <BentoCardIcon icon={feature.icon} color={feature.color} />
                    <BentoCardTitle>{feature.title}</BentoCardTitle>
                    <BentoCardStats>{feature.stats}</BentoCardStats>
                  </BentoCardHeader>
                  <BentoCardBody className="flex-grow">
                    <BentoCardDescription>
                      {feature.description}
                    </BentoCardDescription>
                  </BentoCardBody>
                </BentoCard>
              ))}
            </div>
          </BentoGrid> */}

          <BentoGrid cols={3} className=" backdrop-blur-lg ">
            {" "}
            {/* Primary Feature Card with evenly divided cards */}
            <div className="grid grid-rows-2 h-full ">
              {features.slice(0, 3).map((feature, index) => (
                <BentoCard
                  key={index}
                  className="h-full flex flex-col relative overflow-hidden"
                >
                  <BentoCardHeader>
                    <BentoCardIcon icon={feature.icon} color={feature.color} />
                    <BentoCardTitle>{feature.title}</BentoCardTitle>
                  </BentoCardHeader>{" "}
                  <BentoCardBody className="flex-grow">
                    <BentoCardDescription>
                      {feature.description}
                    </BentoCardDescription>
                    {feature.imageSrc && (
                      <div
                        className={`absolute ${feature.imagePosition || "right-0 bottom-0"} opacity-70 hover:opacity-100 transition-opacity`}
                      >
                        <Image
                          src={feature.imageSrc}
                          alt={feature.title}
                          width={100}
                          height={100}
                          className={`${feature.imageSize || "w-24 h-24"} opacity-40 hover:opacity-100 transition-opacity`}
                        />
                      </div>
                    )}
                  </BentoCardBody>
                </BentoCard>
              ))}
            </div>
            <BentoCard
              colSpan={1}
              rowSpan={2}
              className="relative overflow-hidden"
            >
              <BentoCardHeader>
                <BentoCardIcon
                  icon={features[3].icon}
                  color={features[3].color}
                  className="w-14 h-14"
                />
                <BentoCardTitle className="text-2xl">
                  {features[3].title}
                </BentoCardTitle>
              </BentoCardHeader>
              <BentoCardBody className="flex-grow flex flex-col">
                <BentoCardDescription className="text-lg">
                  {features[3].description}
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
                </BentoCardFooter>{" "}
                {features[3].imageSrc && (
                  <div
                    className={`absolute ${features[3].imagePosition || "right-2 bottom-2"} opacity-70 hover:opacity-100 transition-opacity`}
                  >
                    <Image
                      src={features[3].imageSrc}
                      alt={features[3].title}
                      width={120}
                      height={120}
                      className={`${features[3].imageSize || "w-24 h-24"} opacity-40 hover:opacity-100 transition-opacity`}
                    />
                  </div>
                )}
              </BentoCardBody>
            </BentoCard>
            <div className="grid grid-rows-2 h-full ">
              {features.slice(4, 6).map((feature, index) => (
                <BentoCard
                  key={index}
                  className="h-full flex flex-col relative overflow-hidden"
                >
                  <BentoCardHeader>
                    <BentoCardIcon icon={feature.icon} color={feature.color} />
                    <BentoCardTitle>{feature.title}</BentoCardTitle>
                  </BentoCardHeader>
                  <BentoCardBody className="flex-grow">
                    <BentoCardDescription>
                      {feature.description}
                    </BentoCardDescription>
                    {feature.imageSrc && (
                      <div
                        className={`absolute ${feature.imagePosition || "right-0 bottom-0"} opacity-70 hover:opacity-100 transition-opacity`}
                      >
                        <Image
                          src={feature.imageSrc}
                          alt={feature.title}
                          width={100}
                          height={100}
                          className={`${feature.imageSize || "w-24 h-24"} opacity-40 hover:opacity-100 transition-opacity`}
                        />
                      </div>
                    )}
                  </BentoCardBody>
                </BentoCard>
              ))}
            </div>
          </BentoGrid>
        </div>
        {/* Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-slate-800/50 to-slate-700/50  p-8 md:p-12 border border-slate-600/50">
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
