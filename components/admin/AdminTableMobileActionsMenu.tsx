"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Icon, { type IconName } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import { adminIconTriggerClassName, adminMenuOptionClassName } from "@/lib/admin-interactive-styles";
import { zIndex } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export type AdminTableMobileAction = {
  id: string;
  label: string;
  icon: IconName;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  warning?: boolean;
  active?: boolean;
};

type AdminTableMobileActionsMenuProps = {
  actions: AdminTableMobileAction[];
  ariaLabel?: string;
};

type MenuPosition = {
  top?: number;
  bottom?: number;
  right: number;
  maxHeight: number;
};

const MENU_EDGE_MARGIN = 8;
const MENU_TRIGGER_GAP = 4;
const ESTIMATED_MENU_ITEM_HEIGHT = 40;
const MENU_VERTICAL_PADDING = 8;

export default function AdminTableMobileActionsMenu({
  actions,
  ariaLabel = "Opciones",
}: AdminTableMobileActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const estimatedMenuHeight =
      actions.length * ESTIMATED_MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING;
    const spaceAbove = rect.top - MENU_EDGE_MARGIN - MENU_TRIGGER_GAP;
    const spaceBelow = window.innerHeight - rect.bottom - MENU_EDGE_MARGIN - MENU_TRIGGER_GAP;
    const opensUp = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    setMenuPosition({
      ...(opensUp
        ? {
            bottom: Math.max(
              MENU_EDGE_MARGIN,
              window.innerHeight - rect.top + MENU_TRIGGER_GAP
            ),
            maxHeight: Math.max(ESTIMATED_MENU_ITEM_HEIGHT, spaceAbove),
          }
        : {
            top: Math.min(
              rect.bottom + MENU_TRIGGER_GAP,
              window.innerHeight - MENU_EDGE_MARGIN
            ),
            maxHeight: Math.max(ESTIMATED_MENU_ITEM_HEIGHT, spaceBelow),
          }),
      right: window.innerWidth - rect.right,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (actions.length === 0) return null;

  const handleAction = (action: AdminTableMobileAction) => {
    if (action.disabled) return;
    action.onClick();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={cn(adminIconTriggerClassName, "h-10 w-10 text-muted-foreground")}
      >
        <Icon name="more" className="size-5" />
      </Button>
      {open && menuPosition && (
        <div
          id={menuId}
          role="menu"
          className="fixed min-w-40 overflow-y-auto border border-border bg-background py-1 shadow-md"
          style={{
            top: menuPosition.top,
            bottom: menuPosition.bottom,
            right: menuPosition.right,
            maxHeight: menuPosition.maxHeight,
            zIndex: zIndex.dropdown,
          }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              onClick={() => handleAction(action)}
              className={cn(
                adminMenuOptionClassName({
                  selected: action.active,
                  className: "items-center gap-2",
                }),
                action.destructive
                  ? "text-delete-foreground hover:bg-delete hover:text-delete-foreground"
                  : action.warning
                    ? "text-warning-foreground hover:bg-warning hover:text-warning-foreground"
                    : "text-foreground",
                action.disabled && "pointer-events-none opacity-50"
              )}
            >
              <Icon name={action.icon} className="size-4 shrink-0" />
              <Typography variant="body2" as="span">
                {action.label}
              </Typography>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
