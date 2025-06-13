"use client";
import { useState, useEffect } from "react";
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
      isMenuOpen && setIsMenuOpen(false); // Close menu if open
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
      className="fixed top-5 left-0 right-0 z-50 bg-accent-foreground/5 backdrop-blur-3xl border border-foreground/10 shadow-lg rounded-xl max-w-[85dvw] mx-auto px-4 py-2"
    >
      <div className="">
        <div className="flex items-center  justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-foreground/20 to-accent-foreground rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">₹</span>
            </div>
            <span className="text-xl font-bold gradient-text">MoneyMind</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-green-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-slate-300 hover:text-green-400 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-green-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-slate-300 hover:text-green-400 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={`/signin`}>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-green-400 hover:bg-green-400/10"
              >
                Login
              </Button>
            </Link>
            <Link href={`/signup`}>
              <Button className="text-slate-900 font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 finance-glow">
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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50">
            <div className="flex flex-col space-y-4 mt-4">
              <a
                href="#features"
                className="text-slate-300 hover:text-green-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-green-400 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-green-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-slate-300 hover:text-green-400 transition-colors"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-green-400 hover:bg-green-200/10 w-full justify-start"
                >
                  Sign In
                </Button>
                <Button className="text-slate-900 font-semibold">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};
