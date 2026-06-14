import type { Metadata } from "next";
import { fontVariable } from "@/lib/fonts";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { getRoleFromAuthCookie } from "@/lib/server/auth-cookie";
import { NOINDEX_METADATA } from "@/lib/seo";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRole = await getRoleFromAuthCookie();

  return (
    <div
      className={`${fontVariable} flex h-screen min-h-0 flex-col overflow-hidden antialiased`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <AdminLayoutClient initialRole={initialRole}>{children}</AdminLayoutClient>
      </div>
    </div>
  );
}
