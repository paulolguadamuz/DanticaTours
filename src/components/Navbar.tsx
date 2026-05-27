"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Routes", href: "#packages" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(26,26,26,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        }}
        initial={prefersReduced ? { opacity: 1 } : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-main flex h-20 items-center justify-between">
          <a href="#hero" className="font-display text-2xl font-bold tracking-wide text-white">
            DANTICATOURS
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-gold"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#packages"
              className="font-bold uppercase tracking-wider transition-transform hover:-translate-y-1"
              style={{
                padding: "16px 32px",
                borderRadius: "16px",
                background: "var(--color-gold)",
                color: "var(--color-volcanic)",
                boxShadow: "rgba(201, 168, 76, 0.4) 0px 10px 30px -10px",
                fontSize: "14px"
              }}
            >
              Book Now
            </a>
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center pt-20"
            style={{
              background: "var(--color-volcanic)",
            }}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-display text-4xl text-white transition-colors hover:text-gold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#packages"
                className="mt-8 font-bold uppercase tracking-wider transition-transform hover:-translate-y-1"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  background: "var(--color-gold)",
                  color: "var(--color-volcanic)",
                  boxShadow: "rgba(201, 168, 76, 0.4) 0px 10px 30px -10px",
                  fontSize: "14px",
                  textAlign: "center"
                }}
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
