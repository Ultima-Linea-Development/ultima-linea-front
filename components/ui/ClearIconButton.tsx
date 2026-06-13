"use client";

import Icon from "@/components/ui/Icons";
import { clearIconButtonClassName } from "@/lib/interactive-styles";
import { cn } from "@/lib/utils";

type ClearIconButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function ClearIconButton({
  onClick,
  className,
  disabled,
  "aria-label": ariaLabel = "Limpiar",
}: ClearIconButtonProps) {
  return (
    <button
      type="button"
      className={cn(clearIconButtonClassName, className)}
      aria-label={ariaLabel}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name="close" size={20} />
    </button>
  );
}
