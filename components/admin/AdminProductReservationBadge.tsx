"use client";

import Typography from "@/components/ui/Typography";
import type { ExternalSeller, Product, SaleAssignableUser } from "@/lib/api";
import {
  getProductReservationSummary,
  isProductReserved,
} from "@/lib/product-reservation";
import { cn } from "@/lib/utils";

type AdminProductReservationBadgeProps = {
  product: Pick<
    Product,
    | "reserved_by_sizes"
    | "reserved_for_user_id"
    | "reserved_for_external_seller_id"
    | "reserved_for_external_seller_name"
  >;
  assignableUsers?: SaleAssignableUser[];
  externalSellers?: ExternalSeller[];
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
} as const;

export default function AdminProductReservationBadge({
  product,
  assignableUsers = [],
  externalSellers = [],
  size = "md",
  className,
}: AdminProductReservationBadgeProps) {
  if (!isProductReserved(product)) return null;

  const summary = getProductReservationSummary(product, assignableUsers, externalSellers);

  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center rounded-full bg-amber-100 font-medium text-amber-900",
        SIZE_CLASSES[size],
        className
      )}
      title={summary ? `Reservado · ${summary}` : "Reservado"}
    >
      <Typography variant="caption" as="span" className="truncate">
        Reservado{summary ? ` · ${summary}` : ""}
      </Typography>
    </span>
  );
}
