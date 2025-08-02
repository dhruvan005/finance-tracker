"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import AvatarDropdown from "./AvatarDropdown";

export function BreadcrumbNavigation() {
  const pathname = usePathname();

  // Don't show navigation on landing page and auth pages
  if (
    pathname === "/" ||
    pathname.includes("(auth)") ||
    pathname.includes("signin") ||
    pathname.includes("signup")
  ) {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path;
  };
  const navItems = [
    { path: "/dashboard", label: "Home" },
    { path: "/expense", label: "Expense" },
    { path: "/income", label: "Income" },
    { path: "/future-plan", label: "Goal & Budget" },
    { path: "/ai-coach", label: "AI Coach" },
  ];
  return (
    <div className="w-full py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            {" "}
            {navItems.map((item) => (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className={
                      isActive(item.path)
                        ? "font-medium decoration-primary bg-secondary text-primary-foreground px-3 py-1 rounded-full"
                        : "hover:text-foreground/80 mx-1"
                    }
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <AvatarDropdown />
        </div>
      </div>
    </div>
  );
}
