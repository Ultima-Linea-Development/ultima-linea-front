import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type MainFlex = boolean;

type MainProps = Omit<HTMLAttributes<HTMLElement>, "className"> & {
  flex?: MainFlex;
  children: ReactNode;
};

const Main = forwardRef<HTMLElement, MainProps>(
  ({ flex = true, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(flex && "flex-1")}
        {...props}
      >
        {children}
      </main>
    );
  }
);

Main.displayName = "Main";

export default Main;
