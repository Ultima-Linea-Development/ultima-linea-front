import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type NavLinksProps = {
  children: ReactNode;
  className?: string;
};

export default function NavLinks({ children, className }: NavLinksProps) {
  return (
    <div className={cn("flex gap-1 absolute left-1/2 -translate-x-1/2 h-full", className)}>
      {children}
    </div>
  );
}
