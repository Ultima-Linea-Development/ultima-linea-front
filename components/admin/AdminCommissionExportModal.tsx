"use client";

import { useEffect, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import FormField from "@/components/ui/FormField";
import Typography from "@/components/ui/Typography";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import type { Commission, SupplierOrder } from "@/lib/api";
import { getSupplierOrderStatusLabel } from "@/lib/supplier-order-display";

type AdminCommissionExportModalProps = {
  commission: Commission;
  orders: SupplierOrder[];
  isSubmitting: boolean;
  onExport: (supplierOrderId: string) => Promise<boolean>;
  onCancel: () => void;
};

export default function AdminCommissionExportModal({
  commission,
  orders,
  isSubmitting,
  onExport,
  onCancel,
}: AdminCommissionExportModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState("");

  useEffect(() => {
    setSelectedOrderId("");
  }, [commission.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOrderId) return;
    await onExport(selectedOrderId);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
        <Typography variant="body2" color="muted">
          Se agregarán {commission.items.length}{" "}
          {commission.items.length === 1 ? "producto" : "productos"} del encargo de{" "}
          {commission.customer_name} al pedido seleccionado.
        </Typography>

        <FormField htmlFor="export-order-id" label="Pedido existente" required>
          <Select
            id="export-order-id"
            value={selectedOrderId}
            onChange={(event) => setSelectedOrderId(event.target.value)}
            disabled={isSubmitting}
            required
          >
            <option value="">Seleccionar pedido</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.name}
                {order.supplier_name ? ` (${order.supplier_name})` : ""} ·{" "}
                {getSupplierOrderStatusLabel(order.status)}
              </option>
            ))}
          </Select>
        </FormField>

        <Box display="flex" gap="3" className="justify-end flex-wrap">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedOrderId}>
            {isSubmitting ? "Exportando..." : "Exportar al pedido"}
          </Button>
        </Box>
      </Box>
    </Form>
  );
}
