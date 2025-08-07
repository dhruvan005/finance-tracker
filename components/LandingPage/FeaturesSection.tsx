import Image from "next/image";
import FeatureGrid from "./FeatureGrid";
import DynamicDashboard from "./dashboard-layout";

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
          <span className="text-xs text-vintageBlue/60 font-sora-300 mb-6">
            section = "features"
          </span>
          <h2 className="text-3xl max-w-3xl mx-auto md:text-5xl text-vintageBlue/80 font-sora-600 mb-6  ">
            Smart
            <span>
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
          {/* this is alternative of the feature section */}
          {/* in this component, after the app is ready add image of the app mockup*/}
          {/* <DynamicDashboard /> */}
        </div>
        <div className=" shadow-lg border border-vintageBlue/20 rounded-2xl">
          <FeatureGrid />
        </div>
      </div>
    </div>
  );
};
