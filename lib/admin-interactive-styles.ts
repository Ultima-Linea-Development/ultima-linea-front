import { clearIconButtonClassName } from "@/lib/interactive-styles";
import { cn } from "@/lib/utils";

export const ADMIN_INTERACTIVE_TRANSITION = "transition-colors";

export const ADMIN_SURFACE_HOVER =
  "hover:bg-gray-200 hover:text-foreground";

export const ADMIN_LOADING_SHIMMER_CLASS = "admin-shimmer";

export const ADMIN_NAV_LINK_ACTIVE =
  "bg-gray-200 font-medium text-foreground";

export function adminNavLinkClassName(isActive: boolean) {
  return cn(
    ADMIN_INTERACTIVE_TRANSITION,
    isActive ? ADMIN_NAV_LINK_ACTIVE : cn("text-muted-foreground", ADMIN_SURFACE_HOVER)
  );
}

export function adminSurfaceInteractiveClassName(className?: string) {
  return cn(ADMIN_INTERACTIVE_TRANSITION, ADMIN_SURFACE_HOVER, className);
}

export function adminMenuOptionClassName(options?: {
  selected?: boolean;
  className?: string;
}) {
  return cn(
    "flex w-full cursor-pointer px-4 py-2.5 text-left text-sm",
    ADMIN_INTERACTIVE_TRANSITION,
    "hover:bg-gray-200",
    options?.selected && "bg-muted/50 font-medium",
    options?.className
  );
}

export const adminIconTriggerClassName = cn(
  "inline-flex cursor-pointer items-center rounded-sm p-1",
  ADMIN_INTERACTIVE_TRANSITION,
  "hover:bg-gray-200 hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

export const adminClearIconButtonClassName = cn(
  clearIconButtonClassName,
  ADMIN_INTERACTIVE_TRANSITION
);

export function adminTextLinkClassName(options?: {
  tone?: "default" | "muted";
  selected?: boolean;
  className?: string;
}) {
  const { tone = "default", selected = false, className } = options ?? {};

  return cn(
    "cursor-pointer max-w-full underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
    ADMIN_INTERACTIVE_TRANSITION,
    tone === "default"
      ? "text-foreground"
      : selected
        ? "font-medium text-foreground"
        : "text-muted-foreground hover:text-foreground",
    className
  );
}
