import { cn } from "@/lib/utils";
import { type ReactNode, type ElementType } from "react";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "body2"
  | "small"
  | "caption";

type TypographyProps = {
  variant?: TypographyVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold tracking-[-0.02em] [font-family:var(--font-archivo-black)]",
  h2: "text-3xl font-bold tracking-[-0.02em] [font-family:var(--font-archivo-black)]",
  h3: "text-2xl font-bold tracking-[-0.01em] [font-family:var(--font-archivo-black)]",
  h4: "text-xl font-semibold [font-family:var(--font-archivo-black)]",
  h5: "text-lg font-semibold [font-family:var(--font-archivo-black)]",
  h6: "text-base font-semibold [font-family:var(--font-archivo-black)]",
  body: "text-base font-normal",
  body2: "text-sm font-normal",
  small: "text-sm font-normal",
  caption: "text-xs font-normal",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  body2: "p",
  small: "small",
  caption: "span",
};

export default function Typography({
  variant = "body",
  as,
  className,
  children,
}: TypographyProps) {
  const Component = as || defaultElements[variant];
  const baseStyles = variantStyles[variant];

  return (
    <Component className={cn(baseStyles, className)}>{children}</Component>
  );
}
