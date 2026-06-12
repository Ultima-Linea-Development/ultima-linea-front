"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminRoleProvider } from "@/components/admin/AdminRoleProvider";
import { checkAdminAuth, redirectForAdminAuth } from "@/lib/check-admin-auth";
import { ONBOARDING_PATH } from "@/lib/auth";

type AdminLayoutClientProps = {
  initialRole: string | null;
  children: React.ReactNode;
};

export default function AdminLayoutClient({
  initialRole,
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = checkAdminAuth(pathname);
    const redirectTo = redirectForAdminAuth(pathname, status);

    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [pathname, router]);

  const isOnboarding = pathname === ONBOARDING_PATH;

  return (
    <AdminRoleProvider initialRole={initialRole}>
      {isOnboarding ? children : <AdminShell>{children}</AdminShell>}
    </AdminRoleProvider>
  );
}
