"use client";

// Social Icons as inline SVGs (brand icons removed from lucide-react in v1.x)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--color-volcanic)" }}>
      {/* Wave Divider - cream-colored wave transitioning from Contact section */}
      <div className="w-full" style={{ marginTop: "-1px" }}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "80px", display: "block" }}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="var(--color-cream)"
          />
        </svg>
      </div>

      <div className="container-main py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl font-bold tracking-wide text-white mb-4">
              DANTICA{" "}
              <span style={{ color: "var(--color-gold)" }}>TOURS</span>
            </h2>
            <p className="max-w-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              Curated guided adventures across Costa Rica. We handle the transport
              and logistics so you can focus on the journey.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-6"
              style={{ color: "var(--color-gold)" }}
            >
              Navigation
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#hero" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#packages" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Routes
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-6"
              style={{ color: "var(--color-gold)" }}
            >
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-16 md:mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            &copy; {currentYear} Dantica Tours Costa Rica. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Designed for adventure in Costa Rica.
          </p>
        </div>
      </div>
    </footer>
  );
}
