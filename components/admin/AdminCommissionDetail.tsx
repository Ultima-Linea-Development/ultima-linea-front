"use client";

import type { ReactNode } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  AdminTableMobileCard,
  AdminTableMobileField,
  AdminTableMobileGrid,
  AdminTableMobileList,
  ADMIN_DETAIL_TABLE_CLASS,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_OUTER_BORDER_CLASS,
  ADMIN_TABLE_TH_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { Commission, SaleAssignableUser } from "@/lib/api";
import AdminCommissionStatusBadge from "@/components/admin/AdminCommissionStatusBadge";
import AdminSupplierOrderSizeQuantity from "@/components/admin/AdminSupplierOrderSizeQuantity";
import {
  getCommissionSellerLabel,
} from "@/lib/commission-display";
import { cn, formatPrice } from "@/lib/utils";

type AdminCommissionDetailProps = {
  commission: Commission;
  assignableUsers?: SaleAssignableUser[];
  onEdit?: (commission: Commission) => void;
  onExport?: (commission: Commission) => void;
};

export default function AdminCommissionDetail({
  commission,
  assignableUsers = [],
  onEdit,
  onExport,
}: AdminCommissionDetailProps) {
  const thClass = ADMIN_TABLE_TH_CLASS;
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const totalPrice = commission.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const metadataItems: {
    key: string;
    label: string;
    value: ReactNode;
    preWrap?: boolean;
  }[] = [
    { key: "customer", label: "Cliente", value: commission.customer_name },
    {
      key: "contact",
      label: "Contacto",
      value: commission.customer_contact ?? "—",
    },
    {
      key: "seller",
      label: "Vendedor",
      value: getCommissionSellerLabel(commission, assignableUsers),
    },
    {
      key: "status",
      label: "Estado",
      value: <AdminCommissionStatusBadge status={commission.status} />,
    },
    {
      key: "order",
      label: "Pedido asignado",
      value: commission.supplier_order_name ?? "—",
    },
    ...(commission.notes
      ? [{ key: "notes", label: "Notas", value: commission.notes, preWrap: true as const }]
      : []),
  ];

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      <div className="grid w-full grid-cols-1 gap-4 border border-border bg-muted/30 p-4 md:grid-cols-3 md:gap-6">
        {metadataItems.map((item) => (
          <div key={item.key} className="flex min-w-0 w-full flex-col gap-1">
            <Typography variant="caption" color="muted">
              {item.label}
            </Typography>
            {typeof item.value === "string" ? (
              <Typography
                variant="body2"
                className={item.preWrap ? "whitespace-pre-wrap break-words" : "break-words"}
              >
                {item.value}
              </Typography>
            ) : (
              item.value
            )}
          </div>
        ))}
      </div>

      <AdminTableMobileList bleed="modal">
        {commission.items.map((item, index) => (
          <AdminTableMobileCard key={item.id} stripeIndex={index}>
            <Box display="flex" direction="col" gap="3">
              <Typography variant="body2">{item.shirt_name}</Typography>
              <AdminTableMobileGrid>
                <AdminTableMobileField label="Cantidad">
                  <Typography variant="body2">{item.quantity}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Tipo">
                  <Typography variant="body2">{item.type}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Talles" fullWidth>
                  <AdminSupplierOrderSizeQuantity item={item} />
                </AdminTableMobileField>
                <AdminTableMobileField label="Precio">
                  <Typography variant="body2">{formatPrice(item.price)}</Typography>
                </AdminTableMobileField>
              </AdminTableMobileGrid>
            </Box>
          </AdminTableMobileCard>
        ))}
        <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
          <Typography variant="body2" className="font-medium">
            Total estimado
          </Typography>
          <Typography variant="body2" className="font-medium">
            {formatPrice(totalPrice)}
          </Typography>
        </div>
      </AdminTableMobileList>

      <div className={cn("hidden md:block", ADMIN_TABLE_OUTER_BORDER_CLASS)}>
        <table className={ADMIN_DETAIL_TABLE_CLASS}>
          <thead className="bg-muted/50">
            <tr>
              <th className={thClass}>
                <Typography variant="body2">Producto</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Cant.</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Tipo</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Talles</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Precio</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {commission.items.map((item, index) => (
              <tr key={item.id} className={adminTableRowClassName({ stripeIndex: index })}>
                <td className={cellClass}>
                  <Typography variant="body2">{item.shirt_name}</Typography>
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{item.quantity}</Typography>
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{item.type}</Typography>
                </td>
                <td className={cellClass}>
                  <AdminSupplierOrderSizeQuantity item={item} />
                </td>
                <td className={cellClass}>
                  <Typography variant="body2" className="whitespace-nowrap tabular-nums">
                    {formatPrice(item.price)}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(onEdit || onExport) && (
        <Box display="flex" gap="3" className="justify-end flex-wrap">
          {onEdit && commission.status !== "exported" && (
            <Button type="button" onClick={() => onEdit(commission)}>
              Editar encargo
            </Button>
          )}
          {onExport && commission.status === "pending" && (
            <Button type="button" variant="outline" onClick={() => onExport(commission)}>
              Exportar a pedido
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
