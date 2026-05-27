"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Packages from "@/components/Packages";
import RouteDetail from "@/components/RouteDetail";
import BookingForm from "@/components/BookingForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { TourPackage } from "@/lib/types";
import packagesData from "../../public/data/packages.json";

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);

  const handleSelectPackage = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
  };

  const handleCloseDetail = () => {
    setSelectedPackage(null);
  };

  const handleBookNow = (pkg: TourPackage) => {
    setBookingPackage(pkg);
    setIsBookingFormOpen(true);
    setSelectedPackage(null); // Close the detail modal
  };

  const handleCloseBooking = () => {
    setIsBookingFormOpen(false);
    setTimeout(() => setBookingPackage(null), 500); // Wait for transition
  };

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Packages onSelectPackage={handleSelectPackage} />
      
      <RouteDetail 
        pkg={selectedPackage} 
        onClose={handleCloseDetail} 
        onBookNow={handleBookNow} 
      />
      
      <BookingForm
        initialPackage={bookingPackage}
        allPackages={packagesData as TourPackage[]}
        isOpen={isBookingFormOpen}
        onClose={handleCloseBooking}
      />
      
      <Contact />
      <Footer />
    </main>
  );
}
