"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminTableProductName from "@/components/admin/AdminTableProductName";
import {
  AdminTableMobileCard,
  AdminTableMobileField,
  AdminTableMobileGrid,
  AdminTableMobileList,
  ADMIN_DETAIL_TABLE_CLASS,
  ADMIN_TABLE_CELL_CLASS,
  ADMIN_TABLE_DESKTOP_CLASS,
  ADMIN_TABLE_MODAL_WRAPPER_CLASS,
  ADMIN_TABLE_TH_CLASS,
  adminTableRowClassName,
} from "@/components/admin/AdminTable";
import type { Product, SupplierOrder, SupplierOrderLineItem } from "@/lib/api";
import AdminSupplierOrderSizeQuantity from "@/components/admin/AdminSupplierOrderSizeQuantity";
import AdminSupplierOrderStatusBadge from "@/components/admin/AdminSupplierOrderStatusBadge";
import AdminSupplierOrderTrackingCell from "@/components/admin/AdminSupplierOrderTrackingCell";
import { getProductPrimaryImageUrl } from "@/lib/admin-product-image";
import { getSupplierOrderItemTypeLabel } from "@/lib/supplier-order-display";
import { getSupplierOrderTotal } from "@/lib/supplier-order-costs";
import { formatSaleDateDisplay } from "@/lib/sale-date";
import { cn, formatPrice, generateSlug } from "@/lib/utils";

type AdminSupplierOrderDetailProps = {
  order: SupplierOrder;
  products?: Product[];
};

export default function AdminSupplierOrderDetail({
  order,
  products = [],
}: AdminSupplierOrderDetailProps) {
  const thClass = ADMIN_TABLE_TH_CLASS;
  const cellClass = ADMIN_TABLE_CELL_CLASS;
  const totalPrice = getSupplierOrderTotal(order);
  const productById = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product] as const)),
    [products]
  );

  const getProductHref = (item: SupplierOrderLineItem) => {
    if (!item.product_id) return undefined;

    const product = productById[item.product_id];
    if (!product) return undefined;

    const slug = product.slug || generateSlug(product.name);
    return `/product/${slug}-${product.id}`;
  };

  const metadataItems: {
    key: string;
    label: string;
    value: ReactNode;
    preWrap?: boolean;
  }[] = [
    { key: "supplier", label: "Proveedor", value: order.supplier_name ?? "—" },
    {
      key: "status",
      label: "Estado",
      value: <AdminSupplierOrderStatusBadge status={order.status} />,
    },
    {
      key: "paid_at",
      label: "Fecha de pago",
      value: order.paid_at ? formatSaleDateDisplay(order.paid_at) : "—",
    },
    {
      key: "sent_at",
      label: "Fecha de envío",
      value: order.sent_at ? formatSaleDateDisplay(order.sent_at) : "—",
    },
    {
      key: "received_at",
      label: "Fecha de recepción",
      value: order.received_at ? formatSaleDateDisplay(order.received_at) : "—",
    },
    {
      key: "tracking",
      label: "Nro. Seguimiento",
      value: <AdminSupplierOrderTrackingCell order={order} />,
    },
    {
      key: "tax_cost",
      label: "Costo de impuesto",
      value: order.tax_cost ? formatPrice(order.tax_cost) : "—",
    },
    {
      key: "shipping_cost",
      label: "Costo de envío",
      value: order.shipping_cost ? formatPrice(order.shipping_cost) : "—",
    },
    ...(order.notes
      ? [{ key: "notes", label: "Notas", value: order.notes, preWrap: true as const }]
      : []),
  ];

  const metadataGridClass = "md:grid-cols-3";

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

      <AdminTableMobileList>
        {order.items.map((item, index) => (
          <AdminTableMobileCard key={item.id} stripeIndex={index}>
            <Box display="flex" direction="col" gap="3">
              <AdminTableProductName
                name={item.shirt_name}
                imageUrl={getProductPrimaryImageUrl(
                  item.product_id ? productById[item.product_id] : undefined
                )}
                href={getProductHref(item)}
                className="items-start"
              />
              {item.product_id && (
                <Typography variant="body2" color="muted">
                  Producto del catálogo
                </Typography>
              )}
              <AdminTableMobileGrid>
                <AdminTableMobileField label="Cantidad">
                  <Typography variant="body2">{item.quantity}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Tipo">
                  <Typography variant="body2">
                    {getSupplierOrderItemTypeLabel(item.type)}
                  </Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Talles" fullWidth>
                  <AdminSupplierOrderSizeQuantity item={item} showAll />
                </AdminTableMobileField>
                <AdminTableMobileField label="Dorsal">
                  <Typography variant="body2">{item.dorsal ?? "—"}</Typography>
                </AdminTableMobileField>
                <AdminTableMobileField label="Precio">
                  <Typography variant="body2">{formatPrice(item.price)}</Typography>
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

      <div className={cn(ADMIN_TABLE_DESKTOP_CLASS, ADMIN_TABLE_MODAL_WRAPPER_CLASS)}>
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
              <th className={thClass}>
                <Typography variant="body2">Dorsal</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Descripción</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Link</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id} className={adminTableRowClassName({ stripeIndex: index })}>
                <td className={cellClass}>
                  <AdminTableProductName
                    name={item.shirt_name}
                    imageUrl={getProductPrimaryImageUrl(
                      item.product_id ? productById[item.product_id] : undefined
                    )}
                    href={getProductHref(item)}
                  />
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{item.quantity}</Typography>
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{getSupplierOrderItemTypeLabel(item.type)}</Typography>
                </td>
                <td className={cellClass}>
                  <AdminSupplierOrderSizeQuantity item={item} showAll />
                </td>
                <td className={cellClass}>
                  <Typography variant="body2" className="whitespace-nowrap tabular-nums">
                    {formatPrice(item.price)}
                  </Typography>
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{item.dorsal ?? "—"}</Typography>
                </td>
                <td className={cellClass}>
                  <Typography variant="body2">{item.description ?? "—"}</Typography>
                </td>
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
                    <Typography variant="body2">—</Typography>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Box>
  );
}
