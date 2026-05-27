"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, DollarSign } from "lucide-react";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import type { TourPackage } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function PackageCard({
  pkg,
  index,
  onSelect,
}: {
  pkg: TourPackage;
  index: number;
  onSelect: (pkg: TourPackage) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { springX, springY, handleMouseMove, handleMouseLeave } =
    useMagneticHover(cardRef, { strength: 0.15, damping: 18, stiffness: 120 });

  return (
    <motion.div
      ref={cardRef}
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: prefersReduced ? 0 : springX,
        y: prefersReduced ? 0 : springY,
      }}
      className="package-card group relative overflow-hidden"
      initial={prefersReduced ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        className="relative flex flex-col overflow-hidden h-full"
        style={{
          borderRadius: "var(--radius-lg)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pkg.image}
            alt={pkg.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(26,26,26,0.7) 0%, transparent 50%)",
            }}
          />
          {/* Duration Badge */}
          <div
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(26,26,26,0.7)",
              backdropFilter: "blur(8px)",
              borderRadius: "var(--radius-pill)",
              color: "var(--color-cream)",
            }}
          >
            <Clock className="h-3 w-3" />
            {pkg.duration}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col" style={{ padding: "32px" }}>
          <h3
            className="font-display text-xl font-semibold mb-2"
            style={{ color: "var(--color-cream)" }}
          >
            {pkg.name}
          </h3>
          <p
            className="text-sm leading-relaxed mb-6 flex-1"
            style={{ color: "var(--color-body)" }}
          >
            {pkg.description.length > 120
              ? pkg.description.substring(0, 120) + "..."
              : pkg.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign
                className="h-4 w-4"
                style={{ color: "var(--color-gold)" }}
              />
              <span
                className="text-lg font-semibold"
                style={{ color: "var(--color-gold)" }}
              >
                {pkg.price}
              </span>
              <span className="text-xs" style={{ color: "var(--color-body)" }}>
                {pkg.currency}
              </span>
            </div>
            <button
              onClick={() => onSelect(pkg)}
              className="inline-flex justify-center items-center font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              style={{
                padding: "16px 32px",
                background: "var(--color-gold)",
                color: "var(--color-volcanic)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px -10px rgba(201, 168, 76, 0.4)",
              }}
            >
              Book now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PackagesProps {
  onSelectPackage: (pkg: TourPackage) => void;
}

export default function Packages({ onSelectPackage }: PackagesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  useEffect(() => {
    fetch("/data/packages.json")
      .then((r) => r.json())
      .then((data: TourPackage[]) => setPackages(data))
      .catch(console.error);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="relative"
      style={{ background: "var(--color-forest)", paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-main">
        <div className="mb-16 max-w-2xl">
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: "var(--color-cream)" }}
          >
            Our Routes
          </h2>
          <p
            className="mt-4 text-base leading-relaxed max-w-lg"
            style={{ color: "var(--color-body)" }}
          >
            Four curated experiences across Costa Rica, each with transport,
            guides, and everything you need for an unforgettable trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "24px" }}>
          {packages.map((pkg, i) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={i}
              onSelect={onSelectPackage}
            />
          ))}
        </div>

        {packages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" style={{ gap: "24px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  height: 420,
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
