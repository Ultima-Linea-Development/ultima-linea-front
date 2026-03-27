"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_CONSULT_URL } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_CONSULT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-0 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      aria-label="Consultar por WhatsApp"
    >
      <FaWhatsapp className="h-9 w-9" aria-hidden />
    </a>
  );
}
