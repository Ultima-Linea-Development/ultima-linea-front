import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type NavBarProps = {
  children: ReactNode;
  className?: string;
};

export default function NavBar({ children, className }: NavBarProps) {
  return (
    <div
      className={cn("flex h-12 items-center justify-between relative", className)}
    >
      {children}
    </div>
  );
}
