"use client";

import Box from "@/components/layout/Box";
import Logo from "@/components/brand/Logo";
import Icon from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import AdminNavLink from "./AdminNavLink";
import AdminLogoutLink from "./AdminLogoutLink";
import AdminMainContent from "./AdminMainContent";
import { getAdminNavItemsForRole } from "@/lib/admin-nav";
import { useAdminRole } from "@/components/admin/AdminRoleProvider";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const navItems = getAdminNavItemsForRole(useAdminRole());

  return (
    <Box
      display="flex"
      align="stretch"
      className="h-full min-h-0 min-w-0 flex-col overflow-x-hidden md:flex-row"
    >
      {/* Sidebar: solo desktop */}
      <aside
        className={cn(
          "hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-background md:p-6 md:h-full md:overflow-y-auto"
        )}
      >
        <Box display="flex" direction="col" gap="8" className="flex-1">
          <Box>
            <Logo />
          </Box>
          <nav className="flex w-full flex-col gap-1">
            {navItems.map((item) => (
              <AdminNavLink
                key={item.href}
                href={item.href}
                icon={<Icon name={item.icon} className="size-5" />}
              >
                {item.label}
              </AdminNavLink>
            ))}
          </nav>
        </Box>
        <Box className="mt-auto w-full border-t border-border pt-4">
          <AdminLogoutLink />
        </Box>
      </aside>

      <AdminMainContent>{children}</AdminMainContent>

      {/* Barra inferior: solo mobile */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 flex md:hidden flex-row items-center justify-around border-t border-border bg-background p-2 h-16",
          "pb-[env(safe-area-inset-bottom,0)]"
        )}
      >
        <nav className="flex flex-row items-center justify-around gap-1 w-full [&>a]:flex-1 [&>a]:justify-center [&>a]:text-center [&>a]:min-w-0 [&>a]:py-2 [&>a]:!text-center">
          {navItems.map((item) => (
            <AdminNavLink
              key={item.href}
              href={item.href}
              icon={<Icon name={item.icon} className="size-5" />}
            >
              {item.label}
            </AdminNavLink>
          ))}
          <AdminLogoutLink />
        </nav>
      </aside>
    </Box>
  );
}
