"use client";

import type { ReactNode } from "react";
import Box from "@/components/layout/Box";
import AdminLoadingShimmer from "@/components/admin/AdminLoadingShimmer";
import {
  ADMIN_TABLE_ACTIONS_COLUMN_CLASS,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_CHECKBOX_COLUMN_CLASS,
  ADMIN_TABLE_PAGE_SIZE,
  ADMIN_TABLE_TH_CLASS,
  AdminTable,
  AdminTableMobileCard,
  AdminTableMobileList,
} from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

type AdminTableSkeletonVariant = "sales" | "users" | "products";

type AdminTableSkeletonProps = {
  variant: AdminTableSkeletonVariant;
  rows?: number;
  showSelection?: boolean;
  showMobileFilters?: boolean;
  className?: string;
};

const DATA_COLUMNS: Record<AdminTableSkeletonVariant, number> = {
  sales: 6,
  users: 5,
  products: 5,
};

const HEADER_WIDTHS: Record<AdminTableSkeletonVariant, string[]> = {
  sales: ["w-[12%]", "w-[30%]", "w-[8%]", "w-[8%]", "w-[10%]", "w-[20%]"],
  users: ["w-[16%]", "w-[30%]", "w-[14%]", "w-[12%]", "w-[14%]"],
  products: ["w-[28%]", "w-[12%]", "w-[12%]", "w-[10%]", "w-[18%]"],
};

const HEADER_WIDTHS_WITH_SELECTION = ["w-[24%]", "w-[12%]", "w-[12%]", "w-[10%]", "w-[18%]"];

const SHIMMER_TEXT = "block h-4 w-full min-w-0 max-w-full rounded-sm";
const SHIMMER_CAPTION = "block h-3 w-full min-w-0 max-w-full rounded-sm";
const DESKTOP_SKELETON_CELL_INNER_CLASS = "flex h-10 w-full min-w-0 items-center sm:h-12";
const MOBILE_SKELETON_HEADER_MIN_H_CLASS = "min-h-9";

function MobileTitleActionsHeaderRow({ staggerIndex }: { staggerIndex?: number }) {
  return (
    <Box
      display="flex"
      justify="between"
      align="center"
      gap="2"
      className={cn("w-full min-w-0", MOBILE_SKELETON_HEADER_MIN_H_CLASS)}
    >
      <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "max-w-[9rem]")} staggerIndex={staggerIndex} />
      <AdminLoadingShimmer className="size-5 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
    </Box>
  );
}

function MobileProductHeaderRow({ staggerIndex }: { staggerIndex?: number }) {
  return (
    <Box
      display="flex"
      justify="between"
      align="start"
      gap="2"
      className={cn("w-full min-w-0", MOBILE_SKELETON_HEADER_MIN_H_CLASS)}
    >
      <Box display="flex" align="start" gap="2" className="min-w-0 flex-1">
        <AdminLoadingShimmer className="size-9 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
        <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "mt-0.5 max-w-[12rem]")} staggerIndex={staggerIndex} />
      </Box>
      <AdminLoadingShimmer className="size-5 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
    </Box>
  );
}

function MobileProductHeaderRowWithCheckbox({ staggerIndex }: { staggerIndex?: number }) {
  return (
    <Box
      display="flex"
      justify="between"
      align="start"
      gap="2"
      className={cn("w-full min-w-0", MOBILE_SKELETON_HEADER_MIN_H_CLASS)}
    >
      <Box display="flex" align="start" gap="2" className="min-w-0 flex-1">
        <AdminLoadingShimmer className="size-4 shrink-0 rounded-sm mt-0.5" staggerIndex={staggerIndex} />
        <AdminLoadingShimmer className="size-9 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
        <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "mt-0.5 max-w-[10rem]")} staggerIndex={staggerIndex} />
      </Box>
      <AdminLoadingShimmer className="size-5 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
    </Box>
  );
}

function MobileSummaryRow({
  staggerIndex,
  showRight = true,
}: {
  staggerIndex?: number;
  showRight?: boolean;
}) {
  return (
    <Box display="flex" justify="between" align="center" gap="2" className="min-w-0">
      <AdminLoadingShimmer className={cn(SHIMMER_CAPTION, "max-w-[12rem]")} staggerIndex={staggerIndex} />
      {showRight ? (
        <AdminLoadingShimmer className="h-4 w-16 shrink-0 rounded-sm" staggerIndex={staggerIndex} />
      ) : null}
    </Box>
  );
}

function MobileSubtextRow({ staggerIndex }: { staggerIndex?: number }) {
  return (
    <AdminLoadingShimmer className={cn(SHIMMER_CAPTION, "max-w-[10rem]")} staggerIndex={staggerIndex} />
  );
}

function MobileSalesCardSkeleton({ staggerIndex }: { staggerIndex: number }) {
  return (
    <AdminTableMobileCard>
      <MobileProductHeaderRow staggerIndex={staggerIndex} />
      <MobileSummaryRow staggerIndex={staggerIndex} />
      <MobileSubtextRow staggerIndex={staggerIndex} />
    </AdminTableMobileCard>
  );
}

function MobileUsersCardSkeleton({ staggerIndex }: { staggerIndex: number }) {
  return (
    <AdminTableMobileCard>
      <MobileTitleActionsHeaderRow staggerIndex={staggerIndex} />
      <MobileSummaryRow staggerIndex={staggerIndex} showRight={false} />
      <MobileSubtextRow staggerIndex={staggerIndex} />
    </AdminTableMobileCard>
  );
}

function MobileProductsCardSkeleton({
  showSelection,
  staggerIndex,
}: {
  showSelection?: boolean;
  staggerIndex: number;
}) {
  return (
    <AdminTableMobileCard>
      {showSelection ? (
        <MobileProductHeaderRowWithCheckbox staggerIndex={staggerIndex} />
      ) : (
        <MobileProductHeaderRow staggerIndex={staggerIndex} />
      )}
      <MobileSummaryRow staggerIndex={staggerIndex} />
      <MobileSubtextRow staggerIndex={staggerIndex} />
    </AdminTableMobileCard>
  );
}

function DesktopProductCellShimmer({ staggerIndex }: { staggerIndex?: number }) {
  return (
    <Box display="flex" align="center" gap="2" className="min-w-0 sm:gap-3">
      <AdminLoadingShimmer className="size-10 shrink-0 rounded-sm sm:size-12" staggerIndex={staggerIndex} />
      <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "max-w-[10rem]")} staggerIndex={staggerIndex} />
    </Box>
  );
}

function DesktopSkeletonCell({ children }: { children: React.ReactNode }) {
  return <div className={DESKTOP_SKELETON_CELL_INNER_CLASS}>{children}</div>;
}

function DesktopBodyRow({
  variant,
  dataColumns,
  showSelection,
  staggerIndex,
}: {
  variant: AdminTableSkeletonVariant;
  dataColumns: number;
  showSelection?: boolean;
  staggerIndex: number;
}) {
  const productColumnIndex = variant === "sales" ? 1 : variant === "products" ? 0 : -1;

  return (
    <tr className="border-b border-border last:border-b-0">
      {showSelection ? (
        <td className={cn(ADMIN_TABLE_CELL_CLASS, ADMIN_TABLE_CHECKBOX_COLUMN_CLASS)}>
          <DesktopSkeletonCell>
            <AdminLoadingShimmer className="size-4 rounded-sm" staggerIndex={staggerIndex} />
          </DesktopSkeletonCell>
        </td>
      ) : null}
      {Array.from({ length: dataColumns }).map((_, columnIndex) => (
        <td key={columnIndex} className={ADMIN_TABLE_CELL_CLASS}>
          <DesktopSkeletonCell>
            {columnIndex === productColumnIndex ? (
              <DesktopProductCellShimmer staggerIndex={staggerIndex} />
            ) : (
              <AdminLoadingShimmer className={SHIMMER_TEXT} staggerIndex={staggerIndex} />
            )}
          </DesktopSkeletonCell>
        </td>
      ))}
      <td className={cn(ADMIN_TABLE_CELL_CLASS, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
        <DesktopSkeletonCell>
          <AdminLoadingShimmer className="size-5 rounded-sm" staggerIndex={staggerIndex} />
        </DesktopSkeletonCell>
      </td>
    </tr>
  );
}

export default function AdminTableSkeleton({
  variant,
  rows = ADMIN_TABLE_PAGE_SIZE,
  showSelection = false,
  showMobileFilters = false,
  className,
}: AdminTableSkeletonProps) {
  const dataColumns = DATA_COLUMNS[variant];
  const headerWidths =
    variant === "products" && showSelection
      ? HEADER_WIDTHS_WITH_SELECTION
      : variant === "products"
        ? HEADER_WIDTHS.products
        : HEADER_WIDTHS[variant];

  const renderMobileCard = (index: number) => {
    if (variant === "users") {
      return <MobileUsersCardSkeleton key={index} staggerIndex={index} />;
    }
    if (variant === "products") {
      return (
        <MobileProductsCardSkeleton
          key={index}
          showSelection={showSelection}
          staggerIndex={index}
        />
      );
    }
    return <MobileSalesCardSkeleton key={index} staggerIndex={index} />;
  };

  return (
    <Box
      display="flex"
      direction="col"
      gap="4"
      className={cn("w-full min-w-0", className)}
      aria-busy="true"
      aria-label="Cargando tabla"
    >
      {showMobileFilters ? (
        <Box
          display="flex"
          className={cn(
            "md:hidden w-full min-w-0 flex-wrap items-center gap-3 border border-border px-3 py-2.5 sm:px-4 sm:py-3"
          )}
        >
          <AdminLoadingShimmer className="h-8 w-24 rounded-sm" />
          <AdminLoadingShimmer className="h-8 w-20 rounded-sm" />
          <AdminLoadingShimmer className="h-8 w-16 rounded-sm" />
        </Box>
      ) : null}

      <AdminTableMobileList>
          {showSelection && variant === "products" ? (
            <Box
              display="flex"
              align="center"
              gap="3"
              className="border-b border-border bg-muted/30 px-3 py-2.5 sm:px-4 sm:py-3"
            >
              <AdminLoadingShimmer className="size-4 shrink-0 rounded-sm" />
              <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "max-w-[8rem]")} />
            </Box>
          ) : null}
          {Array.from({ length: rows }).map((_, index) => renderMobileCard(index))}
      </AdminTableMobileList>

      <AdminTable className="overflow-x-hidden" tableClassName="h-auto">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {showSelection ? (
                <th className={cn(ADMIN_TABLE_TH_CLASS, ADMIN_TABLE_CHECKBOX_COLUMN_CLASS)}>
                  <AdminLoadingShimmer className="size-4 rounded-sm" />
                </th>
              ) : null}
              {headerWidths.map((width, index) => (
                <th key={index} className={cn(ADMIN_TABLE_TH_CLASS, width)}>
                  <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "max-w-[5rem]")} />
                </th>
              ))}
              <th className={cn(ADMIN_TABLE_TH_CLASS, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                <AdminLoadingShimmer className={cn(SHIMMER_TEXT, "max-w-[3.5rem]")} />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <DesktopBodyRow
                key={index}
                variant={variant}
                dataColumns={dataColumns}
                showSelection={showSelection}
                staggerIndex={index}
              />
            ))}
          </tbody>
        </AdminTable>
    </Box>
  );
}
