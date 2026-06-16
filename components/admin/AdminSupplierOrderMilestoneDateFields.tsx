"use client";

import FormField from "@/components/ui/FormField";
import AdminSaleDateField from "@/components/admin/AdminSaleDateField";
import type { SupplierOrderMilestoneDates } from "@/lib/supplier-order-dates";

type AdminSupplierOrderMilestoneDateFieldsProps = {
  idPrefix: string;
  value: SupplierOrderMilestoneDates;
  onChange: (value: SupplierOrderMilestoneDates) => void;
  disabled?: boolean;
};

const fieldLabelClassName = "w-full min-w-0";

export default function AdminSupplierOrderMilestoneDateFields({
  idPrefix,
  value,
  onChange,
  disabled = false,
}: AdminSupplierOrderMilestoneDateFieldsProps) {
  const updateField = (field: keyof SupplierOrderMilestoneDates, nextValue: string) => {
    onChange({ ...value, [field]: nextValue });
  };

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
      <FormField
        htmlFor={`${idPrefix}-paid-at`}
        label="Fecha de pago"
        className={fieldLabelClassName}
      >
        <AdminSaleDateField
          id={`${idPrefix}-paid-at`}
          value={value.paidAt}
          onChange={(nextValue) => updateField("paidAt", nextValue)}
          disabled={disabled}
        />
      </FormField>

      <FormField
        htmlFor={`${idPrefix}-sent-at`}
        label="Fecha de envío"
        className={fieldLabelClassName}
      >
        <AdminSaleDateField
          id={`${idPrefix}-sent-at`}
          value={value.sentAt}
          onChange={(nextValue) => updateField("sentAt", nextValue)}
          disabled={disabled}
        />
      </FormField>

      <FormField
        htmlFor={`${idPrefix}-received-at`}
        label="Fecha de recepción"
        className={fieldLabelClassName}
      >
        <AdminSaleDateField
          id={`${idPrefix}-received-at`}
          value={value.receivedAt}
          onChange={(nextValue) => updateField("receivedAt", nextValue)}
          disabled={disabled}
        />
      </FormField>
    </div>
  );
}
