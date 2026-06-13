import { zIndex } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type MobilePanelVariant = "menu" | "search";

type MobilePanelProps = {
  isOpen: boolean;
  variant: MobilePanelVariant;
  children: ReactNode;
};

const variantStyles: Record<MobilePanelVariant, string> = {
  menu: "top-[80px] right-0 w-full h-[calc(100vh-80px)]",
  search: "top-[80px] right-0 left-0 w-full border-b border-gray-200 px-4 py-3",
};

export default function MobilePanel({ isOpen, variant, children }: MobilePanelProps) {
  return (
    <div
      className={cn(
        "fixed bg-white md:hidden shadow-lg transition-transform duration-300 ease-in-out",
        variantStyles[variant],
        isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
      )}
      style={{ zIndex: zIndex.mobilePanel }}
    >
      {variant === "menu" ? (
        <div className="flex flex-col py-4 h-full overflow-y-auto">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
