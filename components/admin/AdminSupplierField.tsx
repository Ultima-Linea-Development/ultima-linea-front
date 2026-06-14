"use client";

import Box from "@/components/layout/Box";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import type { Supplier } from "@/lib/api";
import { NEW_SUPPLIER_VALUE, type SupplierFormValue } from "@/lib/supplier-field";

type AdminSupplierFieldProps = {
  value: SupplierFormValue;
  onChange: (value: SupplierFormValue) => void;
  suppliers: Supplier[];
  disabled?: boolean;
};

const fieldLabelClassName = "w-full min-w-0";

export default function AdminSupplierField({
  value,
  onChange,
  suppliers,
  disabled = false,
}: AdminSupplierFieldProps) {
  const showNewSupplierFields =
    !value.supplierId || value.supplierId === NEW_SUPPLIER_VALUE;

  return (
    <Box display="flex" direction="col" gap="3" align="stretch" className="w-full min-w-0">
      <FormField
        htmlFor="supplier-select"
        label="Proveedor"
        className={fieldLabelClassName}
      >
        <Select
          id="supplier-select"
          value={value.supplierId || NEW_SUPPLIER_VALUE}
          onChange={(event) => {
            const nextId = event.target.value;
            if (nextId === NEW_SUPPLIER_VALUE) {
              onChange({
                ...value,
                supplierId: NEW_SUPPLIER_VALUE,
              });
              return;
            }

            const supplier = suppliers.find((item) => item.id === nextId);
            onChange(supplier ? {
              supplierId: supplier.id,
              supplierName: supplier.name,
              contactName: supplier.contact_name ?? "",
              email: supplier.email ?? "",
              phone: supplier.phone ?? "",
              notes: supplier.notes ?? "",
              link: supplier.link ?? "",
            } : {
              ...value,
              supplierId: nextId,
            });
          }}
          disabled={disabled}
        >
          <option value="">Sin proveedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
          <option value={NEW_SUPPLIER_VALUE}>Agregar nuevo...</option>
        </Select>
      </FormField>

      {showNewSupplierFields && (
        <Box display="flex" direction="col" gap="3" align="stretch" className="w-full min-w-0">
          <FormField
            htmlFor="supplier-name"
            label="Nombre del proveedor"
            required={showNewSupplierFields}
            className={fieldLabelClassName}
          >
            <Input
              id="supplier-name"
              value={value.supplierName}
              onChange={(event) =>
                onChange({
                  ...value,
                  supplierId: value.supplierId || NEW_SUPPLIER_VALUE,
                  supplierName: event.target.value,
                })
              }
              disabled={disabled}
              required={showNewSupplierFields}
            />
          </FormField>

          <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div className="min-w-0 w-full">
              <FormField htmlFor="supplier-contact-name" label="Contacto" className={fieldLabelClassName}>
              <Input
                id="supplier-contact-name"
                value={value.contactName}
                onChange={(event) =>
                  onChange({ ...value, contactName: event.target.value })
                }
                disabled={disabled}
              />
            </FormField>
            </div>

            <div className="min-w-0 w-full">
              <FormField htmlFor="supplier-email" label="Email" className={fieldLabelClassName}>
              <Input
                id="supplier-email"
                type="email"
                value={value.email}
                onChange={(event) =>
                  onChange({ ...value, email: event.target.value })
                }
                disabled={disabled}
              />
            </FormField>
            </div>

            <div className="min-w-0 w-full">
              <FormField htmlFor="supplier-phone" label="Teléfono" className={fieldLabelClassName}>
              <Input
                id="supplier-phone"
                value={value.phone}
                onChange={(event) =>
                  onChange({ ...value, phone: event.target.value })
                }
                disabled={disabled}
              />
            </FormField>
            </div>

            <div className="min-w-0 w-full">
              <FormField htmlFor="supplier-link" label="Link" className={fieldLabelClassName}>
              <Input
                id="supplier-link"
                type="url"
                value={value.link}
                onChange={(event) =>
                  onChange({ ...value, link: event.target.value })
                }
                disabled={disabled}
                placeholder="https://..."
              />
            </FormField>
            </div>
          </div>

          <FormField htmlFor="supplier-notes" label="Notas del proveedor" className={fieldLabelClassName}>
            <Textarea
              id="supplier-notes"
              value={value.notes}
              onChange={(event) =>
                onChange({ ...value, notes: event.target.value })
              }
              disabled={disabled}
              rows={2}
            />
          </FormField>
        </Box>
      )}
    </Box>
  );
}
