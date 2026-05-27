"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1580237072353-751f8263ea29?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=700&fit=crop&q=80",
];

const missionText =
  "We believe every road in Costa Rica tells a story. Dantica Tours connects travelers with the raw beauty of our land, from volcanic highlands to Pacific shores, through guided experiences that honor nature, local communities, and the spirit of adventure.";

export default function About() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="about"
      className="relative"
      style={{ background: "var(--color-forest)", paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="container-main">
        {/* Mission Statement */}
        <div className="mb-20 lg:mb-28 max-w-4xl">
          <motion.p
            className="section-label mb-8"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Mission
          </motion.p>
          <motion.p
            className="font-display text-3xl md:text-4xl lg:text-5xl leading-snug"
            style={{ color: "var(--color-cream)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {missionText}
          </motion.p>
        </div>

        {/* Staggered Images */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "32px" }}>
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="overflow-hidden"
              style={{
                borderRadius: "var(--radius-lg)",
                aspectRatio: "3/4",
                marginTop: i === 1 ? "48px" : "0",
              }}
              initial={prefersReduced ? false : { opacity: 0, y: 40, clipPath: "inset(20% 0 0 0)" }}
              whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Costa Rica landscape ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
