import { forwardRef, type SelectHTMLAttributes } from "react";
import { formFieldClassName } from "@/lib/form-field-classes";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(formFieldClassName, className)} {...props} />
  )
);

Select.displayName = "Select";

export default Select;
