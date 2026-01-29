"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import Main from "@/components/ui/Main";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Main flex={true}>{children}</Main>
      <FooterComponent />
    </>
  );
}
