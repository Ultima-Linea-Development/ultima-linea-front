import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { fontVariable } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Última Línea",
  description:
    "Última Línea - Tienda especializada en camisetas de fútbol retro y actuales. Encuentra camisetas oficiales de los mejores equipos y selecciones del mundo. Catálogo completo de camisetas vintage, clásicas y de temporada actual. Envíos a todo el país.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fontVariable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
