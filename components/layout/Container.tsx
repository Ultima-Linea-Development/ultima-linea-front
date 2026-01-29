import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

export default function Container({ children, className, fullWidth }: ContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 py-8 flex flex-col w-full",
        fullWidth ? "max-w-full" : "max-w-[1920px]",
        className
      )}
    >
      {children}
    </div>
  );
}
