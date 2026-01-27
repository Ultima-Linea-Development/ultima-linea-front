import { cn } from "@/lib/utils";
import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";

type LabelDisplay = "block" | "inline" | "inline-block";
type LabelSpacing = "none" | "sm" | "md";

type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "className"> & {
  display?: LabelDisplay;
  spacing?: LabelSpacing;
  children: ReactNode;
};

const displayStyles: Record<LabelDisplay, string> = {
  block: "block",
  inline: "inline",
  "inline-block": "inline-block",
};

const spacingStyles: Record<LabelSpacing, string> = {
  none: "",
  sm: "space-y-1",
  md: "space-y-2",
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ display = "block", spacing = "md", children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(displayStyles[display], spacingStyles[spacing])}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export default Label;
