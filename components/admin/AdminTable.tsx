"use client";

import type { ReactNode } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ADMIN_TABLE_CELL_CLASS =
  "min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2";
export const ADMIN_TABLE_TH_CLASS =
  "min-w-0 px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-3 font-medium";
export const ADMIN_TABLE_LAYOUT_CLASS = "w-full min-w-full table-fixed";
export const ADMIN_TABLE_PAGE_SIZE = 10;
export const ADMIN_TABLE_ACTIONS_COLUMN_CLASS = "w-14";
export const ADMIN_TABLE_CHECKBOX_COLUMN_CLASS = "w-10";

export const ADMIN_PAGE_PADDING_CLASS = "w-full px-4 sm:px-6 md:px-0";

export const ADMIN_TABLE_MODAL_MOBILE_BLEED_CLASS =
  "relative box-border -mx-4 w-[calc(100%+2rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] md:mx-0 md:w-full md:max-w-none";

export const ADMIN_TABLE_OUTER_BORDER_CLASS = "border border-gray-200";

export function adminTableRowClassName({
  stripeIndex,
  selected = false,
  className,
}: {
  stripeIndex: number;
  selected?: boolean;
  className?: string;
}) {
  return cn(
    "hover:bg-gray-200",
    stripeIndex % 2 === 0 ? "bg-gray-100" : "bg-background",
    selected && "!bg-gray-200",
    "[&>td]:bg-inherit",
    className
  );
}

type AdminTableProps = {
  children: ReactNode;
  className?: string;
  tableClassName?: string;
};

export function AdminTable({ children, className, tableClassName }: AdminTableProps) {
  return (
    <div
      className={cn(
        "hidden md:flex md:flex-col w-full min-w-0 overflow-x-auto",
        ADMIN_TABLE_OUTER_BORDER_CLASS,
        className
      )}
    >
      <table className={cn(ADMIN_TABLE_LAYOUT_CLASS, "text-left text-sm", tableClassName)}>
        {children}
      </table>
    </div>
  );
}

type AdminTableMobileListProps = {
  children: ReactNode;
  className?: string;
  bleed?: "page" | "modal";
};

export function AdminTableMobileList({
  children,
  className,
  bleed = "page",
}: AdminTableMobileListProps) {
  return (
    <div
      className={cn(
        "md:hidden flex w-full min-w-0 max-w-full flex-col",
        ADMIN_TABLE_OUTER_BORDER_CLASS,
        bleed === "modal" && ADMIN_TABLE_MODAL_MOBILE_BLEED_CLASS,
        className
      )}
    >
      {children}
    </div>
  );
}

type AdminTableMobileCardProps = {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  stripeIndex: number;
};

export function AdminTableMobileCard({
  children,
  className,
  selected = false,
  stripeIndex,
}: AdminTableMobileCardProps) {
  return (
    <div
      className={cn(
        adminTableRowClassName({ stripeIndex, selected }),
        "flex flex-col gap-2 px-3 py-2.5 sm:px-4 sm:py-3",
        className
      )}
    >
      {children}
    </div>
  );
}

type AdminTableMobileGridProps = {
  children: ReactNode;
  className?: string;
};

export function AdminTableMobileGrid({ children, className }: AdminTableMobileGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-3", className)}>
      {children}
    </div>
  );
}

type AdminTableMobileSummaryProps = {
  left: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function AdminTableMobileSummary({
  left,
  right,
  className,
}: AdminTableMobileSummaryProps) {
  return (
    <div className={cn("flex min-w-0 items-center justify-between gap-2", className)}>
      <div className="min-w-0 truncate text-xs text-muted-foreground">{left}</div>
      {right ? <div className="shrink-0 text-sm font-medium tabular-nums">{right}</div> : null}
    </div>
  );
}

type AdminTableMobileSubtextProps = {
  children: ReactNode;
  className?: string;
};

export function AdminTableMobileSubtext({ children, className }: AdminTableMobileSubtextProps) {
  return (
    <Typography variant="caption" color="muted" className={cn("block leading-snug", className)}>
      {children}
    </Typography>
  );
}

type AdminTableMobileFieldProps = {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

export function AdminTableMobileField({
  label,
  children,
  fullWidth = false,
  className,
}: AdminTableMobileFieldProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-baseline gap-1.5",
        fullWidth && "col-span-2 sm:col-span-3",
        className
      )}
    >
      <Typography variant="caption" color="muted" className="shrink-0 leading-snug">
        {label}
      </Typography>
      <div className="min-w-0 flex-1 text-sm leading-snug">{children}</div>
    </div>
  );
}

type AdminTableMobileEmptyProps = {
  message: string;
};

export function AdminTableMobileEmpty({ message }: AdminTableMobileEmptyProps) {
  return (
    <div className={cn("md:hidden w-full min-w-0 max-w-full p-8 text-center", ADMIN_TABLE_OUTER_BORDER_CLASS)}>
      <Typography variant="body2" color="muted">
        {message}
      </Typography>
    </div>
  );
}

type AdminTablePaginationProps = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function AdminTablePagination({
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  className,
}: AdminTablePaginationProps) {
  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <Box
      display="flex"
      className={cn(
        ADMIN_PAGE_PADDING_CLASS,
        "flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 flex-wrap",
        className
      )}
    >
      <span className="order-2 sm:order-1">
        <Typography variant="body2" color="muted">
          Mostrando {from}–{to} de {total}
        </Typography>
      </span>
      <Box
        display="flex"
        gap="2"
        className="items-center justify-center sm:justify-end order-1 sm:order-2 shrink-0"
      >
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </Button>
        <Typography variant="body2">
          Página {page} de {totalPages}
        </Typography>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}

type AdminTableEmptyRowProps = {
  colSpan: number;
  message: string;
};

export function AdminTableEmptyRow({ colSpan, message }: AdminTableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={cn(ADMIN_TABLE_CELL_CLASS, "py-8 text-center")}>
        <Typography variant="body2" color="muted">
          {message}
        </Typography>
      </td>
    </tr>
  );
}
