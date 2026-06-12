"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icons";
import { adminSurfaceInteractiveClassName } from "@/lib/admin-interactive-styles";
import { cn } from "@/lib/utils";

export default function AdminLogoutLink() {
  return (
    <Link
      href="/logout"
      className={cn(
        "flex w-full cursor-pointer flex-col items-center gap-1 px-2 py-2 text-xs font-medium md:flex-row md:gap-3 md:px-3 md:text-left md:text-sm",
        "text-muted-foreground",
        adminSurfaceInteractiveClassName()
      )}
    >
      <Icon name="logout" className="size-5 shrink-0" />
      <span className="truncate">Cerrar Sesión</span>
    </Link>
  );
}
