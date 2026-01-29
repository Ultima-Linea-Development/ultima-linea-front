import { cn } from "@/lib/utils";
import { forwardRef, type FormHTMLAttributes, type ReactNode } from "react";

type FormSpacing = "none" | "sm" | "md" | "lg";
type FormMarginTop = 0 | 1 | 2 | 3 | 4;

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  spacing?: FormSpacing;
  mt?: FormMarginTop;
};

const spacingStyles: Record<FormSpacing, string> = {
  none: "",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
};

const marginTopStyles: Record<FormMarginTop, string> = {
  0: "",
  1: "mt-1",
  2: "mt-2",
  3: "mt-3",
  4: "mt-4",
};

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ spacing = "md", mt = 0, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("w-full", spacingStyles[spacing], marginTopStyles[mt], className)}
        {...props}
      />
    );
  }
);

Form.displayName = "Form";

export default Form;
