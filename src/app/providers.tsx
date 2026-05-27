"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLenis } from "@/hooks/useLenis";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize smooth scrolling
  useLenis();

  // Make sure we have a client ID, even a fallback for the provider to render
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture" 
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
