"use client";

import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";

type AdminSupplierOrderTrackingFieldsProps = {
  idPrefix: string;
  trackingNumber: string;
  trackingLink: string;
  onTrackingNumberChange: (value: string) => void;
  onTrackingLinkChange: (value: string) => void;
  disabled?: boolean;
};

const fieldLabelClassName = "w-full min-w-0";

export default function AdminSupplierOrderTrackingFields({
  idPrefix,
  trackingNumber,
  trackingLink,
  onTrackingNumberChange,
  onTrackingLinkChange,
  disabled = false,
}: AdminSupplierOrderTrackingFieldsProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <FormField
        htmlFor={`${idPrefix}-tracking-number`}
        label="Nro. de seguimiento"
        className={fieldLabelClassName}
      >
        <Input
          id={`${idPrefix}-tracking-number`}
          value={trackingNumber}
          onChange={(event) => onTrackingNumberChange(event.target.value)}
          disabled={disabled}
          placeholder="Ej: AA123456789AR"
        />
      </FormField>

      <FormField
        htmlFor={`${idPrefix}-tracking-link`}
        label="Enlace de seguimiento"
        className={fieldLabelClassName}
      >
        <Input
          id={`${idPrefix}-tracking-link`}
          type="url"
          value={trackingLink}
          onChange={(event) => onTrackingLinkChange(event.target.value)}
          disabled={disabled}
          placeholder="https://..."
        />
      </FormField>
    </div>
  );
}
