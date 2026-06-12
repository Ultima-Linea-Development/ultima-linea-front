"use client";

import { FormEvent, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import AdminSaleSellerField from "@/components/admin/AdminSaleSellerField";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import Div from "@/components/ui/Div";
import Typography from "@/components/ui/Typography";
import { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import type { ExternalSeller, Sale, SaleAssignableUser, UpdateSaleRequest } from "@/lib/api";
import { getSaleLineItems } from "@/lib/sale-items";
import {
  saleSellerValueToPayload,
  saleToSellerFormValue,
  validateSaleSellerValue,
  type SaleSellerFormValue,
} from "@/lib/sale-seller";
import { saleDateInputToApiValue, saleDateIsoToDisplayValue, saleDateToInputValue } from "@/lib/sale-date";
import { formatPrice } from "@/lib/utils";

type AdminSaleEditFormProps = {
  sale: Sale;
  assignableUsers: SaleAssignableUser[];
  externalSellers: ExternalSeller[];
  currentUserId: string | null;
  canAssignUser: boolean;
  isSubmitting: boolean;
  error?: string;
  onSave: (payload: UpdateSaleRequest) => Promise<boolean>;
  onCancel?: () => void;
};

export default function AdminSaleEditForm({
  sale,
  assignableUsers,
  externalSellers,
  currentUserId,
  canAssignUser,
  isSubmitting,
  error,
  onSave,
  onCancel,
}: AdminSaleEditFormProps) {
  const [saleDate, setSaleDate] = useState(() => saleDateIsoToDisplayValue(sale.created_at));
  const [sellerValue, setSellerValue] = useState<SaleSellerFormValue>(() =>
    saleToSellerFormValue(sale, currentUserId)
  );
  const [transferAlias, setTransferAlias] = useState(sale.transfer_alias ?? "");
  const [description, setDescription] = useState(sale.description ?? "");
  const [validationError, setValidationError] = useState("");
  const lineItems = getSaleLineItems(sale);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    if (!saleDate) {
      setValidationError("La fecha es obligatoria.");
      return;
    }

    const sellerError = validateSaleSellerValue(sellerValue, canAssignUser);
    if (sellerError) {
      setValidationError(sellerError);
      return;
    }

    const saleDateApiValue = saleDateInputToApiValue(saleDate);
    if (!saleDateApiValue) {
      setValidationError("Fecha inválida.");
      return;
    }

    const payload: UpdateSaleRequest = {};
    let hasChanges = false;

    if (saleDateApiValue !== saleDateToInputValue(sale.created_at)) {
      payload.sale_date = saleDateApiValue;
      hasChanges = true;
    }

    const initialSeller = saleToSellerFormValue(sale, currentUserId);
    const sellerChanged =
      sellerValue.sellerType !== initialSeller.sellerType ||
      sellerValue.internalUserId !== initialSeller.internalUserId ||
      sellerValue.externalSellerId !== initialSeller.externalSellerId ||
      sellerValue.externalSellerName.trim() !== initialSeller.externalSellerName.trim();

    if (sellerChanged) {
      Object.assign(payload, saleSellerValueToPayload(sellerValue, canAssignUser));
      hasChanges = true;
    }

    const trimmedAlias = transferAlias.trim();
    const initialAlias = sale.transfer_alias ?? "";
    if (trimmedAlias !== initialAlias) {
      payload.transfer_alias = trimmedAlias;
      hasChanges = true;
    }

    const trimmedDescription = description.trim();
    const initialDescription = sale.description ?? "";
    if (trimmedDescription !== initialDescription) {
      payload.description = trimmedDescription;
      hasChanges = true;
    }

    if (!hasChanges) {
      setValidationError("No hay cambios para guardar.");
      return;
    }

    await onSave(payload);
  };

  const displayError = validationError || error;

  return (
    <Form onSubmit={handleSubmit} spacing="md">
      <Div spacing="md">
        <Typography variant="body2" mb={1}>
          Productos
        </Typography>
        <Box display="flex" direction="col" gap="2">
          {lineItems.map((item, index) => (
            <Typography key={`${item.product_id}-${item.size}-${index}`} variant="body2" className="text-muted-foreground">
              {item.product_name}
              {item.size ? ` · Talle ${item.size}` : ""}
              {" · "}
              {item.quantity} x {formatPrice(item.unit_price)} = {formatPrice(item.total)}
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" className="mt-2">
          Total: {formatPrice(sale.total)}
        </Typography>
      </Div>

      <AdminSaleSellerField
        value={sellerValue}
        onChange={setSellerValue}
        assignableUsers={assignableUsers}
        externalSellers={externalSellers}
        canAssignUser={canAssignUser}
        currentUserId={currentUserId}
        saleDate={saleDate}
        onSaleDateChange={setSaleDate}
        saleDateId="edit-sale-date"
        disabled={isSubmitting}
      />

      <Label htmlFor="edit-sale-transfer-alias" display="block" spacing="sm">
        <Typography variant="body2" mb={1}>
          Alias de quien transfirió
        </Typography>
        <Input
          id="edit-sale-transfer-alias"
          value={transferAlias}
          onChange={(event) => setTransferAlias(event.target.value)}
          placeholder="Opcional"
          disabled={isSubmitting}
        />
      </Label>

      <Label htmlFor="edit-sale-description" display="block" spacing="sm">
        <Typography variant="body2" mb={1}>
          Descripción
        </Typography>
        <Textarea
          id="edit-sale-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Opcional"
          disabled={isSubmitting}
          rows={3}
        />
      </Label>

      {displayError && (
        <InlineAlert variant="destructive">
          <Typography variant="body2" color="destructive">
            {displayError}
          </Typography>
        </InlineAlert>
      )}

      <Box display="flex" gap="2" className="flex-wrap">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
      </Box>
    </Form>
  );
}
