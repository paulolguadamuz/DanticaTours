"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Contact form submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section id="contact" className="relative" style={{ background: "var(--color-cream)", paddingTop: "120px", paddingBottom: "120px" }}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "64px" }}>
          
          {/* Left Sticky Copy */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              <p
                className="section-label mb-6"
                style={{ color: "var(--color-gold)" }}
              >
                Start your journey
              </p>
              <h2
                className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8"
                style={{ color: "var(--color-volcanic)" }}
              >
                Let&apos;s build your Costa Rican adventure.
              </h2>
              <p
                className="text-lg mb-12 leading-relaxed"
                style={{ color: "rgba(26,26,26,0.65)" }}
              >
                Whether you know exactly what you want or need help planning
                the perfect route, our team is ready to assist.
              </p>

              <div className="space-y-10">
                <div>
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: "rgba(26,26,26,0.5)" }}
                  >
                    National Tourists
                  </h3>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 font-bold uppercase tracking-wider transition-transform hover:-translate-y-1"
                    style={{ padding: "16px 32px", borderRadius: "16px", background: "var(--color-whatsapp)", color: "white", boxShadow: "rgba(37, 211, 102, 0.4) 0px 10px 30px -10px", fontSize: "14px" }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </div>

                <div>
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: "rgba(26,26,26,0.5)" }}
                  >
                    Email
                  </h3>
                  <a
                    href="mailto:hello@danticatours.com"
                    className="text-2xl font-display transition-colors hover:opacity-70"
                    style={{ color: "var(--color-volcanic)" }}
                  >
                    hello@danticatours.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div 
              style={{ 
                padding: "48px",
                background: "var(--color-white)", 
                borderRadius: "24px",
                boxShadow: "0 20px 40px -20px rgba(26,26,26,0.05)"
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "var(--color-volcanic)" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full rounded-xl focus:outline-none transition-all"
                    style={{
                      padding: "16px 24px",
                      background: "rgba(26,26,26,0.03)",
                      color: "var(--color-volcanic)",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)", e.target.style.background = "transparent")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent", e.target.style.background = "rgba(26,26,26,0.03)")}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm animate-shake" style={{ color: "#DC2626" }}>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "var(--color-volcanic)" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-xl focus:outline-none transition-all"
                    style={{
                      padding: "16px 24px",
                      background: "rgba(26,26,26,0.03)",
                      color: "var(--color-volcanic)",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)", e.target.style.background = "transparent")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent", e.target.style.background = "rgba(26,26,26,0.03)")}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm animate-shake" style={{ color: "#DC2626" }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "var(--color-volcanic)" }}
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full rounded-xl focus:outline-none transition-all resize-none"
                    style={{
                      padding: "16px 24px",
                      background: "rgba(26,26,26,0.03)",
                      color: "var(--color-volcanic)",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)", e.target.style.background = "transparent")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent", e.target.style.background = "rgba(26,26,26,0.03)")}
                    placeholder="Tell us about your travel plans..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm animate-shake" style={{ color: "#DC2626" }}>
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-3 font-bold uppercase tracking-wider transition-transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                  style={{
                    padding: "16px 32px",
                    borderRadius: "16px",
                    background: "var(--color-gold)",
                    color: "var(--color-volcanic)",
                    boxShadow: "rgba(201, 168, 76, 0.4) 0px 10px 30px -10px",
                    fontSize: "14px"
                  }}
                >
                  {isSubmitting ? (
                    <div
                      className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                      style={{ borderColor: "var(--color-volcanic)", borderTopColor: "transparent" }}
                    />
                  ) : isSuccess ? (
                    "Message Sent Successfully"
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {isSuccess && (
                  <p className="text-sm font-medium text-center mt-4" style={{ color: "var(--color-forest)" }}>
                    Thanks for reaching out! We will get back to you shortly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
