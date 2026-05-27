"use client";

import { useCallback } from "react";

interface WhatsAppMessageParams {
  packageName: string;
  date: string;
  travelers: number;
  language: "es" | "en";
}

export function useWhatsAppMessage() {
  const generateUrl = useCallback(
    ({ packageName, date, travelers, language }: WhatsAppMessageParams): string => {
      const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

      const messages = {
        es: `Hola, acabo de realizar mi reserva con Dantica Tours. 🌿\n📍 Destino: ${packageName}\n📅 Fecha de viaje: ${date}\n👥 Viajeros: ${travelers}\n💳 Pago confirmado via PayPal.\nQuedo en espera de la confirmacion. Muchas gracias!`,
        en: `Hello, I just completed my booking with Dantica Tours. 🌿\n📍 Destination: ${packageName}\n📅 Travel date: ${date}\n👥 Travelers: ${travelers}\n💳 Payment confirmed via PayPal.\nLooking forward to your confirmation. Thank you!`,
      };

      const message = messages[language];
      const encodedMessage = encodeURIComponent(message);

      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    },
    []
  );

  return { generateUrl };
}
