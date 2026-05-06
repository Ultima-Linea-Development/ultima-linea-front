import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type NavLinksProps = {
  children: ReactNode;
  className?: string;
  mobile?: boolean;
};

export default function NavLinks({ children, className, mobile = false }: NavLinksProps) {
  if (mobile) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "hidden md:flex gap-1 absolute h-full md:left-14 md:translate-x-0 lg:left-1/2 lg:-translate-x-1/2",
        className
      )}
    >
      {children}
    </div>
  );
}
