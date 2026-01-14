import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type NavLinksProps = {
  children: ReactNode;
  className?: string;
};

export default function NavLinks({ children, className }: NavLinksProps) {
  return <div className={cn("flex gap-1", className)}>{children}</div>;
}
