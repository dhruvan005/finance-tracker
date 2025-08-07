import Image from "next/image";
import {
  Search,
  Star,
  BarChart3,
  FileSpreadsheet,
  Palette,
  Database,
  Brain,
  Undo2,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DynamicDashboard() {
 const features = [
  {
    id: 1,
    title: "Smart Expense Tracking",
    description: "Automatically categorize and track your daily expenses with AI-powered insights",
    image: "/assets/filling-survey.svg",
    category: "Tracking",
    size: "medium",
  },
  {
    id: 2,
    title: "Income Management",
    description: "Monitor multiple income streams and optimize your earning potential",
    image: "/assets/stack-of-money.svg",
    category: "Income",
    size: "medium",
  },
  {
    id: 3,
    title: "Budget Creation",
    description: "Create flexible budgets that adapt to your lifestyle and financial goals",
    image: "/assets/payment-processed.svg",
    category: "Budgeting",
    size: "small",
  },
  {
    id: 4,
    title: "Savings Goals",
    description: "Set and achieve your savings targets with personalized recommendations and progress tracking",
    image: "/assets/cryptowallets-showing.svg",
    category: "Savings",
    size: "large",
  },
  {
    id: 5,
    title: "Analytics & Reports",
    description: "Visualize your financial patterns with beautiful charts and comprehensive insights",
    image: "/assets/analyze-data.svg",
    category: "Analytics",
    size: "medium",
  },
  {
    id: 6,
    title: "Smart Alerts",
    description: "Never miss a payment or exceed your budget with intelligent notifications and reminders",
    image: "/assets/credit-card-declined (1).svg",
    category: "Alerts",
    size: "medium",
  },
  {
    id: 7,
    title: "Transaction History",
    description: "Access detailed transaction records with advanced search and filtering options",
    image: "/assets/filling-survey.svg",
    category: "History",
    size: "small",
  },
  {
    id: 8,
    title: "Receipt Scanner",
    description: "Convert physical receipts to digital records with automatic expense categorization",
    image: "/assets/payment-processed.svg",
    category: "Scanning",
    size: "small",
  },
];

  const getCardClasses = (size: string) => {
    switch (size) {
      case "large":
        return "col-span-1 md:col-span-2 lg:col-span-2 row-span-2";
      case "medium":
        return "col-span-1 md:col-span-1 lg:col-span-1 row-span-1";
      case "small":
        return "col-span-1 row-span-1";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  auto-rows-min">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className={`${getCardClasses(feature.size)} group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 line-clamp-3">
                {feature.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="relative overflow-hidden bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
