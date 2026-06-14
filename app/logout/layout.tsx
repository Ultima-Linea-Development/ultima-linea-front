import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Cerrar sesión",
};

export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
