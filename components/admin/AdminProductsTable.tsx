"use client";

import { useRef, useEffect, type ReactNode } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import {
  AdminTable,
  AdminTableEmptyRow,
  AdminTableMobileCard,
  AdminTableMobileEmpty,
  AdminTableMobileList,
  AdminTableMobileSummary,
  AdminTablePagination,
  ADMIN_TABLE_ACTIONS_COLUMN_CLASS,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_CHECKBOX_COLUMN_CLASS,
  ADMIN_TABLE_TH_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { Product } from "@/lib/api";
import { formatPrice, generateSlug, cn } from "@/lib/utils";
import AdminTableProductName from "@/components/admin/AdminTableProductName";
import AdminProductSizeStock from "@/components/admin/AdminProductSizeStock";
import AdminTableColumnFilter from "@/components/admin/AdminTableColumnFilter";
import AdminTableMobileActionsMenu, {
  type AdminTableMobileAction,
} from "@/components/admin/AdminTableMobileActionsMenu";
import { compareSizeLabels } from "@/lib/product-inventory";

const PER_PAGE = 10;

type AdminProductsTableProps = {
  products: Product[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (product: Product) => void;
  onDeactivate?: (product: Product) => void;
  onReactivate?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  canDeleteProduct?: (product: Product) => boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  tableFooter?: ReactNode;
  sizeFilter?: string;
  sizeOptions?: string[];
  onSizeFilterChange?: (value: string) => void;
};

export default function AdminProductsTable({
  products,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
  canDeleteProduct,
  selectedIds = [],
  onSelectionChange,
  tableFooter,
  sizeFilter = "",
  sizeOptions = [],
  onSizeFilterChange,
}: AdminProductsTableProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;

  const selectedSet = new Set(selectedIds);
  const visibleIds = products.map((p) => p.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedSet.has(id));

  const handleToggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedSet.has(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (allVisibleSelected) {
      onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
    } else {
      const merged = new Set([...selectedIds, ...visibleIds]);
      onSelectionChange(Array.from(merged));
    }
  };

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  const colSpan = onSelectionChange ? 5 : 4;

  const sortedSizeOptions = [...sizeOptions].sort(compareSizeLabels);

  const renderSizeHeader = () =>
    onSizeFilterChange ? (
      <AdminTableColumnFilter
        id="catalog-size-filter"
        label="Talles"
        value={sizeFilter}
        onChange={onSizeFilterChange}
        options={sortedSizeOptions.map((size) => ({ value: size, label: size }))}
        className="min-w-[5.5rem]"
      />
    ) : (
      <Typography variant="body2">Talles</Typography>
    );

  const renderMobileFilters = () => {
    if (!onSizeFilterChange) return null;

    return (
      <Box
        display="flex"
        className="md:hidden w-full min-w-0 flex-wrap items-center gap-3 border border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3"
      >
        <AdminTableColumnFilter
          id="catalog-size-filter-mobile"
          label="Talles"
          value={sizeFilter}
          onChange={onSizeFilterChange}
          options={sortedSizeOptions.map((size) => ({ value: size, label: size }))}
        />
      </Box>
    );
  };

  const getRowActions = (product: Product): AdminTableMobileAction[] => {
    const actions: AdminTableMobileAction[] = [];

    if (onEdit) {
      actions.push({
        id: "edit",
        label: "Editar",
        icon: "edit",
        onClick: () => onEdit(product),
      });
    }

    if (onDeactivate && product.is_active) {
      actions.push({
        id: "deactivate",
        label: "Desactivar",
        icon: "visibilityOff",
        onClick: () => onDeactivate(product),
        warning: true,
      });
    }

    if (onReactivate && !product.is_active) {
      actions.push({
        id: "reactivate",
        label: "Reactivar",
        icon: "visibility",
        onClick: () => onReactivate(product),
      });
    }

    if (onDelete && (!canDeleteProduct || canDeleteProduct(product))) {
      actions.push({
        id: "delete",
        label: "Eliminar",
        icon: "delete",
        onClick: () => onDelete(product),
        destructive: true,
      });
    }

    return actions;
  };

  const renderDesktopHeaderRow = (withSelectAllRef = false) => (
    <tr>
      {onSelectionChange && (
        <th className={cn(thClass, ADMIN_TABLE_CHECKBOX_COLUMN_CLASS)}>
          <input
            ref={withSelectAllRef ? selectAllRef : undefined}
            type="checkbox"
            checked={allVisibleSelected}
            onChange={handleToggleAll}
            aria-label="Seleccionar todos"
            className="size-4 cursor-pointer"
          />
        </th>
      )}
      <th className={cn(thClass, onSelectionChange ? "w-[28%]" : "w-[32%]")}>
        <Typography variant="body2">Nombre</Typography>
      </th>
      <th className={cn(thClass, "w-[14%]")}>
        <Typography variant="body2">Equipo</Typography>
      </th>
      <th className={cn(thClass, "w-[28%]")}>{renderSizeHeader()}</th>
      <th className={cn(thClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
        <Typography variant="body2">Acciones</Typography>
      </th>
    </tr>
  );

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      {renderMobileFilters()}
      {products.length === 0 ? (
        <>
          <AdminTableMobileEmpty message="No hay productos" />
          <AdminTable>
            <thead className="bg-muted/50">
              {renderDesktopHeaderRow(true)}
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={colSpan} message="No hay productos" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {onSelectionChange && (
              <Box
                display="flex"
                className="items-center gap-3 px-3 py-2.5 bg-muted/30 sm:px-4 sm:py-3"
              >
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={handleToggleAll}
                  aria-label="Seleccionar todos"
                  className="size-4 cursor-pointer"
                />
                <Typography variant="body2">Seleccionar todos</Typography>
              </Box>
            )}
            {products.map((p, index) => (
              <AdminTableMobileCard
                key={p.id}
                selected={selectedSet.has(p.id)}
                stripeIndex={index}
              >
                <Box display="flex" justify="between" align="start" gap="2" className="w-full min-w-0">
                  <Box display="flex" align="start" gap="2" className="min-w-0">
                    {onSelectionChange && (
                      <input
                        type="checkbox"
                        checked={selectedSet.has(p.id)}
                        onChange={() => handleToggleRow(p.id)}
                        aria-label={`Seleccionar ${p.name}`}
                        className="size-4 cursor-pointer shrink-0 mt-0.5"
                      />
                    )}
                    <AdminTableProductName
                      name={p.name}
                      imageUrl={p.image_urls?.[0]}
                      href={`/product/${(p.slug || generateSlug(p.name))}-${p.id}`}
                      imageClassName="h-9 w-9"
                      className="min-w-0 items-start gap-2"
                      inactive={!p.is_active}
                    />
                  </Box>
                  <AdminTableMobileActionsMenu actions={getRowActions(p)} />
                </Box>
                <AdminTableMobileSummary
                  left={p.team ?? "—"}
                  right={formatPrice(p.price)}
                />
                <AdminProductSizeStock
                  product={p}
                  highlightSize={sizeFilter || undefined}
                  className="min-w-0 max-w-none"
                />
              </AdminTableMobileCard>
            ))}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="bg-muted/50">
              {renderDesktopHeaderRow(true)}
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.id}
                  className={adminTableRowClassName({
                    stripeIndex: index,
                    selected: selectedSet.has(p.id),
                  })}
                >
                  {onSelectionChange && (
                    <td className={cn(cellClass, ADMIN_TABLE_CHECKBOX_COLUMN_CLASS)}>
                      <input
                        type="checkbox"
                        checked={selectedSet.has(p.id)}
                        onChange={() => handleToggleRow(p.id)}
                        aria-label={`Seleccionar ${p.name}`}
                        className="size-4 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className={cellClass}>
                    <AdminTableProductName
                      name={p.name}
                      imageUrl={p.image_urls?.[0]}
                      href={`/product/${(p.slug || generateSlug(p.name))}-${p.id}`}
                      inactive={!p.is_active}
                    />
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2" className="truncate">
                      {p.team ?? "—"}
                    </Typography>
                  </td>
                  <td className={cellClass}>
                    <div className="flex w-full min-w-0 items-center justify-between gap-x-3 gap-y-1.5">
                      <AdminProductSizeStock
                        product={p}
                        highlightSize={sizeFilter || undefined}
                        className="min-w-0 flex-1 pt-0"
                      />
                      <Typography variant="body2" className="shrink-0 whitespace-nowrap tabular-nums">
                        {formatPrice(p.price)}
                      </Typography>
                    </div>
                  </td>
                  <td className={cn(cellClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                    <AdminTableMobileActionsMenu actions={getRowActions(p)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </>
      )}

      {tableFooter}

      <AdminTablePagination
        page={page}
        perPage={perPage}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Box>
  );
}

export { PER_PAGE };
