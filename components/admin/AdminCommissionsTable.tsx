"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminTextLink from "@/components/admin/AdminTextLink";
import AdminCommissionStatusBadge from "@/components/admin/AdminCommissionStatusBadge";
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
  ADMIN_TABLE_TRUNCATE_CELL_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { Commission, SaleAssignableUser } from "@/lib/api";
import {
  getCommissionSellerLabel,
} from "@/lib/commission-display";
import { formatSaleDateDisplay } from "@/lib/sale-date";
import { cn, formatPrice } from "@/lib/utils";

const PER_PAGE = 10;

const COMMISSION_TABLE_COLUMN_CLASS = {
  date: "w-[11%]",
  customer: "w-[22%]",
  seller: "w-[18%]",
  status: "w-[13%]",
  products: "w-[18%]",
  total: "w-[10%]",
} as const;

function renderCommissionTableHeader(hasActions: boolean, thClass: string) {
  return (
    <tr>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.date)}>
        <Typography variant="body2">Fecha</Typography>
      </th>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.customer)}>
        <Typography variant="body2">Cliente</Typography>
      </th>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.seller)}>
        <Typography variant="body2">Vendedor</Typography>
      </th>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.status)}>
        <Typography variant="body2">Estado</Typography>
      </th>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.products)}>
        <Typography variant="body2">Productos</Typography>
      </th>
      <th className={cn(thClass, COMMISSION_TABLE_COLUMN_CLASS.total)}>
        <Typography variant="body2">Total</Typography>
      </th>
      {hasActions && (
        <th className={cn(thClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
          <Typography variant="body2">Acciones</Typography>
        </th>
      )}
    </tr>
  );
}

type AdminCommissionsTableProps = {
  commissions: Commission[];
  assignableUsers: SaleAssignableUser[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails?: (commission: Commission) => void;
  onEdit?: (commission: Commission) => void;
  onExport?: (commission: Commission) => void;
  onDelete?: (commission: Commission) => void;
  canDeleteCommission?: (commission: Commission) => boolean;
};

function getCommissionItemsLabel(commission: Commission): string {
  const itemCount = commission.items.length;
  const quantity = commission.items.reduce((sum, item) => sum + item.quantity, 0);
  return `${itemCount} ${itemCount === 1 ? "producto" : "productos"} · ${quantity} uds.`;
}

function getCommissionTotal(commission: Commission): number {
  return commission.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function AdminCommissionsTable({
  commissions,
  assignableUsers,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onViewDetails,
  onEdit,
  onExport,
  onDelete,
  canDeleteCommission,
}: AdminCommissionsTableProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;
  const truncateCellClass = ADMIN_TABLE_TRUNCATE_CELL_CLASS;
  const hasActions = Boolean(onViewDetails || onEdit || onExport || onDelete);

  const getCommissionCustomerHandler = (commission: Commission) => {
    if (onEdit && commission.status !== "exported") {
      return () => onEdit(commission);
    }
    if (onViewDetails) {
      return () => onViewDetails(commission);
    }
    return undefined;
  };

  const getRowActions = (commission: Commission): AdminTableMobileAction[] => {
    const actions: AdminTableMobileAction[] = [];

    if (onViewDetails) {
      actions.push({
        id: "view",
        label: "Ver detalles",
        icon: "visibility",
        onClick: () => onViewDetails(commission),
      });
    }

    if (onEdit && commission.status !== "exported") {
      actions.push({
        id: "edit",
        label: "Editar",
        icon: "edit",
        onClick: () => onEdit(commission),
      });
    }

    if (onExport && commission.status === "pending") {
      actions.push({
        id: "export",
        label: "Exportar a pedido",
        icon: "orders",
        onClick: () => onExport(commission),
      });
    }

    if (onDelete && (!canDeleteCommission || canDeleteCommission(commission))) {
      actions.push({
        id: "delete",
        label: "Eliminar",
        icon: "delete",
        onClick: () => onDelete(commission),
        destructive: true,
      });
    }

    return actions;
  };

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      {commissions.length === 0 ? (
        <>
          <AdminTableMobileEmpty message="No hay encargos" />
          <AdminTable>
            <thead className="bg-muted/50">
              {renderCommissionTableHeader(hasActions, thClass)}
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={hasActions ? 7 : 6} message="No hay encargos" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {commissions.map((commission, index) => (
              <AdminTableMobileCard key={commission.id} stripeIndex={index}>
                <Box display="flex" justify="between" align="start" gap="2" className="w-full min-w-0">
                  {getCommissionCustomerHandler(commission) ? (
                    <AdminTextLink
                      tone="default"
                      onClick={getCommissionCustomerHandler(commission)}
                      className="block min-w-0 text-left"
                    >
                      <Typography variant="body2" className="line-clamp-2">
                        {commission.customer_name}
                      </Typography>
                    </AdminTextLink>
                  ) : (
                    <Typography variant="body2" className="line-clamp-2">
                      {commission.customer_name}
                    </Typography>
                  )}
                  {hasActions && <AdminTableMobileActionsMenu actions={getRowActions(commission)} />}
                </Box>
                <AdminTableMobileSummary
                  left={
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <span className="truncate">
                        {getCommissionSellerLabel(commission, assignableUsers)}
                      </span>
                      <AdminCommissionStatusBadge status={commission.status} size="sm" />
                    </span>
                  }
                  right={formatPrice(getCommissionTotal(commission))}
                />
                <AdminTableMobileSubtext>
                  {formatSaleDateDisplay(commission.created_at)} · {getCommissionItemsLabel(commission)}
                  {commission.supplier_order_name ? ` · ${commission.supplier_order_name}` : ""}
                </AdminTableMobileSubtext>
              </AdminTableMobileCard>
            ))}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="bg-muted/50">
              {renderCommissionTableHeader(hasActions, thClass)}
            </thead>
            <tbody>
              {commissions.map((commission, index) => (
                <tr key={commission.id} className={adminTableRowClassName({ stripeIndex: index })}>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.date)}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatSaleDateDisplay(commission.created_at)}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.customer)}>
                    {getCommissionCustomerHandler(commission) ? (
                      <AdminTextLink
                        tone="default"
                        onClick={getCommissionCustomerHandler(commission)}
                        className="block min-w-0 max-w-full truncate text-left"
                      >
                        <Typography variant="body2" as="span" className="truncate">
                          {commission.customer_name}
                        </Typography>
                      </AdminTextLink>
                    ) : (
                      <Typography variant="body2" className="truncate">
                        {commission.customer_name}
                      </Typography>
                    )}
                  </td>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.seller)}>
                    <Typography variant="body2" className="truncate">
                      {getCommissionSellerLabel(commission, assignableUsers)}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.status)}>
                    <AdminCommissionStatusBadge status={commission.status} />
                  </td>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.products)}>
                    <Typography variant="body2" className="truncate">
                      {getCommissionItemsLabel(commission)}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, COMMISSION_TABLE_COLUMN_CLASS.total)}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatPrice(getCommissionTotal(commission))}
                    </Typography>
                  </td>
                  {hasActions && (
                    <td className={cn(cellClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                      <AdminTableMobileActionsMenu actions={getRowActions(commission)} />
                    </td>
                  )}
                </tr>
              ))}
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
