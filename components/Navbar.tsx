"use client";

import { Home, Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

type NavbarProps = {
  onNavigate: (id: string) => void;
  onReturnHome: () => void;
  isVisible: boolean;
  activeSection?: string;
};

export function Navbar({ onNavigate, onReturnHome, isVisible, activeSection = "" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className="fixed inset-x-0 top-0 z-50 px-2 py-2 sm:px-6 lg:px-8 opacity-100"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-border/80 bg-background/70 px-2 py-2 pr-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-4">
            {/* Left: Home Button + Profile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Home Button - Returns to landing page */}
              <motion.button
                type="button"
                onClick={onReturnHome}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted transition hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Return to landing page"
              >
                <Home className="h-4 w-4" />
              </motion.button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => handleNavClick("about")}
                className="flex items-center gap-2 rounded-full px-1 sm:px-2 py-1 transition hover:bg-white/5"
              >
                <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full border border-accent/30 shadow-lg">
                  <Image
                    src="/BENKHAIR%20NAJIR.jpg"
                    alt="BENKHAIR NAJIR"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-semibold text-foreground">BENKHAIR NAJIR</p>
                </div>
              </button>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-accent/15"
                        layoutId="activeNav"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Right: Theme Toggle + Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <motion.button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted transition hover:border-accent/50 hover:text-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden absolute left-2 right-2 top-full mt-2 rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <motion.button
                        key={link.id}
                        type="button"
                        onClick={() => handleNavClick(link.id)}
                        className={`rounded-xl px-4 py-3 text-left text-base font-medium transition ${
                          isActive
                            ? "bg-accent/15 text-foreground"
                            : "text-muted hover:bg-surface/60 hover:text-foreground"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.label}
                      </motion.button>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
