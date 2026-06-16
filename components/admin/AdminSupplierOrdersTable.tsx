"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
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
import AdminTextLink from "@/components/admin/AdminTextLink";
import AdminSupplierOrderStatusBadge from "@/components/admin/AdminSupplierOrderStatusBadge";
import AdminSupplierOrderTrackingCell from "@/components/admin/AdminSupplierOrderTrackingCell";
import type { SupplierOrder } from "@/lib/api";
import { formatSaleDateDisplay } from "@/lib/sale-date";
import { cn, formatPrice } from "@/lib/utils";

const PER_PAGE = 10;

const ORDER_TABLE_COLUMN_CLASS = {
  date: "w-[10%]",
  name: "w-[15%]",
  supplier: "w-[15%]",
  status: "w-[12%]",
  tracking: "w-[14%]",
  items: "w-[13%]",
  total: "w-[13%]",
} as const;

function renderOrderTableHeader(hasActions: boolean, thClass: string) {
  return (
    <tr>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.date)}>
        <Typography variant="body2">Fecha</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.name)}>
        <Typography variant="body2">Pedido</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.supplier)}>
        <Typography variant="body2">Proveedor</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.status)}>
        <Typography variant="body2">Estado</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.tracking)}>
        <Typography variant="body2">Nro. Seguimiento</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.items)}>
        <Typography variant="body2">Ítems</Typography>
      </th>
      <th className={cn(thClass, ORDER_TABLE_COLUMN_CLASS.total)}>
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

type AdminSupplierOrdersTableProps = {
  orders: SupplierOrder[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails?: (order: SupplierOrder) => void;
  onEdit?: (order: SupplierOrder) => void;
  onDelete?: (order: SupplierOrder) => void;
  canDeleteOrder?: (order: SupplierOrder) => boolean;
};

function getOrderItemsLabel(order: SupplierOrder): string {
  const itemCount = order.items.length;
  const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return `${itemCount} ${itemCount === 1 ? "ítem" : "ítems"} · ${quantity} uds.`;
}

function getOrderTotal(order: SupplierOrder): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function AdminSupplierOrdersTable({
  orders,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
  canDeleteOrder,
}: AdminSupplierOrdersTableProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;
  const truncateCellClass = ADMIN_TABLE_TRUNCATE_CELL_CLASS;
  const hasActions = Boolean(onViewDetails || onEdit || onDelete);

  const getRowActions = (order: SupplierOrder): AdminTableMobileAction[] => {
    const actions: AdminTableMobileAction[] = [];

    if (onViewDetails) {
      actions.push({
        id: "view",
        label: "Ver detalles",
        icon: "visibility",
        onClick: () => onViewDetails(order),
      });
    }

    if (onEdit) {
      actions.push({
        id: "edit",
        label: "Editar",
        icon: "edit",
        onClick: () => onEdit(order),
      });
    }

    if (onDelete && (!canDeleteOrder || canDeleteOrder(order))) {
      actions.push({
        id: "delete",
        label: "Eliminar",
        icon: "delete",
        onClick: () => onDelete(order),
        destructive: true,
      });
    }

    return actions;
  };

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      {orders.length === 0 ? (
        <>
          <AdminTableMobileEmpty message="No hay pedidos" />
          <AdminTable>
            <thead className="bg-muted/50">
              {renderOrderTableHeader(hasActions, thClass)}
            </thead>
            <tbody>
              <AdminTableEmptyRow colSpan={hasActions ? 8 : 7} message="No hay pedidos" />
            </tbody>
          </AdminTable>
        </>
      ) : (
        <>
          <AdminTableMobileList>
            {orders.map((order, index) => (
              <AdminTableMobileCard key={order.id} stripeIndex={index}>
                <Box display="flex" justify="between" align="start" gap="2" className="w-full min-w-0">
                  {onViewDetails ? (
                    <AdminTextLink
                      tone="default"
                      onClick={() => onViewDetails(order)}
                      className="block min-w-0 text-left"
                    >
                      <Typography variant="body2" className="line-clamp-2">
                        {order.name}
                      </Typography>
                    </AdminTextLink>
                  ) : (
                    <Typography variant="body2" className="line-clamp-2">
                      {order.name}
                    </Typography>
                  )}
                  {hasActions && <AdminTableMobileActionsMenu actions={getRowActions(order)} />}
                </Box>
                <AdminTableMobileSummary
                  left={
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <span className="truncate">{order.supplier_name ?? "Sin proveedor"}</span>
                      <AdminSupplierOrderStatusBadge status={order.status} size="sm" />
                    </span>
                  }
                  right={formatPrice(getOrderTotal(order))}
                />
                <AdminTableMobileSubtext>
                  {formatSaleDateDisplay(order.created_at)} · {getOrderItemsLabel(order)}
                  {(order.tracking_number || order.tracking_link) && (
                    <>
                      {" · "}
                      <AdminSupplierOrderTrackingCell order={order} />
                    </>
                  )}
                </AdminTableMobileSubtext>
              </AdminTableMobileCard>
            ))}
          </AdminTableMobileList>

          <AdminTable>
            <thead className="bg-muted/50">
              {renderOrderTableHeader(hasActions, thClass)}
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} className={adminTableRowClassName({ stripeIndex: index })}>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.date)}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatSaleDateDisplay(order.created_at)}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.name)}>
                    {onViewDetails ? (
                      <AdminTextLink
                        tone="default"
                        onClick={() => onViewDetails(order)}
                        className="block min-w-0 max-w-full truncate text-left"
                      >
                        <Typography variant="body2" as="span" className="truncate">
                          {order.name}
                        </Typography>
                      </AdminTextLink>
                    ) : (
                      <Typography variant="body2" className="truncate">
                        {order.name}
                      </Typography>
                    )}
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.supplier)}>
                    <Typography variant="body2" className="truncate">
                      {order.supplier_name ?? "—"}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.status)}>
                    <AdminSupplierOrderStatusBadge status={order.status} className="max-w-full" />
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.tracking)}>
                    <AdminSupplierOrderTrackingCell order={order} />
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.items)}>
                    <Typography variant="body2" className="truncate">
                      {getOrderItemsLabel(order)}
                    </Typography>
                  </td>
                  <td className={cn(truncateCellClass, ORDER_TABLE_COLUMN_CLASS.total)}>
                    <Typography variant="body2" className="whitespace-nowrap">
                      {formatPrice(getOrderTotal(order))}
                    </Typography>
                  </td>
                  {hasActions && (
                    <td className={cn(cellClass, ADMIN_TABLE_ACTIONS_COLUMN_CLASS)}>
                      <AdminTableMobileActionsMenu actions={getRowActions(order)} />
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
