"use client";

import Icon from "@/components/ui/Icons";
import Typography from "@/components/ui/Typography";
import type { CommissionStatus } from "@/lib/api";
import { getCommissionStatusVisual } from "@/lib/commission-display";
import { cn } from "@/lib/utils";

type AdminCommissionStatusBadgeProps = {
  status: CommissionStatus;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES = {
  sm: { circle: "size-5", icon: "size-3", label: "text-xs" },
  md: { circle: "size-6", icon: "size-3.5", label: "text-sm" },
} as const;

export default function AdminCommissionStatusBadge({
  status,
  showLabel = true,
  size = "md",
  className,
}: AdminCommissionStatusBadgeProps) {
  const visual = getCommissionStatusVisual(status);
  const sizes = SIZE_CLASSES[size];

  return (
    <span className={cn("inline-flex min-w-0 max-w-full items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-white",
          sizes.circle,
          visual.circleClassName
        )}
        aria-hidden
      >
        <Icon name={visual.icon} className={sizes.icon} />
      </span>
      {showLabel ? (
        <Typography variant="body2" as="span" className={cn("truncate", sizes.label)}>
          {visual.label}
        </Typography>
      ) : null}
    </span>
  );
}
