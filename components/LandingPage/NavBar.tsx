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

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-5 left-0 right-0 z-50  backdrop-blur-3xl border border-vintageOffWhiteSecondary/30 rounded-2xl shadow-lg  max-w-[85dvw] mx-auto px-5  py-3"
    >
      <div className="">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-vintageOffWhiteSecondary/20 rounded-lg flex items-center justify-center">
              <span className="text-vintageOffWhiteSecondary font-bold text-lg">
                ₹
              </span>
            </div>
            <span className="text-xl text-vintageOffWhiteSecondary font-bold ">
              MoneyMind
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/dashboard`}>
              <Button
                variant="ghost"
                className="text-vintageOffWhiteSecondary hover:text-vintageOffWhite hover:bg-vintageOffWhitePrimary transition-colors px-6 py-2 rounded-lg font-semibold"
              >
                Login
              </Button>
            </Link>
            <Link href={`/signup`}>
              <Button className="text-slate-900 bg-vintageOffWhiteSecondary hover:bg-vintageOffWhitePrimary font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 finance-glow">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>{" "}
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-vintageOffWhiteSecondary/30">
            <div className="flex flex-col w-full space-y-4 mt-4">
              <div className="flex flex-col  space-y-2 pt-4">
                <Link href={`/dashboard`}>
                  <Button
                    variant="ghost"
                    className="text-vintageBlue hover:text-vintageOffWhiteSecondary transition-colors bg-vintageOffWhiteSecondary w-full "
                  >
                    Login
                  </Button>
                </Link>
                <Link href={`/signup`}>
                  <Button className="text-slate-900 font-semibold transition-all duration-300 hover:scale-105 finance-glow w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};
