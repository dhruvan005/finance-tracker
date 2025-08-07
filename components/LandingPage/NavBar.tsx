"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
      if (isMenuOpen) setIsMenuOpen(false); // Close menu if open
    } else {
      // Scrolling up
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-vintageOffWhiteSecondary/15  w-full px-6 py-4 bg-vintageBlue text-vintageOffWhiteSecondary"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-vintageOffWhiteSecondary/20 rounded-lg flex items-center justify-center">
              <span className="text-vintageOffWhiteSecondary font-bold text-lg">
                ₹
              </span>
            </div>
            <span className="text-xl text-vintageOffWhiteSecondary font-bold">
              Hishab
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-vintageOffWhiteSecondary hover:text-vintageOffWhite transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-vintageOffWhiteSecondary hover:text-vintageOffWhite transition-colors font-medium"
            >
              Features
            </button>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/dashboard`}>
              <Button className="text-slate-900 bg-vintageOffWhiteSecondary hover:bg-vintageOffWhitePrimary font-semibold px-4 py-1 rounded-lg transition-all duration-300 hover:scale-105 finance-glow">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-vintageOffWhiteSecondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pb-4 border-t border-vintageOffWhiteSecondary/30"
          >
            <div className="flex flex-col space-y-4 mt-4">
              {/* Navigation Links - Mobile */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-vintageOffWhiteSecondary hover:text-vintageOffWhite transition-colors font-medium text-left py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-vintageOffWhiteSecondary hover:text-vintageOffWhite transition-colors font-medium text-left py-2"
                >
                  Features
                </button>
              </div>

              {/* CTA Buttons - Mobile */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-vintageOffWhiteSecondary/30">
                <Link href={`/dashboard`}>
                  <Button className="text-slate-900 font-semibold transition-all duration-300 hover:scale-105 finance-glow w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
