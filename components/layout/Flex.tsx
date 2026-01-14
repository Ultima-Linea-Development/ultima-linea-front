import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type FlexProps = {
  children: ReactNode;
  className?: string;
  direction?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around";
  align?: "start" | "end" | "center" | "stretch";
  gap?: "0" | "1" | "2" | "4" | "8";
};

const justifyClasses = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
};

const alignClasses = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
};

const gapClasses = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "4": "gap-4",
  "8": "gap-8",
};

export default function Flex({
  children,
  className,
  direction = "row",
  justify = "start",
  align = "start",
  gap = "0",
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
