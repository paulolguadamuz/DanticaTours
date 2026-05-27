"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  MapPin,
  Coffee,
  Home,
  Mountain,
  Waves,
  TreePine,
  Leaf,
  Moon,
  Bird,
  Apple,
  UtensilsCrossed,
  Eye,
  Store,
  Palmtree,
  Sun,
  Sailboat,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { TourPackage } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<any>> = {
  "map-pin": MapPin,
  coffee: Coffee,
  home: Home,
  mountain: Mountain,
  waves: Waves,
  trees: TreePine,
  leaf: Leaf,
  moon: Moon,
  bird: Bird,
  apple: Apple,
  utensils: UtensilsCrossed,
  eye: Eye,
  store: Store,
  palmtree: Palmtree,
  sun: Sun,
  sailboat: Sailboat,
};

function LeafletMap({ pkg }: { pkg: TourPackage }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current) return;

      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: pkg.center,
        zoom: 11,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "",
          maxZoom: 19,
        }
      ).addTo(map);

      // Route polyline
      if (pkg.coordinates.length > 1) {
        L.polyline(pkg.coordinates, {
          color: "#C9A84C",
          weight: 3,
          opacity: 0.8,
          dashArray: "8, 8",
        }).addTo(map);
      }

      // Markers
      const goldIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;background:#C9A84C;border:3px solid #1A1A1A;border-radius:50%;box-shadow:0 0 10px rgba(201,168,76,0.6)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      pkg.coordinates.forEach((coord) => {
        L.marker(coord, { icon: goldIcon }).addTo(map);
      });

      // Fit bounds
      if (pkg.coordinates.length > 1) {
        const bounds = L.latLngBounds(pkg.coordinates);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapInstance.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [pkg]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        style={{
          borderRadius: "24px",
          overflow: "hidden",
        }}
      />
    </>
  );
}

interface RouteDetailProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onBookNow: (pkg: TourPackage) => void;
}

export default function RouteDetail({
  pkg,
  onClose,
  onBookNow,
}: RouteDetailProps) {
  const prefersReduced = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeft.current = galleryRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    galleryRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (pkg) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pkg]);

  return (
    <AnimatePresence>
      {pkg && (
        <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center px-4 pt-16 pb-4 md:py-8">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(10,15,12,0.85)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Fullscreen Modern Modal */}
          <motion.div
            data-lenis-prevent
            className="relative w-full h-full max-w-7xl flex flex-col overflow-y-auto"
            style={{
              background: "var(--color-volcanic)",
              borderRadius: "32px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Floating Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(26,26,26,0.5)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white"
              }}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Cinematic Hero */}
            <div className="relative w-full h-[50vh] md:h-[60vh] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pkg.gallery[0]}
                alt={pkg.name}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, rgba(26,26,26,0.1) 0%, var(--color-volcanic) 100%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end" style={{ padding: "64px" }}>
                <h2
                  className="font-display font-bold uppercase tracking-tight leading-[0.9]"
                  style={{ color: "var(--color-white)", fontSize: "clamp(48px, 6vw, 100px)" }}
                >
                  {pkg.name}
                </h2>
                <div className="flex items-center gap-6 mt-8">
                  <span className="font-semibold text-lg" style={{ color: "var(--color-gold)" }}>{pkg.duration}</span>
                  <div className="h-2 w-2 rounded-full" style={{ background: "var(--color-body)" }} />
                  <span className="font-semibold text-lg" style={{ color: "var(--color-white)" }}>Starting at ${pkg.price} {pkg.currency}</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1" style={{ padding: "64px", paddingBottom: "160px" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "96px" }}>
                
                {/* Left Column: Description & Itinerary */}
                <div className="lg:col-span-6 space-y-20">
                  <div>
                    <p
                      className="text-lg md:text-xl leading-relaxed"
                      style={{ color: "var(--color-body)" }}
                    >
                      {pkg.description}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-bold uppercase tracking-widest mb-12"
                      style={{ color: "var(--color-gold)" }}
                    >
                      The Journey
                    </h3>
                    
                    <div className="relative">
                      {pkg.itinerary.map((stop, i) => {
                        const IconComponent = iconMap[stop.icon] || MapPin;
                        return (
                          <div key={i} className="relative flex gap-8 mb-16 last:mb-0">
                            {/* Line connecting nodes */}
                            {i !== pkg.itinerary.length - 1 && (
                              <div className="absolute top-14 bottom-[-64px] left-6 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                            )}
                            
                            {/* Icon Node */}
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl relative z-10"
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              <IconComponent className="h-5 w-5" style={{ color: "var(--color-gold)" }} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pt-2">
                              <div className="flex items-center gap-4 mb-3">
                                <h4 className="font-display text-2xl font-bold text-white">
                                  {stop.stop}
                                </h4>
                                {stop.distance !== "Start" && (
                                  <span
                                    className="text-xs px-3 py-1 font-semibold tracking-wider uppercase rounded-full"
                                    style={{
                                      background: "rgba(201, 168, 76, 0.1)",
                                      color: "var(--color-gold)",
                                    }}
                                  >
                                    {stop.distance}
                                  </span>
                                )}
                              </div>
                              <p className="text-base leading-relaxed" style={{ color: "var(--color-body)" }}>
                                {stop.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Map, Included & Gallery */}
                <div className="lg:col-span-6 space-y-20">
                  
                  {/* Map */}
                  <div>
                    <h3
                      className="text-sm font-bold uppercase tracking-widest mb-8"
                      style={{ color: "var(--color-gold)" }}
                    >
                      Route Map
                    </h3>
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                      <LeafletMap pkg={pkg} />
                    </div>
                  </div>

                  {/* Included / Price Details */}
                  <div>
                    <h3
                      className="text-sm font-bold uppercase tracking-widest mb-8"
                      style={{ color: "var(--color-gold)" }}
                    >
                      What's Included
                    </h3>
                    <div 
                      className="rounded-3xl"
                      style={{ 
                        padding: "32px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)"
                      }}
                    >
                      <ul className="space-y-6">
                        <li className="flex justify-between items-center pb-6 border-b border-white/5">
                          <span className="text-lg text-white/70">Base rate per person</span>
                          <span className="text-lg font-semibold text-white">${pkg.price} {pkg.currency}</span>
                        </li>
                        <li className="flex justify-between items-center pb-6 border-b border-white/5">
                          <span className="text-lg text-white/70">Luxury transport</span>
                          <span className="text-lg font-semibold" style={{ color: "var(--color-gold)" }}>Included</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-lg text-white/70">Professional guide</span>
                          <span className="text-lg font-semibold" style={{ color: "var(--color-gold)" }}>Included</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

              {/* Spectacular Gallery Section */}
              <div className="mt-20 lg:mt-32">
                <h3
                  className="text-sm font-bold uppercase tracking-widest mb-12"
                  style={{ color: "var(--color-gold)" }}
                >
                  Visuals
                </h3>
                <div
                  ref={galleryRef}
                  className="flex pb-8 overflow-x-auto snap-x snap-mandatory"
                  style={{ 
                    gap: "24px",
                    cursor: isDragging ? "grabbing" : "grab",
                    scrollbarWidth: "none", // Firefox
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {pkg.gallery.slice(1).map((src, i) => ( // Skip the first image as it's the hero
                    <div
                      key={i}
                      className="shrink-0 snap-center rounded-3xl overflow-hidden"
                      style={{
                        width: "80vw",
                        maxWidth: "600px",
                        aspectRatio: "4/3",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${pkg.name} photo ${i + 1}`}
                        className="h-full w-full object-cover pointer-events-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Floating Action Button for Booking */}
            <div 
              className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none"
            >
              <button
                onClick={() => {
                  onClose(); // Optional: close detail
                  setTimeout(() => onBookNow(pkg), 50); // Small delay to let modal exit cleanly
                }}
                className="group pointer-events-auto flex items-center justify-center gap-4 font-bold uppercase tracking-widest transition-transform hover:-translate-y-1 shadow-2xl"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  background: "var(--color-gold)",
                  color: "var(--color-volcanic)",
                  boxShadow: "rgba(201, 168, 76, 0.4) 0px 10px 30px -10px",
                  fontSize: "14px"
                }}
              >
                Reserve Route
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
