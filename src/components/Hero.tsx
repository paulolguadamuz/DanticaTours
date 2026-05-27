"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowDownRight } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Title split lines reveal (simulated without SplitType for stability)
      const titleLines = titleRef.current?.querySelectorAll(".line-overflow > span");
      if (titleLines) {
        tl.fromTo(
          titleLines,
          { y: "100%" },
          { y: "0%", duration: 1.2, stagger: 0.1 },
          0.2
        );
      }

      // Text reveal
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        0.8
      );

      // Image reveal
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
          { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.5 },
          0.4
        );
      }

      // Bottom nav reveal
      tl.fromTo(
        bottomNavRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-between"
      style={{ background: "var(--color-volcanic)", paddingTop: "128px", paddingBottom: "48px" }}
    >
      <div className="container-main flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Typography */}
          <div className="lg:col-span-7">
            <h1
              ref={titleRef}
              className="font-display font-bold uppercase tracking-tight leading-[0.9]"
              style={{
                fontSize: "clamp(48px, 9vw, 160px)",
                color: "var(--color-white)",
              }}
            >
              <div className="line-overflow overflow-hidden">
                <span className="inline-block">Curated</span>
              </div>
              <div className="line-overflow overflow-hidden">
                <span className="inline-block" style={{ color: "var(--color-gold)" }}>Journeys</span>
              </div>
              <div className="line-overflow overflow-hidden">
                <span className="inline-block">Across</span>
              </div>
              <div className="line-overflow overflow-hidden">
                <span className="inline-block">Costa Rica.</span>
              </div>
            </h1>
          </div>

          {/* Minimalist Context & Image */}
          <div className="lg:col-span-5 flex flex-col gap-10 lg:pb-4">
            <p
              ref={textRef}
              className="font-body text-base md:text-lg leading-relaxed max-w-sm"
              style={{ color: "var(--color-body)" }}
            >
              We design and execute flawless guided adventures. From the volcanic highlands to the Pacific shores, we handle the logistics so you can focus entirely on the experience.
            </p>

            <div 
              ref={imageRef} 
              className="relative w-full overflow-hidden"
              style={{ 
                aspectRatio: "16/9", 
                borderRadius: "var(--radius-sm)"
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1518182170546-076616fdcbdd?w=1200&h=800&fit=crop&q=80"
                alt="Costa Rica minimal landscape"
                className="w-full h-full object-cover grayscale-[20%] contrast-125"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Grid Navigation */}
      <div 
        ref={bottomNavRef}
        className="container-main mt-16"
      >
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>Scroll</span>
              <span className="text-sm font-medium" style={{ color: "var(--color-body)" }}>To explore routes</span>
            </div>
            <ArrowDownRight className="w-5 h-5 text-white/50" />
          </div>

          <a
            href="#packages"
            className="group flex items-center justify-center gap-3 font-bold uppercase tracking-wider transition-transform hover:-translate-y-1"
            style={{ 
              padding: "16px 32px",
              borderRadius: "16px",
              background: "var(--color-gold)",
              color: "var(--color-volcanic)",
              boxShadow: "rgba(201, 168, 76, 0.4) 0px 10px 30px -10px"
            }}
          >
            <span className="text-sm">Start your journey</span>
          </a>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110 md:h-16 md:w-16"
        style={{ background: "var(--color-whatsapp)" }}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-white md:h-7 md:w-7" fill="white" />
      </a>
    </section>
  );
}
