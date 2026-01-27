import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type NavPosition = "sticky" | "static" | "fixed";
type NavBorder = "none" | "bottom";
type NavBackground = "white" | "transparent";
type NavUppercase = boolean;

type NavProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  position?: NavPosition;
  border?: NavBorder;
  background?: NavBackground;
  uppercase?: NavUppercase;
  children: ReactNode;
};

const positionStyles: Record<NavPosition, string> = {
  sticky: "sticky top-0 z-50",
  static: "static",
  fixed: "fixed top-0 z-50",
};

const borderStyles: Record<NavBorder, string> = {
  none: "",
  bottom: "border-b border-gray-200",
};

const backgroundStyles: Record<NavBackground, string> = {
  white: "bg-white",
  transparent: "bg-transparent",
};

const Nav = forwardRef<HTMLElement, NavProps>(
  (
    {
      position = "sticky",
      border = "bottom",
      background = "white",
      uppercase = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "w-full",
          positionStyles[position],
          borderStyles[border],
          backgroundStyles[background],
          uppercase && "uppercase"
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

Nav.displayName = "Nav";

export default Nav;
