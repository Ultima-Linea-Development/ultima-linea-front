import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 0 | 4 | 8;
  className?: string;
};

const colsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const gapClasses: Record<0 | 4 | 8, string> = {
  0: "gap-0",
  4: "gap-4",
  8: "gap-8",
};

export default function Grid({
  children,
  cols = 3,
  gap = 8,
  className,
}: GridProps) {
  return (
    <div className={cn("grid", colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
