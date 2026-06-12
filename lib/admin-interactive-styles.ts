import { cn } from "@/lib/utils";

export const ADMIN_INTERACTIVE_TRANSITION = "transition-colors";

export const ADMIN_SURFACE_HOVER =
  "hover:bg-gray-200 hover:text-foreground";

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
  "cursor-pointer rounded-sm p-1 text-gray-500",
  ADMIN_INTERACTIVE_TRANSITION,
  "hover:bg-gray-200 hover:text-gray-700",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);
