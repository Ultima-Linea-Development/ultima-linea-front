"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminLogoutLink() {
  return (
    <Link
      href="/logout"
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
        "text-muted-foreground w-full text-left"
      )}
    >
      <span>Cerrar Sesión</span>
    </Link>
  );
}
