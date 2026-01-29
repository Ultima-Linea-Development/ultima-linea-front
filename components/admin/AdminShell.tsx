"use client";

import Box from "@/components/layout/Box";
import Logo from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import AdminNavLink from "./AdminNavLink";
import AdminLogoutLink from "./AdminLogoutLink";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <Box display="flex" className="h-full">
      <aside
        className={cn(
          "w-64 border-r border-border bg-background p-6 h-full overflow-y-auto flex flex-col"
        )}
      >
        <Box display="flex" direction="col" gap="8" className="flex-1">
          <Box>
            <Logo />
          </Box>
          <nav className="flex flex-col gap-1">
            <AdminNavLink href="/admin">Inicio</AdminNavLink>
            <AdminNavLink href="/admin/products">Productos</AdminNavLink>
          </nav>
        </Box>
        <Box className="mt-auto pt-4 border-t border-border">
          <AdminLogoutLink />
        </Box>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </Box>
  );
}
