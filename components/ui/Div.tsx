import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type DivPosition = "relative" | "absolute" | "static";
type DivPadding = 0 | 1 | 2 | 3 | 4 | 6 | 8;
type DivMarginTop = 0 | 1 | 2 | 3 | 4 | 6 | 8;
type DivTextAlign = "left" | "center" | "right";
type DivWidth = "full" | "auto";
type DivSpacing = "none" | "sm" | "md";
type DivBorder = "none" | "top" | "all";
type DivBackground = "none" | "destructive-light" | "default" | "muted" | "card";
type DivRounded = "none" | "md";
type DivOverflow = "hidden" | "visible";
type DivCursor = "pointer" | "default";
type DivAspect = "square" | "none";
type DivTransition = boolean;
type DivBorderColor = "transparent" | "black" | "default";
type DivHoverBorder = "black" | "none";

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  position?: DivPosition;
  p?: DivPadding;
  pt?: DivPadding;
  pb?: DivPadding;
  px?: DivPadding;
  py?: DivPadding;
  mt?: DivMarginTop;
  textAlign?: DivTextAlign;
  width?: DivWidth;
  spacing?: DivSpacing;
  border?: DivBorder;
  background?: DivBackground;
  rounded?: DivRounded;
  overflow?: DivOverflow;
  cursor?: DivCursor;
  aspect?: DivAspect;
  transition?: DivTransition;
  borderColor?: DivBorderColor;
  hoverBorder?: DivHoverBorder;
  children: ReactNode;
};

const positionStyles: Record<DivPosition, string> = {
  relative: "relative",
  absolute: "absolute",
  static: "static",
};

const paddingStyles: Record<DivPadding, string> = {
  0: "",
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  6: "p-6",
  8: "p-8",
};

const paddingTopStyles: Record<DivPadding, string> = {
  0: "",
  1: "pt-1",
  2: "pt-2",
  3: "pt-3",
  4: "pt-4",
  6: "pt-6",
  8: "pt-8",
};

const paddingBottomStyles: Record<DivPadding, string> = {
  0: "",
  1: "pb-1",
  2: "pb-2",
  3: "pb-3",
  4: "pb-4",
  6: "pb-6",
  8: "pb-8",
};

const paddingXStyles: Record<DivPadding, string> = {
  0: "",
  1: "px-1",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  6: "px-6",
  8: "px-8",
};

const paddingYStyles: Record<DivPadding, string> = {
  0: "",
  1: "py-1",
  2: "py-2",
  3: "py-3",
  4: "py-4",
  6: "py-6",
  8: "py-8",
};

const marginTopStyles: Record<DivMarginTop, string> = {
  0: "",
  1: "mt-1",
  2: "mt-2",
  3: "mt-3",
  4: "mt-4",
  6: "mt-6",
  8: "mt-8",
};

const textAlignStyles: Record<DivTextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const widthStyles: Record<DivWidth, string> = {
  full: "w-full",
  auto: "w-auto",
};

const spacingStyles: Record<DivSpacing, string> = {
  none: "",
  sm: "space-y-1",
  md: "space-y-2",
};

const borderStyles: Record<DivBorder, string> = {
  none: "",
  top: "border-t border-border",
  all: "border border-border",
};

const backgroundStyles: Record<DivBackground, string> = {
  none: "",
  "destructive-light": "bg-destructive/10",
  default: "bg-background",
  muted: "bg-muted",
  card: "bg-card",
};

const borderColorStyles: Record<DivBorderColor, string> = {
  transparent: "border-transparent",
  black: "border-black",
  default: "border-border",
};

const hoverBorderStyles: Record<DivHoverBorder, string> = {
  black: "hover:border-black",
  none: "",
};

const roundedStyles: Record<DivRounded, string> = {
  none: "",
  md: "rounded-md",
};

const overflowStyles: Record<DivOverflow, string> = {
  hidden: "overflow-hidden",
  visible: "overflow-visible",
};

const cursorStyles: Record<DivCursor, string> = {
  pointer: "cursor-pointer",
  default: "cursor-default",
};

const aspectStyles: Record<DivAspect, string> = {
  square: "aspect-square",
  none: "",
};

const transitionStyles: Record<boolean, string> = {
  true: "transition-colors",
  false: "",
};

const Div = forwardRef<HTMLDivElement, DivProps>(
  (
    {
      position,
      p,
      pt,
      pb,
      px,
      py,
      mt,
      textAlign,
      width,
      spacing,
      border,
      background,
      rounded,
      overflow,
      cursor,
      aspect,
      transition,
      borderColor,
      hoverBorder,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          position && positionStyles[position],
          p && paddingStyles[p],
          pt && paddingTopStyles[pt],
          pb && paddingBottomStyles[pb],
          px && paddingXStyles[px],
          py && paddingYStyles[py],
          mt && marginTopStyles[mt],
          textAlign && textAlignStyles[textAlign],
          width && widthStyles[width],
          spacing && spacingStyles[spacing],
          border && borderStyles[border],
          background && backgroundStyles[background],
          rounded && roundedStyles[rounded],
          overflow && overflowStyles[overflow],
          cursor && cursorStyles[cursor],
          aspect && aspectStyles[aspect],
          transition !== undefined && transitionStyles[transition],
          borderColor && borderColorStyles[borderColor],
          hoverBorder && hoverBorderStyles[hoverBorder]
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Div.displayName = "Div";

export default Div;
