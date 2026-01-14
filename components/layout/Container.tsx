import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4", className)}>
      {children}
    </div>
  );
}
