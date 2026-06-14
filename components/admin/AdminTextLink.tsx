"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { adminTextLinkClassName } from "@/lib/admin-interactive-styles";
import { cn } from "@/lib/utils";

type AdminTextLinkProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  tone?: "default" | "muted";
  className?: string;
  target?: string;
  rel?: string;
};

export default function AdminTextLink({
  children,
  href,
  onClick,
  selected = false,
  tone = "muted",
  className,
  target,
  rel,
}: AdminTextLinkProps) {
  const linkClassName = adminTextLinkClassName({ tone, selected, className });

  if (href) {
    return (
      <Link href={href} className={linkClassName} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(linkClassName, "cursor-pointer text-left")}>
        {children}
      </button>
    );
  }

  return <span className={linkClassName}>{children}</span>;
}
