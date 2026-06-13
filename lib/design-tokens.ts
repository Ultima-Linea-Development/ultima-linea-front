/**
 * Design Tokens - Sistema de diseño estandarizado
 *
 * Usar estas constantes asegura consistencia en toda la aplicación.
 * Para z-index en Tailwind, preferir style={{ zIndex: zIndex.* }}.
 */

export const zIndex = {
  mobileOverlay: 55,
  mobilePanel: 60,
  imageZoom: 60,
  nav: 50,
  spinner: 100,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 99999,
} as const;

export const sizes = {
  header: {
    height: "4rem",
    offsetTop: "80px",
  },
  container: {
    max: "1920px",
    footer: "1200px",
  },
} as const;
