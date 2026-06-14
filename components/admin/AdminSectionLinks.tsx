"use client";

import Link from "next/link";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Icon from "@/components/ui/Icons";
import { getAdminNavItemsForRole } from "@/lib/admin-nav";
import { adminSurfaceInteractiveClassName } from "@/lib/admin-interactive-styles";
import { useAdminRole } from "@/components/admin/AdminRoleProvider";
import { cn } from "@/lib/utils";

export default function AdminSectionLinks() {
  const navItems = getAdminNavItemsForRole(useAdminRole());

  return (
    <nav className="contents">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex h-full min-h-[4.5rem] items-center gap-3 border border-border px-4 py-4 text-muted-foreground",
            adminSurfaceInteractiveClassName(
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )
          )}
        >
          <Box className="shrink-0 text-muted-foreground">
            <Icon name={item.icon} className="size-5" />
          </Box>
          <Typography variant="body2" className="font-medium">
            {item.label}
          </Typography>
        </Link>
      ))}
    </nav>
  );
}
