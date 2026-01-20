import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type BaseBoxProps = {
  children: ReactNode;
  className?: string;
};

type FlexBoxProps = BaseBoxProps & {
  display: "flex";
  direction?: "row" | "col";
  justify?: "start" | "end" | "center" | "between" | "around";
  align?: "start" | "end" | "center" | "stretch";
  gap?: "0" | "1" | "2" | "4" | "8";
};

type GridBoxProps = BaseBoxProps & {
  display: "grid";
  cols?: 1 | 2 | 3 | 4;
  gap?: 0 | 4 | 8;
};

type DefaultBoxProps = BaseBoxProps & {
  display?: never;
};

type BoxProps = FlexBoxProps | GridBoxProps | DefaultBoxProps;

const justifyClasses = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
};

const alignClasses = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
};

const flexGapClasses = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "4": "gap-4",
  "8": "gap-8",
};

const colsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

const gridGapClasses: Record<0 | 4 | 8, string> = {
  0: "gap-0",
  4: "gap-4",
  8: "gap-8",
};

export default function Box(props: BoxProps) {
  const { children, className } = props;

  if (props.display === "flex") {
    const {
      direction = "row",
      justify = "start",
      align = "start",
      gap = "0",
    } = props;
    return (
      <div
        className={cn(
          "flex",
          direction === "col" ? "flex-col" : "flex-row",
          justifyClasses[justify],
          alignClasses[align],
          flexGapClasses[gap],
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (props.display === "grid") {
    const { cols = 3, gap = 8 } = props;
    return (
      <div
        className={cn(
          "grid",
          colsClasses[cols],
          gridGapClasses[gap],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
