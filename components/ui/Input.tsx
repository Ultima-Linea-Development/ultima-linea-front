import { cn } from "@/lib/utils";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputWidth = "full" | "auto";
type InputPaddingY = 1 | 2 | 3 | 4;
type InputPaddingX = 2 | 3 | 4 | 6;
type InputBackground = "gray" | "default";
type InputSize = "sm" | "default";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size"> & {
  width?: InputWidth;
  py?: InputPaddingY;
  px?: InputPaddingX;
  background?: InputBackground;
  size?: InputSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

const widthStyles: Record<InputWidth, string> = {
  full: "w-full",
  auto: "w-auto",
};

const paddingYStyles: Record<InputPaddingY, string> = {
  1: "py-1",
  2: "py-2",
  3: "py-3",
  4: "py-4",
};

const paddingXStyles: Record<InputPaddingX, string> = {
  2: "px-2",
  3: "px-3",
  4: "px-4",
  6: "px-6",
};

const backgroundStyles: Record<InputBackground, string> = {
  gray: "bg-gray-200",
  default: "bg-background",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "text-base md:text-sm",
  default: "text-base",
};

const adornmentClassName =
  "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_button]:pointer-events-auto";

type InputAdornmentProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function InputAdornment({
  className,
  children,
  type = "button",
  ...props
}: InputAdornmentProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      width = "full",
      py = 2,
      px = 4,
      background = "gray",
      size = "sm",
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);

    return (
      <div className={cn("relative", widthStyles[width])}>
        {startIcon ? (
          <span className={cn(adornmentClassName, "left-2")}>{startIcon}</span>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "block",
            widthStyles[width],
            paddingYStyles[py],
            paddingXStyles[px],
            hasStartIcon && "pl-10",
            hasEndIcon && "pr-10",
            backgroundStyles[background],
            size && sizeStyles[size as InputSize],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          {...props}
        />
        {endIcon ? (
          <span className={cn(adornmentClassName, "right-2")}>{endIcon}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
