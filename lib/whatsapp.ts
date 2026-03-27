/** +54 9 2604 63-8281 en formato internacional para wa.me */
const WHATSAPP_E164 = "5492604638281";

export function buildWhatsAppConsultUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_CONSULT_URL = buildWhatsAppConsultUrl(
  "Hola, quisiera hacer una consulta."
);
