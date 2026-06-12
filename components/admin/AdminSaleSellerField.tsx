"use client";

import { useMemo } from "react";
import Box from "@/components/layout/Box";
import AdminSaleDateField from "@/components/admin/AdminSaleDateField";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Typography from "@/components/ui/Typography";
import type { ExternalSeller, SaleAssignableUser } from "@/lib/api";
import { formFieldClassName } from "@/lib/form-field-classes";
import {
  NEW_EXTERNAL_SELLER_VALUE,
  type SaleSellerFormValue,
} from "@/lib/sale-seller";
import { formatAssignableUserLabel } from "@/lib/user-display";

type AdminSaleSellerFieldProps = {
  value: SaleSellerFormValue;
  onChange: (value: SaleSellerFormValue) => void;
  assignableUsers: SaleAssignableUser[];
  externalSellers: ExternalSeller[];
  canAssignUser: boolean;
  currentUserId?: string | null;
  saleDate: string;
  onSaleDateChange: (value: string) => void;
  saleDateId?: string;
  disabled?: boolean;
};

const fieldLabelClassName = "w-full min-w-0";

export default function AdminSaleSellerField({
  value,
  onChange,
  assignableUsers,
  externalSellers,
  canAssignUser,
  currentUserId = null,
  saleDate,
  onSaleDateChange,
  saleDateId = "sale-date",
  disabled = false,
}: AdminSaleSellerFieldProps) {
  const internalSellerOptions = useMemo(() => {
    if (canAssignUser) return assignableUsers;
    if (!currentUserId) return [];

    const self = assignableUsers.find((user) => user.id === currentUserId);
    return self ? [self] : [];
  }, [assignableUsers, canAssignUser, currentUserId]);

  const showInternalAssignee = value.sellerType === "internal" && internalSellerOptions.length > 0;
  const isSelfOnlyAssignee = !canAssignUser && internalSellerOptions.length === 1;
  const showExternalPicker = value.sellerType === "external";
  const showNewExternalName =
    showExternalPicker &&
    (!value.externalSellerId || value.externalSellerId === NEW_EXTERNAL_SELLER_VALUE);

  return (
    <Box display="flex" direction="col" gap="3" className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        <div className="min-w-0 w-full">
          <Label htmlFor={saleDateId} display="block" spacing="sm" className={fieldLabelClassName}>
            <Typography variant="body2" mb={1}>
              Fecha de venta *
            </Typography>
            <AdminSaleDateField
              id={saleDateId}
              value={saleDate}
              onChange={onSaleDateChange}
              disabled={disabled}
              required
            />
          </Label>
        </div>

        <div className="min-w-0 w-full">
          <Label htmlFor="sale-seller-type" display="block" spacing="sm" className={fieldLabelClassName}>
            <Typography variant="body2" mb={1}>
              Vendedor *
            </Typography>
            <select
              id="sale-seller-type"
              value={value.sellerType}
              onChange={(event) => {
                const sellerType = event.target.value as SaleSellerFormValue["sellerType"];
                onChange({
                  ...value,
                  sellerType,
                  ...(sellerType === "internal" && !canAssignUser && currentUserId
                    ? { internalUserId: currentUserId }
                    : {}),
                });
              }}
              disabled={disabled}
              required
              className={formFieldClassName}
            >
              <option value="internal">Usuario del sistema</option>
              <option value="external">Vendedor externo</option>
            </select>
          </Label>
        </div>

        {showInternalAssignee && (
          <div className="min-w-0 w-full">
            <Label htmlFor="sale-internal-seller" display="block" spacing="sm" className={fieldLabelClassName}>
              <Typography variant="body2" mb={1}>
                Usuario asignado *
              </Typography>
              <select
                id="sale-internal-seller"
                value={value.internalUserId}
                onChange={(event) =>
                  onChange({
                    ...value,
                    internalUserId: event.target.value,
                  })
                }
                disabled={disabled || isSelfOnlyAssignee}
                required
                className={formFieldClassName}
              >
                {internalSellerOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {formatAssignableUserLabel(user)}
                  </option>
                ))}
              </select>
            </Label>
          </div>
        )}

        {showExternalPicker && (
          <div className="min-w-0 w-full">
            <Label htmlFor="sale-external-seller" display="block" spacing="sm" className={fieldLabelClassName}>
              <Typography variant="body2" mb={1}>
                Vendedor externo *
              </Typography>
              <select
                id="sale-external-seller"
                value={value.externalSellerId || NEW_EXTERNAL_SELLER_VALUE}
                onChange={(event) => {
                  const nextId = event.target.value;
                  onChange({
                    ...value,
                    externalSellerId: nextId,
                    externalSellerName:
                      nextId === NEW_EXTERNAL_SELLER_VALUE ? value.externalSellerName : "",
                  });
                }}
                disabled={disabled}
                required
                className={formFieldClassName}
              >
                {externalSellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
                <option value={NEW_EXTERNAL_SELLER_VALUE}>Agregar nuevo...</option>
              </select>
            </Label>
          </div>
        )}
      </div>

      {showNewExternalName && (
        <Label htmlFor="sale-external-seller-name" display="block" spacing="sm" className={fieldLabelClassName}>
          <Typography variant="body2" mb={1}>
            Nombre del vendedor *
          </Typography>
          <Input
            id="sale-external-seller-name"
            value={value.externalSellerName}
            onChange={(event) =>
              onChange({
                ...value,
                externalSellerId: NEW_EXTERNAL_SELLER_VALUE,
                externalSellerName: event.target.value,
              })
            }
            placeholder="Ej: Juan Pérez"
            disabled={disabled}
            required
          />
        </Label>
      )}
    </Box>
  );
}
