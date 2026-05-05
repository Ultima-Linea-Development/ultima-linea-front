import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type FooterMarginTop = "auto" | "none";
type FooterBorder = "none" | "top";
type FooterPadding = "none" | "md";

type FooterProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  marginTop?: FooterMarginTop;
  border?: FooterBorder;
  padding?: FooterPadding;
  className?: string;
  children: ReactNode;
};

const marginTopStyles: Record<FooterMarginTop, string> = {
  auto: "mt-auto",
  none: "",
};

const borderStyles: Record<FooterBorder, string> = {
  none: "",
  top: "border-t border-zinc-200",
};

const paddingStyles: Record<FooterPadding, string> = {
  none: "", 
  md: "py-8",
};

const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      marginTop = "auto",
      border = "top",
      padding = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <footer
        ref={ref}
        className={cn(
          marginTopStyles[marginTop],
          borderStyles[border],
          paddingStyles[padding],
          "bg-background",
          className
        )}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;
