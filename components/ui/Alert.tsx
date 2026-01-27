import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type AlertVariant = "destructive" | "default";
type AlertPadding = "sm" | "md";
type AlertBorder = boolean;
type AlertRounded = "md" | "none";

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: AlertVariant;
  padding?: AlertPadding;
  border?: AlertBorder;
  rounded?: AlertRounded;
  children: ReactNode;
};

const variantStyles: Record<AlertVariant, string> = {
  destructive: "bg-destructive/10 border-destructive/20",
  default: "bg-background border-border",
};

const paddingStyles: Record<AlertPadding, string> = {
  sm: "p-2",
  md: "p-3",
};

const getBorderStyle = (border: boolean): string => {
  return border ? "border" : "";
};

const roundedStyles: Record<AlertRounded, string> = {
  md: "rounded-md",
  none: "",
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "destructive",
      padding = "md",
      border = true,
      rounded = "md",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          getBorderStyle(border),
          roundedStyles[rounded]
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
