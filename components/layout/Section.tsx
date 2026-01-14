import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export default function Section({ children, className }: SectionProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
