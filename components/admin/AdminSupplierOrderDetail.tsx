"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import {
  AdminTableMobileCard,
  AdminTableMobileField,
  AdminTableMobileGrid,
  AdminTableMobileList,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_TH_CLASS,
  ADMIN_TABLE_OUTER_BORDER_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { SupplierOrder } from "@/lib/api";
import {
  getSupplierOrderItemTypeLabel,
  getSupplierOrderStatusLabel,
} from "@/lib/supplier-order-display";
import { cn, formatPrice } from "@/lib/utils";

type AdminSupplierOrderDetailProps = {
  order: SupplierOrder;
};

function formatBoolean(value: boolean): string {
  return value ? "Sí" : "No";
}

export default function AdminSupplierOrderDetail({ order }: AdminSupplierOrderDetailProps) {
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const thClass = ADMIN_TABLE_TH_CLASS;
  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const metadataItems = [
    { key: "supplier", label: "Proveedor", value: order.supplier_name ?? "—" },
    { key: "status", label: "Estado", value: getSupplierOrderStatusLabel(order.status) },
    ...(order.notes
      ? [{ key: "notes", label: "Notas", value: order.notes, preWrap: true as const }]
      : []),
  ];

  const metadataGridClass =
    metadataItems.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-4 border border-border bg-muted/30 p-4",
          metadataGridClass,
          "md:gap-6"
        )}
      >
        {metadataItems.map((item) => (
          <div key={item.key} className="flex min-w-0 w-full flex-col gap-1">
            <Typography variant="caption" color="muted">
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              className={item.preWrap ? "whitespace-pre-wrap break-words" : "break-words"}
            >
              {item.value}
            </Typography>
          </div>
        ))}
      </div>

      <AdminTableMobileList bleed="modal">
        {order.items.map((item, index) => (
          <AdminTableMobileCard key={item.id} stripeIndex={index}>
            <Box display="flex" direction="col" gap="3">
              <Typography variant="body2">{item.shirt_name}</Typography>
              <AdminTableMobileGrid>
                <AdminTableMobileField label="Cantidad">
                  <Typography variant="body2">{item.quantity}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Tipo">
                  <Typography variant="body2">
                    {getSupplierOrderItemTypeLabel(item.type)}
                  </Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Talles">
                  <Typography variant="body2">{item.sizes}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Dorsal">
                  <Typography variant="body2">{item.dorsal ?? "—"}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Precio">
                  <Typography variant="body2">{formatPrice(item.price)}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Descargada">
                  <Typography variant="body2">{formatBoolean(item.downloaded)}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Limpieza">
                  <Typography variant="body2">{formatBoolean(item.cleaned)}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Pedida">
                  <Typography variant="body2">{formatBoolean(item.ordered)}</Typography>
                </AdminTableMobileField>
                {item.description && (
                  <AdminTableMobileField label="Descripción" fullWidth>
                    <Typography variant="body2">{item.description}</Typography>
                  </AdminTableMobileField>
                )}
                {item.link && (
                  <AdminTableMobileField label="Link" fullWidth>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      Abrir link
                    </a>
                  </AdminTableMobileField>
                )}
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

      <div className={cn("hidden md:block overflow-x-auto", ADMIN_TABLE_OUTER_BORDER_CLASS)}>
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="bg-muted/50">
            <tr>
              <th className={thClass}>Camiseta</th>
              <th className={thClass}>Cant.</th>
              <th className={thClass}>Tipo</th>
              <th className={thClass}>Talles</th>
              <th className={thClass}>Dorsal</th>
              <th className={thClass}>Descripción</th>
              <th className={thClass}>Link</th>
              <th className={thClass}>Desc.</th>
              <th className={thClass}>Limp.</th>
              <th className={thClass}>Precio</th>
              <th className={thClass}>Pedida</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id} className={adminTableRowClassName({ stripeIndex: index })}>
                <td className={cellClass}>{item.shirt_name}</td>
                <td className={cellClass}>{item.quantity}</td>
                <td className={cellClass}>{getSupplierOrderItemTypeLabel(item.type)}</td>
                <td className={cellClass}>{item.sizes}</td>
                <td className={cellClass}>{item.dorsal ?? "—"}</td>
                <td className={cellClass}>{item.description ?? "—"}</td>
                <td className={cellClass}>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className={cellClass}>{formatBoolean(item.downloaded)}</td>
                <td className={cellClass}>{formatBoolean(item.cleaned)}</td>
                <td className={cellClass}>{formatPrice(item.price)}</td>
                <td className={cellClass}>{formatBoolean(item.ordered)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}
