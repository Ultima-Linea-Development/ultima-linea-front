import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type FooterMarginTop = "auto" | "none";
type FooterBorder = "none" | "top";
type FooterPadding = "none" | "md";

type FooterProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  marginTop?: FooterMarginTop;
  border?: FooterBorder;
  padding?: FooterPadding;
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
          "bg-background"
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
