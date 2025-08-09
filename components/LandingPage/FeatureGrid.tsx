"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface FeatureContent {
  id: string;
  title: string;
  buttonText: string;
  features: {
    title: string;
    description: string;
  }[];
}

const featureData: Record<string, FeatureContent> = {
  expense: {
    id: "expense",
    title: "Smart Expense Tracking",
    buttonText: "Explore Expense Tracking",
    features: [
      {
        title: "Automatic Categorization",
        description:
          "Automatically categorize and track your daily expenses with AI-powered insights that identify spending patterns.",
      },
      {
        title: "Real-time Tracking",
        description:
          "Monitor your spending in real-time with intelligent notifications and insights that help you stay within budget.",
      },
    ],
  },
  income: {
    id: "income",
    title: "Income Management",
    buttonText: "Explore Income Management",
    features: [
      {
        title: "Multiple Income Streams",
        description:
          "Monitor multiple income streams and optimize your earning potential with comprehensive dashboards that provide clear visibility.",
      },
      {
        title: "Income Analytics",
        description:
          "Track your income sources with detailed analytics that help you identify opportunities for growth and optimization.",
      },
    ],
  },
  budget: {
    id: "budget",
    title: "Budget Creation",
    buttonText: "Explore Budget Solutions",
    features: [
      {
        title: "Flexible Budgeting",
        description:
          "Create flexible budgets that adapt to your lifestyle and financial goals, helping you maintain control over your finances.",
      },
      {
        title: "Customizable Categories",
        description:
          "Build personalized budget categories that reflect your unique spending habits and financial priorities.",
      },
    ],
  },
  analytics: {
    id: "analytics",
    title: "Analytics & Reports",
    buttonText: "Explore Financial Analytics",
    features: [
      {
        title: "Visual Insights",
        description:
          "Visualize your financial patterns with beautiful charts and insights that provide a complete picture of your financial health.",
      },
      {
        title: "Data-Driven Decisions",
        description:
          "Make informed financial decisions using comprehensive reports that highlight trends, opportunities, and potential issues.",
      },
    ],
  },
  savings: {
    id: "savings",
    title: "Savings Goals",
    buttonText: "Explore Savings Features",
    features: [
      {
        title: "Target Achievements",
        description:
          "Set and achieve your savings targets with personalized recommendations that keep you on track toward your financial goals.",
      },
      {
        title: "Smart Notifications",
        description:
          "Never miss a payment or exceed your budget with intelligent notifications that help you stay disciplined with your finances.",
      },
    ],
  },
};

const roleCards = [
  {
    id: "expense",
    label: "Expense Tracking",
    imgSrc: "/assets/filling-survey.svg",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 via-cyan-50 to-blue-50",
  },
  {
    id: "income",
    label: "Income Management",
    imgSrc: "/assets/stack-of-money-feature.svg",
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 via-emerald-50 to-green-50",
  },
  {
    id: "budget",
    label: "Budget Creation",
    imgSrc: "/assets/payment-processed.svg",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-50 via-violet-50 to-purple-50",
  },
  {
    id: "analytics",
    label: "Analytics & Reports",
    imgSrc: "/assets/analyze-data.svg",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 via-red-50 to-orange-50",
  },
  {
    id: "savings",
    label: "Savings Goals",
    imgSrc: "/assets/cryptowallets-showing.svg",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 via-rose-50 to-pink-50",
  },
];

export default function FeatureGrid() {
  const [activeRole, setActiveRole] = useState("expense");
  const [isChanging, setIsChanging] = useState(false);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const currentContent = featureData[activeRole];
  const activeCard = roleCards.find((card) => card.id === activeRole);

  const handleRoleChange = (roleId: string) => {
    if (roleId === activeRole) return;

    setClickedCard(roleId);
    setIsChanging(true);

    // Reset click animation after a short delay
    setTimeout(() => setClickedCard(null), 300);

    // Change content after fade out
    setTimeout(() => {
      setActiveRole(roleId);
      setIsChanging(false);
    }, 200);
  };

  return (
    <div className="w-full mx-auto px-10 py-15 relative overflow-hidden  ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-sm animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "3s",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 relative z-10">
        {roleCards.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`relative p-8 pt-6 pb-10 h-64 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden ${
              activeRole === role.id
                ? `border-transparent bg-gradient-to-br bg-accent-foreground shadow-2xl scale-105`
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            } ${clickedCard === role.id ? "scale-110" : ""}`}
          >
            {/* Ripple Effect */}
            {/* {clickedCard === role.id && (
              <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"></div>
            )} */}

            {/* Gradient Overlay for Active Card */}
            {activeRole === role.id && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-10 rounded-2xl animate-pulse/20 transition-all duration-500`}
              ></div>
            )}

            <div className="flex flex-col items-center space-y-6 h-full justify-between relative ">
              <h3
                className={`font-medium text-center text-lg transition-all duration-300 ${
                  activeRole === role.id
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              >
                {role.label}
              </h3>
              <div className="w-32 h-32 flex items-center justify-center relative">
                <Image
                  src={role.imgSrc}
                  alt={role.label}
                  width={160}
                  height={160}
                  className={`transition-all duration-500 ${
                    activeRole === role.id
                      ? "opacity-100 scale-110 drop-shadow-lg"
                      : "opacity-40 group-hover:opacity-70 group-hover:scale-105"
                  }`}
                />
                {/* Glow Effect for Active Card */}
                {activeRole === role.id && (
                  <div
                    className={`absolute inset-0 bg-radial-[at_25%_25%]  bg-accent-foreground opacity-20 rounded-full blur-xl`}
                  ></div>
                )}
              </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-start relative ">
        {/* Left Column */}
        <div className="space-y-8">
          <div
            className={`transition-all duration-500 ${isChanging ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <h2 className="text-4xl lg:text-5xl font-sora-400 text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
              {currentContent.title}  
            </h2>
            {/* Animated Underline */}
            <div
              className={`h-1 bg-gradient-to-r ${activeCard?.color} rounded-full mt-4 transition-all duration-700 ${isChanging ? "w-0" : "w-24"}`}
            ></div>
          </div>
          {/* Call to Action Button */}
          <div
            className={`pt-4 transition-all duration-500 ${
              isChanging
                ? "translate-y-4"
                : "translate-y-0"
            }`}
            style={{ transitionDelay: isChanging ? "0ms" : "200ms" }}
          >
            <Link href="/dashboard">
              <Button
                className={`bg-gradient-to-r bg-vintageBlue/90 hover:shadow-lg hover:scale-105 transition-all duration-300 text-white border-0 px-8 py-3 rounded-xl font-medium`}>
                {currentContent.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {currentContent.features.map((feature, index) => (
            <div
              key={`${activeRole}-${index}`}
              className={`space-y-3 transition-all duration-500 ${
                isChanging
                  ? "opacity-0 translate-x-8"
                  : "opacity-100 translate-x-0"
              }`}
              style={{
                transitionDelay: isChanging ? "0ms" : `${index * 100 + 120}ms`,
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-gray-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
