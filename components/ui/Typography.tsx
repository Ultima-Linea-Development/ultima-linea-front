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

type TextAlign = "left" | "center" | "right" | "justify";
type TextColor = "muted" | "destructive" | "gray" | "default";
type MarginBottom = 1 | 2 | 3 | 4 | 5 | 6 | 8;

type TypographyProps = {
  variant?: TypographyVariant;
  as?: ElementType;
  uppercase?: boolean;
  align?: TextAlign;
  color?: TextColor;
  mb?: MarginBottom;
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

const alignStyles: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const colorStyles: Record<TextColor, string> = {
  muted: "text-muted-foreground",
  destructive: "text-destructive",
  gray: "text-gray-500",
  default: "",
};

const marginBottomStyles: Record<MarginBottom, string> = {
  1: "mb-1",
  2: "mb-2",
  3: "mb-3",
  4: "mb-4",
  5: "mb-5",
  6: "mb-6",
  8: "mb-8",
};

export default function Typography({
  variant = "body",
  as,
  uppercase,
  align,
  color,
  mb,
  children,
}: TypographyProps) {
  const Component = as || defaultElements[variant];
  const baseStyles = variantStyles[variant];

  return (
    <Component
      className={cn(
        baseStyles,
        uppercase && "uppercase",
        align && alignStyles[align],
        color && colorStyles[color],
        mb && marginBottomStyles[mb]
      )}
    >
      {children}
    </Component>
  );
}
