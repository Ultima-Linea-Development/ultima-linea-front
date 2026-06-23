import { cn } from "@/lib/utils";
import { formControlFocusClassName, formControlSizeClassName } from "@/lib/form-field-classes";
import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type InputHTMLAttributes,
  type MutableRefObject,
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

function assignInputRef(
  ref: ForwardedRef<HTMLInputElement>,
  node: HTMLInputElement | null
) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<HTMLInputElement | null>).current = node;
  }
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
      type,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);

    useEffect(() => {
      const input = inputRef.current;
      if (!input || type !== "number") return;

      const preventNumberWheel = (event: WheelEvent) => {
        event.preventDefault();
      };

      input.addEventListener("wheel", preventNumberWheel, { passive: false });
      return () => input.removeEventListener("wheel", preventNumberWheel);
    }, [type]);

    return (
      <div className={cn("relative", widthStyles[width])}>
        {startIcon ? (
          <span className={cn(adornmentClassName, "left-2")}>{startIcon}</span>
        ) : null}
        <input
          ref={(node) => {
            inputRef.current = node;
            assignInputRef(ref, node);
          }}
          type={type}
          className={cn(
            formControlSizeClassName,
            widthStyles[width],
            paddingYStyles[py],
            paddingXStyles[px],
            hasStartIcon && "pl-10",
            hasEndIcon && "pr-10",
            backgroundStyles[background],
            size && sizeStyles[size as InputSize],
            formControlFocusClassName,
            type === "number" &&
              "[appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
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
