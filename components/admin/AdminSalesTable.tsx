"use client";

import { useMemo } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminTableProductName from "@/components/admin/AdminTableProductName";
import AdminSaleSizeQuantity from "@/components/admin/AdminSaleSizeQuantity";
import AdminTableMobileActionsMenu, {
  type AdminTableMobileAction,
} from "@/components/admin/AdminTableMobileActionsMenu";
import {
  AdminTable,
  AdminTableEmptyRow,
  AdminTableMobileCard,
  AdminTableMobileEmpty,
  AdminTableMobileList,
  AdminTableMobileSummary,
  AdminTableMobileSubtext,
  AdminTablePagination,
  ADMIN_TABLE_ACTIONS_COLUMN_CLASS,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_TH_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { Product, Sale, SaleAssignableUser } from "@/lib/api";
import {
  formatSaleProductsLabel,
  getSalePrimaryLineItem,
} from "@/lib/sale-items";
import { formatSaleDateDisplay } from "@/lib/sale-date";
import { getSaleSellerLabel } from "@/lib/sale-seller";
import { cn, formatPrice } from "@/lib/utils";

const PER_PAGE = 10;

type AdminSalesTableProps = {
  sales: Sale[];
  products?: Product[];
  assignableUsers?: SaleAssignableUser[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails?: (sale: Sale) => void;
  onEdit?: (sale: Sale) => void;
  onDelete?: (sale: Sale) => void;
  canDeleteSale?: (sale: Sale) => boolean;
};

export default function AdminSalesTable({
  sales,
  products = [],
  assignableUsers = [],
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  canDeleteSale,
}: AdminSalesTableProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;
  const hasActions = Boolean(onViewDetails || onEdit || onDelete);

  const getRowActions = (sale: Sale): AdminTableMobileAction[] => {
    const actions: AdminTableMobileAction[] = [];

    if (onViewDetails) {
      actions.push({
        id: "view",
        label: "Ver detalles",
        icon: "visibility",
        onClick: () => onViewDetails(sale),
      });
    }

    if (onEdit) {
      actions.push({
        id: "edit",
        label: "Editar",
        icon: "edit",
        onClick: () => onEdit(sale),
      });
    }

    if (onDelete && (!canDeleteSale || canDeleteSale(sale))) {
      actions.push({
        id: "delete",
        label: "Eliminar",
        icon: "delete",
        onClick: () => onDelete(sale),
        destructive: true,
      });
    }

    return actions;
  };

  const productImages = useMemo(
    () =>
      Object.fromEntries(
        products.map((product) => [product.id, product.image_urls?.[0]] as const)
      ),
    [products]
  );

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      {sales.length === 0 ? (
        <>
          <AdminTableMobileEmpty message="No hay ventas" />
          <AdminTable>
            <thead className="bg-muted/50">
              <tr>
                <th className={cn(thClass, "w-[12%]")}>
                  <Typography variant="body2">Fecha</Typography>
                </th>
                <th className={cn(thClass, "w-[30%]")}>
                  <Typography variant="body2">Producto</Typography>
                </th>
                <th className={cn(thClass, "w-[22%]")}>
                  <Typography variant="body2">Talles</Typography>
                </th>
                <th className={cn(thClass, "w-[20%]")}>
                  <Typography variant="body2">Vendedor</Typography>
                </th>
                {hasActions && (
                  <th className={cn(thClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={hasActions ? 5 : 4} message="No hay ventas" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {sales.map((sale, index) => {
              const primaryItem = getSalePrimaryLineItem(sale);
              return (
              <AdminTableMobileCard key={sale.id} stripeIndex={index}>
                <Box display="flex" justify="between" align="start" gap="2" className="w-full min-w-0">
                  <AdminTableProductName
                    name={formatSaleProductsLabel(sale)}
                    imageUrl={primaryItem ? productImages[primaryItem.product_id] : undefined}
                    onClick={onViewDetails ? () => onViewDetails(sale) : undefined}
                    imageClassName="h-9 w-9"
                    className="min-w-0 items-start gap-2"
                  />
                  {hasActions && <AdminTableMobileActionsMenu actions={getRowActions(sale)} />}
                </Box>
                <AdminTableMobileSummary
                  left={
                    <>
                      {formatSaleDateDisplay(sale.created_at)}
                      {" · "}
                      {getSaleSellerLabel(sale, assignableUsers)}
                    </>
                  }
                  right={formatPrice(sale.total)}
                />
                <AdminTableMobileSubtext>
                  <AdminSaleSizeQuantity sale={sale} className="min-w-0 max-w-none" />
                </AdminTableMobileSubtext>
              </AdminTableMobileCard>
            );
            })}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="bg-muted/50">
              <tr>
                <th className={cn(thClass, "w-[12%]")}>
                  <Typography variant="body2">Fecha de venta</Typography>
                </th>
                <th className={cn(thClass, "w-[30%]")}>
                  <Typography variant="body2">Producto</Typography>
                </th>
                <th className={cn(thClass, "w-[22%]")}>
                  <Typography variant="body2">Talles</Typography>
                </th>
                <th className={cn(thClass, "w-[20%]")}>
                  <Typography variant="body2">Vendedor</Typography>
                </th>
                {hasActions && (
                  <th className={cn(thClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => {
                const primaryItem = getSalePrimaryLineItem(sale);
                return (
                <tr
                  key={sale.id}
                  className={adminTableRowClassName({ stripeIndex: index })}
                >
                  <td className={cellClass}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatSaleDateDisplay(sale.created_at)}
                    </Typography>
                  </td>
                  <td className={cellClass}>
                    <AdminTableProductName
                      name={formatSaleProductsLabel(sale)}
                      imageUrl={primaryItem ? productImages[primaryItem.product_id] : undefined}
                      onClick={onViewDetails ? () => onViewDetails(sale) : undefined}
                    />
                  </td>
                  <td className={cellClass}>
                    <div className="flex w-full min-w-0 items-center justify-between gap-x-3 gap-y-1.5">
                      <AdminSaleSizeQuantity sale={sale} className="min-w-0 flex-1 pt-0" />
                      <Typography variant="body2" className="shrink-0 whitespace-nowrap tabular-nums">
                        {formatPrice(sale.total)}
                      </Typography>
                    </div>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {getSaleSellerLabel(sale, assignableUsers)}
                    </Typography>
                  </td>
                  {hasActions && (
                    <td className={cn(cellClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                      <AdminTableMobileActionsMenu actions={getRowActions(sale)} />
                    </td>
                  )}
                </tr>
              );
              })}
            </tbody>
          </AdminTable>
        </>
      )}

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
