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
import FeatureSection from "./FeatureGrid";
import FeatureGrid from "./FeatureGrid";
// Import our new FeatureGrid component

// // Types for our feature components
// type FeatureCardProps = {
//   icon: LucideIcon;
//   title: string;
//   description: string;
//   color: string;
//   className?: string;
//   children?: ReactNode;
// };

// type FeatureListType = {
//   icon: LucideIcon;
//   title: string;
//   description: string;
//   color: string;
//   imageSrc?: string; // Optional image source property
//   imagePosition?: string; // Optional position property
//   imageSize?: string; // Optional size property - CSS classes for controlling image size/positioning
//   imageObjectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"; // Control how the image fits within its container
//   imageAspectRatio?: string; // Custom aspect ratio for the image container
//   imageRotation?: string; // Optional rotation CSS class (e.g., "rotate-1", "rotate-2", etc.)
// };

// const features: FeatureListType[] = [
//   {
//     icon: Calendar,
//     title: "Smart Expense Tracking",
//     description:
//       "Automatically categorize and track your daily expenses with AI-powered insights.",
//     color: "from-[#DDA853] to-[#DDA853]/80",
//     imageSrc: "/assets/filling-survey.svg",
//     imagePosition: "right-15 top-0", // Bottom-right positioning
//     imageSize: "w-30 h-30",
//     imageObjectFit: "contain",
//     imageRotation: "rotate-2", // Slight clockwise rotation
//     imageAspectRatio: "aspect-square",
//   },
//   {
//     icon: ChartBar,
//     title: "Income Management",
//     description:
//       "Monitor multiple income streams and optimize your earning potential.",
//     color: "from-vintageBlue to-vintageNevyBlue",
//     imageSrc: "/assets/stack-of-money.svg",
//     imagePosition: "right-15 bottom-5", // Top positioning
//     imageSize: "w-35 h-35",
//     imageObjectFit: "contain",
//     imageRotation: "-rotate-10", // Slight counter-clockwise rotation
//   },
//   {
//     icon: Settings,
//     title: "Budget Creation",
//     description:
//       "Create flexible budgets that adapt to your lifestyle and financial goals.",
//     color: "from-[#DDA853] to-[#DDA853]/80",
//     imageSrc: "/assets/payment-processed.svg",
//     imagePosition: "right-15 bottom-5", // Top positioning
//     imageSize: "w-28 h-28",
//     imageObjectFit: "contain",
//     imageRotation: "-rotate-10", // Slight counter-clockwise rotation
//     // Example of a feature without an image
//   },
//   {
//     icon: ArrowUp,
//     title: "Savings Goals",
//     description:
//       "Set and achieve your savings targets with personalized recommendations.",
//     color: "from-vintageBlue to-vintageNevyBlue",
//     imageSrc: "/assets/cryptowallets-showing.svg",
//     imagePosition: "right-15 bottom-5", // Center positioning
//     imageSize: "w-50 h-50",
//     imageObjectFit: "contain",
//     imageRotation: "rotate-1",
//     imageAspectRatio: "aspect-[1.2]",
//   },
//   {
//     icon: ChartBar,
//     title: "Analytics & Reports",
//     description:
//       "Visualize your financial patterns with beautiful charts and insights.",
//     color: "from-[#DDA853] to-[#DDA853]/80",
//     imageSrc: "/assets/analyze-data.svg",
//     imagePosition: "left-15 bottom-5", // Bottom-left positioning
//     imageSize: "w-28 h-28",
//     imageObjectFit: "contain",
//     imageRotation: "rotate-3", // More pronounced rotation
//   },
//   {
//     icon: ArrowDown,
//     title: "Smart Alerts",
//     description:
//       "Never miss a payment or exceed your budget with intelligent notifications.",
//     color: "from-vintageBlue to-vintageNevyBlue",
//     imageSrc: "/assets/credit-card-declined (1).svg",
//     imagePosition: "right-15 top-0", // Top-left positioning
//     imageSize: "w-40 h-40",
//     imageObjectFit: "contain",
//     imageRotation: "-rotate-2",
//   },
// ];

export const FeaturesSection = () => {
  return (
    <div id="features" className="py-15 px-6 ">
      <div className="container mx-auto ">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl max-w-3xl mx-auto md:text-5xl text-vintageBlue/80 font-sora-600 mb-6  ">
            Smart
            <span className="">
              <Image
                src={"/assets/dash.svg"}
                alt="Dash Icon"
                width={35}
                height={35}
                className="inline-block rotate-220 mb-3"
              />
            </span>
            <span className="font-extrabold text-vintageBlue">Features</span>
            <span>
              <Image
                src={"/assets/dash.svg"}
                alt="Dash Icon"
                width={35}
                height={35}
                className="inline-block mt-2 rotate-50 "
              />{" "}
            </span>
            for <span className="font-lora-700">Smart Financial Planning </span>
          </h2>
          <p className="text-xl  max-w-3xl mx-auto text-balance text-vintageBlue/80 font-sora-500">
            Everything you need to take control of your finances, backed by AI
            and designed for simplicity.
          </p>
        </div>
        {/* Bento grid */}
        <div>
          {/* <div className="  ">
            <BentoGrid cols={3} className=" backdrop-blur-lg ">
              <div className="grid grid-rows-2 h-full ">
                {features.slice(0, 3).map((feature, index) => (
                  <BentoCard
                    key={index}
                    className="h-full flex flex-col relative overflow-hidden"
                  >
                    <BentoCardHeader>
                      <BentoCardIcon
                        icon={feature.icon}
                        color={feature.color}
                      />
                      <BentoCardTitle>{feature.title}</BentoCardTitle>
                    </BentoCardHeader>{" "}
                    <BentoCardBody className="flex-grow">
                      <BentoCardDescription>
                        {feature.description}
                      </BentoCardDescription>
                      {feature.imageSrc && (
                        <div
                          className={`absolute ${feature.imagePosition || "right-0 bottom-10"} opacity-70 hover:opacity-100 transition-opacity`}
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
                      <BentoCardIcon
                        icon={feature.icon}
                        color={feature.color}
                      />
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
          </div> */}
        </div>

        <div className=" shadow-lg border border-vintageBlue/20 rounded-2xl">
          <FeatureGrid />
        </div>
      </div>
    </div>
  );
};
