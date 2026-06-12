"use client";

import { useMemo } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminTableProductName from "@/components/admin/AdminTableProductName";
import AdminTableMobileActionsMenu, {
  type AdminTableMobileAction,
} from "@/components/admin/AdminTableMobileActionsMenu";
import {
  AdminTable,
  AdminTableEmptyRow,
  AdminTableMobileCard,
  AdminTableMobileEmpty,
  AdminTableMobileField,
  AdminTableMobileGrid,
  AdminTableMobileList,
  AdminTablePagination,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_TH_CLASS,
} from "@/components/admin/AdminTable";
import type { Product, Sale, SaleAssignableUser } from "@/lib/api";
import {
  formatSaleProductsLabel,
  formatSaleSizesLabel,
  getSalePrimaryLineItem,
  getSaleQuantityTotal,
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
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={thClass}>
                  <Typography variant="body2">Fecha</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Producto</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Talle</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Cantidad</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Total</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Vendedor</Typography>
                </th>
                {hasActions && (
                  <th className={thClass}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={hasActions ? 7 : 6} message="No hay ventas" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {sales.map((sale) => {
              const primaryItem = getSalePrimaryLineItem(sale);
              return (
              <AdminTableMobileCard key={sale.id}>
                <Box display="flex" justify="between" align="start" gap="3" className="mb-3 w-full">
                  <AdminTableProductName
                    name={formatSaleProductsLabel(sale)}
                    imageUrl={primaryItem ? productImages[primaryItem.product_id] : undefined}
                    onClick={onViewDetails ? () => onViewDetails(sale) : undefined}
                    className="min-w-0 items-start"
                  />
                  {hasActions && <AdminTableMobileActionsMenu actions={getRowActions(sale)} />}
                </Box>
                <AdminTableMobileGrid>
                  <AdminTableMobileField label="Fecha" fullWidth>
                    <Typography variant="body2">
                      {formatSaleDateDisplay(sale.created_at)}
                    </Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Talle">
                    <Typography variant="body2">{formatSaleSizesLabel(sale)}</Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Cantidad">
                    <Typography variant="body2">{getSaleQuantityTotal(sale)}</Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Total">
                    <Typography variant="body2">{formatPrice(sale.total)}</Typography>
                  </AdminTableMobileField>
                  <AdminTableMobileField label="Vendedor" fullWidth>
                    <Typography variant="body2">
                      {getSaleSellerLabel(sale, assignableUsers)}
                    </Typography>
                  </AdminTableMobileField>
                </AdminTableMobileGrid>
              </AdminTableMobileCard>
            );
            })}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={thClass}>
                  <Typography variant="body2">Fecha de venta</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Producto</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Talle</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Cantidad</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Total</Typography>
                </th>
                <th className={thClass}>
                  <Typography variant="body2">Vendedor</Typography>
                </th>
                {hasActions && (
                  <th className={thClass}>
                    <Typography variant="body2">Acciones</Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                const primaryItem = getSalePrimaryLineItem(sale);
                return (
                <tr
                  key={sale.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30"
                >
                  <td className={cellClass}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatSaleDateDisplay(sale.created_at)}
                    </Typography>
                  </td>
                  <td className={cn(cellClass, "min-w-[160px] max-w-[280px]")}>
                    <AdminTableProductName
                      name={formatSaleProductsLabel(sale)}
                      imageUrl={primaryItem ? productImages[primaryItem.product_id] : undefined}
                      onClick={onViewDetails ? () => onViewDetails(sale) : undefined}
                    />
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{formatSaleSizesLabel(sale)}</Typography>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{getSaleQuantityTotal(sale)}</Typography>
                  </td>
                  <td className={cellClass}>
                    <span className="whitespace-nowrap">
                      <Typography variant="body2">{formatPrice(sale.total)}</Typography>
                    </span>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {getSaleSellerLabel(sale, assignableUsers)}
                    </Typography>
                  </td>
                  {hasActions && (
                    <td className={cn(cellClass, "whitespace-nowrap")}>
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
