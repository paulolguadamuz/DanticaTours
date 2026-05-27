"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { X, ChevronLeft, MessageCircle, Calendar, Users, Globe, User, Mail, Phone } from "lucide-react";
import { useWhatsAppMessage } from "@/hooks/useWhatsAppMessage";
import type { TourPackage } from "@/lib/types";

// Validation Schemas
const step1Schema = z.object({
  packageId: z.string().min(1, "Please select a route"),
  packageName: z.string(),
});

const step2Schema = z.object({
  travelDate: z.string().min(1, "Travel date is required"),
  travelers: z.number().min(1, "At least 1 traveler").max(20, "Max 20 travelers"),
  language: z.enum(["es", "en"]),
});

const step3Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  initialPackage: TourPackage | null;
  allPackages: TourPackage[];
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingForm({
  initialPackage,
  allPackages,
  isOpen,
  onClose,
}: BookingFormProps) {
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalData, setFinalData] = useState<FormValues | null>(null);
  const [{ isPending }] = usePayPalScriptReducer();
  const { generateUrl } = useWhatsAppMessage();

  const {
    register,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageId: "",
      packageName: "",
      travelDate: "",
      travelers: 2,
      language: "en",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const watchPackageId = watch("packageId");
  const watchLanguage = watch("language");
  const watchTravelers = watch("travelers");
  const selectedPackage = allPackages.find((p) => p.id === watchPackageId);

  useEffect(() => {
    if (initialPackage && isOpen) {
      setValue("packageId", initialPackage.id);
      setValue("packageName", initialPackage.name);
      if (step === 1) setStep(2);
    }
  }, [initialPackage, isOpen, setValue, step]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setFinalData(null);
        reset();
      }, 500);
    }
  }, [isOpen, reset]);

  const handleNext = async () => {
    const schemas = [step1Schema, step2Schema, step3Schema];
    const fieldsToValidate = Object.keys(schemas[step - 1].shape) as any;
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const createOrder = async (data: any, actions: any) => {
    if (!selectedPackage) throw new Error("No package selected");
    const amount = (selectedPackage.price * watch("travelers")).toFixed(2);
    
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: selectedPackage.currency,
            value: amount,
          },
          description: `Dantica Tours Booking`,
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const orderData = await response.json();

      if (orderData.error) throw new Error(orderData.error);

      if (orderData.status === "COMPLETED") {
        setFinalData(watch());
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("PayPal Capture Error:", err);
      alert("Payment capture failed. Please try again or contact support.");
    }
  };

  if (!isOpen) return null;

  const totalAmount = selectedPackage ? selectedPackage.price * (watchTravelers || 1) : 0;
  const progress = (step / 3) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: "16px" }}>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(10, 15, 12, 0.85)", backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        className="relative w-full flex flex-col md:flex-row overflow-hidden"
        style={{
          background: "var(--color-volcanic)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          maxWidth: "1000px",
          height: "85vh",
          maxHeight: "800px",
        }}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Side: Visuals & Summary (Hidden on small mobile) */}
        <div 
          className="hidden md:flex md:w-5/12 relative flex-col justify-between"
          style={{ 
            background: "var(--color-forest)",
            padding: "40px"
          }}
        >
          {selectedPackage ? (
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedPackage.image} alt="Route" className="w-full h-full object-cover opacity-40 grayscale-[30%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-forest to-volcanic opacity-50" />
          )}

          <div className="relative z-10">
            <h3 className="font-display text-4xl text-white font-bold leading-tight">
              {selectedPackage ? selectedPackage.name : "Design Your Journey"}
            </h3>
            {selectedPackage && (
              <p className="mt-4 text-white/70">{selectedPackage.duration}</p>
            )}
          </div>

          <div className="relative z-10">
            {selectedPackage && step > 1 && (
              <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">Travelers</span>
                  <span className="text-white font-semibold">{watchTravelers || 1}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-bold" style={{ color: "var(--color-gold)" }}>
                    ${totalAmount} <span className="text-sm font-normal">{selectedPackage.currency}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 flex flex-col relative" style={{ background: "var(--color-volcanic)" }}>
          
          {/* Progress Bar */}
          {!isSuccess && (
            <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ background: "var(--color-gold)", width: `${progress}%` }}
              />
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute z-20 flex items-center justify-center rounded-full transition-colors"
            style={{ 
              top: "24px", right: "24px", 
              width: "40px", height: "40px", 
              background: "rgba(255,255,255,0.05)",
              color: "white"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "40px 32px" }}>
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key={`step-${step}`}
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Step 1: Route Selection */}
                  {step === 1 && (
                    <div className="flex-1 max-w-lg mx-auto w-full">
                      <h2 className="font-display text-3xl font-bold mb-8 text-white">Select a Route</h2>
                      <div className="space-y-4">
                        {allPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setValue("packageId", pkg.id);
                              setValue("packageName", pkg.name);
                            }}
                            className="flex cursor-pointer items-center gap-4 p-4 transition-all"
                            style={{
                              borderRadius: "16px",
                              border: "1px solid",
                              borderColor: watchPackageId === pkg.id ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                              background: watchPackageId === pkg.id ? "rgba(201, 168, 76, 0.05)" : "rgba(255,255,255,0.02)",
                            }}
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{pkg.name}</h3>
                              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>${pkg.price} {pkg.currency}</p>
                            </div>
                            <div 
                              className="w-6 h-6 rounded-full border flex items-center justify-center"
                              style={{ borderColor: watchPackageId === pkg.id ? "var(--color-gold)" : "rgba(255,255,255,0.2)" }}
                            >
                              {watchPackageId === pkg.id && <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-gold)" }} />}
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.packageId && (
                        <p className="mt-4 text-sm text-center" style={{ color: "#ef4444" }}>{errors.packageId.message}</p>
                      )}
                    </div>
                  )}

                  {/* Step 2: Trip Details */}
                  {step === 2 && (
                    <div className="flex-1 max-w-lg mx-auto w-full">
                      <h2 className="font-display text-3xl font-bold mb-8 text-white">Trip Details</h2>
                      
                      <div className="space-y-6">
                        {/* Date */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                            <Calendar className="w-4 h-4" style={{ color: "var(--color-gold)" }} /> Date of Travel
                          </label>
                          <input
                            type="date"
                            {...register("travelDate")}
                            className="w-full transition-all focus:outline-none"
                            style={{
                              padding: "16px 20px",
                              borderRadius: "16px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "white",
                              colorScheme: "dark"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--color-gold)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                          />
                          {errors.travelDate && <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>{errors.travelDate.message}</p>}
                        </div>

                        {/* Travelers */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                            <Users className="w-4 h-4" style={{ color: "var(--color-gold)" }} /> Travelers
                          </label>
                          <input
                            type="number"
                            min="1" max="20"
                            {...register("travelers", { valueAsNumber: true })}
                            className="w-full transition-all focus:outline-none"
                            style={{
                              padding: "16px 20px",
                              borderRadius: "16px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "white",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--color-gold)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                          />
                          {errors.travelers && <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>{errors.travelers.message}</p>}
                        </div>

                        {/* Language */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                            <Globe className="w-4 h-4" style={{ color: "var(--color-gold)" }} /> Guide Language
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <label 
                              className="flex cursor-pointer items-center justify-center transition-all"
                              style={{
                                padding: "16px",
                                borderRadius: "16px",
                                border: "1px solid",
                                borderColor: watchLanguage === "en" ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                background: watchLanguage === "en" ? "rgba(201, 168, 76, 0.05)" : "rgba(255,255,255,0.02)",
                                color: "white"
                              }}
                            >
                              <input type="radio" value="en" {...register("language")} className="hidden" />
                              <span className="font-semibold">English</span>
                            </label>
                            <label 
                              className="flex cursor-pointer items-center justify-center transition-all"
                              style={{
                                padding: "16px",
                                borderRadius: "16px",
                                border: "1px solid",
                                borderColor: watchLanguage === "es" ? "var(--color-gold)" : "rgba(255,255,255,0.08)",
                                background: watchLanguage === "es" ? "rgba(201, 168, 76, 0.05)" : "rgba(255,255,255,0.02)",
                                color: "white"
                              }}
                            >
                              <input type="radio" value="es" {...register("language")} className="hidden" />
                              <span className="font-semibold">Español</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Contact & Payment */}
                  {step === 3 && (
                    <div className="flex-1 max-w-lg mx-auto w-full">
                      <h2 className="font-display text-3xl font-bold mb-8 text-white">Finalize Booking</h2>
                      
                      <div className="space-y-4 mb-8">
                        <div>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                              type="text"
                              placeholder="Full Name"
                              {...register("fullName")}
                              className="w-full transition-all focus:outline-none"
                              style={{
                                padding: "16px 20px 16px 48px",
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "white",
                              }}
                              onFocus={(e) => e.target.style.borderColor = "var(--color-gold)"}
                              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                            />
                          </div>
                          {errors.fullName && <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{errors.fullName.message}</p>}
                        </div>

                        <div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                              type="email"
                              placeholder="Email Address"
                              {...register("email")}
                              className="w-full transition-all focus:outline-none"
                              style={{
                                padding: "16px 20px 16px 48px",
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "white",
                              }}
                              onFocus={(e) => e.target.style.borderColor = "var(--color-gold)"}
                              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                            />
                          </div>
                          {errors.email && <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{errors.email.message}</p>}
                        </div>

                        <div>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                              type="tel"
                              placeholder="Phone (incl. country code)"
                              {...register("phone")}
                              className="w-full transition-all focus:outline-none"
                              style={{
                                padding: "16px 20px 16px 48px",
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "white",
                              }}
                              onFocus={(e) => e.target.style.borderColor = "var(--color-gold)"}
                              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                            />
                          </div>
                          {errors.phone && <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{errors.phone.message}</p>}
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="mt-8">
                        {isPending ? (
                          <div className="flex justify-center p-6">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--color-gold)", borderTopColor: "transparent" }} />
                          </div>
                        ) : (
                          <div className="relative z-0">
                            <PayPalButtons
                              style={{ layout: "vertical", shape: "pill", color: "gold" }}
                              createOrder={createOrder}
                              onApprove={onApprove}
                              forceReRender={[totalAmount, selectedPackage?.currency]}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full max-w-lg mx-auto"
                >
                  <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full" style={{ background: "rgba(201, 168, 76, 0.1)", color: "var(--color-gold)" }}>
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  
                  <h2 className="font-display text-4xl font-bold text-white mb-4">Confirmed!</h2>
                  <p className="text-white/70 mb-10 text-lg">
                    Your booking was successful. Let's finish the logistics via WhatsApp.
                  </p>

                  <div className="w-full space-y-4">
                    <a
                      href={finalData ? generateUrl({
                        packageName: finalData.packageName,
                        date: finalData.travelDate,
                        travelers: finalData.travelers,
                        language: finalData.language,
                      }) : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-3 font-semibold transition-transform hover:-translate-y-1"
                      style={{ 
                        padding: "20px",
                        borderRadius: "16px",
                        background: "var(--color-whatsapp)", 
                        color: "white",
                        boxShadow: "0 10px 30px -10px rgba(37, 211, 102, 0.4)" 
                      }}
                      onClick={() => setTimeout(onClose, 1000)}
                    >
                      <MessageCircle className="h-6 w-6" />
                      Send Confirmation
                    </a>
                    
                    <button
                      onClick={onClose}
                      className="w-full font-semibold text-white transition-colors hover:bg-white/5"
                      style={{
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {!isSuccess && (
            <div 
              className="flex items-center justify-between mt-auto" 
              style={{ 
                padding: "24px 32px",
                borderTop: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              {step > 1 ? (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 font-semibold transition-colors"
                  style={{ 
                    padding: "16px 24px",
                    color: "rgba(255,255,255,0.6)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div /> 
              )}
              
              {step < 3 && (
                <button
                  onClick={handleNext}
                  className="font-bold transition-transform hover:-translate-y-1"
                  style={{ 
                    padding: "16px 32px",
                    borderRadius: "16px",
                    background: "var(--color-gold)", 
                    color: "var(--color-volcanic)", 
                    boxShadow: "0 10px 30px -10px rgba(201, 168, 76, 0.4)" 
                  }}
                >
                  Continue
                </button>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
