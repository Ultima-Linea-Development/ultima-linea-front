"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavLinkClassName } from "@/lib/admin-interactive-styles";
import { cn } from "@/lib/utils";

type AdminNavLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export default function AdminNavLink({
  href,
  children,
  icon,
}: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex w-full flex-col items-center gap-1 px-2 py-2 text-xs font-medium md:flex-row md:items-center md:justify-start md:gap-3 md:px-3 md:text-left md:text-sm",
        adminNavLinkClassName(isActive)
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </Link>
  );
}
