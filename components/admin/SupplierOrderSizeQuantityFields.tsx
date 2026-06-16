"use client";

import { useMemo, useState } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import ProductOptionSelect from "@/components/admin/ProductOptionSelect";
import {
  emptySupplierOrderSizeRow,
  type SupplierOrderSizeQuantityRow,
} from "@/lib/supplier-order-sizes";

type SupplierOrderSizeQuantityFieldsProps = {
  rows: SupplierOrderSizeQuantityRow[];
  onRowsChange: (rows: SupplierOrderSizeQuantityRow[]) => void;
  disabled?: boolean;
  idPrefix?: string;
  sizeOptions?: string[];
  required?: boolean;
  minRows?: number;
};

function normalizeQuantityValue(value: string): string {
  if (value === "") return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "1";
  return String(Math.max(1, Math.floor(parsed)));
}

export default function SupplierOrderSizeQuantityFields({
  rows,
  onRowsChange,
  disabled = false,
  idPrefix = "supplier-order-size",
  sizeOptions = [],
  required = false,
  minRows = 1,
}: SupplierOrderSizeQuantityFieldsProps) {
  const [customSizeRowIds, setCustomSizeRowIds] = useState<Set<string>>(() => new Set());

  const normalizedSizeOptions = useMemo(() => {
    const seen = new Set<string>();

    return sizeOptions
      .map((option) => option.trim())
      .filter(Boolean)
      .filter((option) => {
        const key = option.toLocaleLowerCase();
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
      });
  }, [sizeOptions]);

  const addRow = () => onRowsChange([...rows, emptySupplierOrderSizeRow()]);

  const removeRow = (index: number) => {
    if (rows.length <= minRows) return;
    const rowId = rows[index].id;
    setCustomSizeRowIds((prev) => {
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof SupplierOrderSizeQuantityRow, value: string) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    onRowsChange(next);
  };

  const updateCustomSizeRow = (rowId: string, isCustom: boolean) => {
    setCustomSizeRowIds((prev) => {
      const next = new Set(prev);

      if (isCustom) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }

      return next;
    });
  };

  const isCustomSizeRow = (row: SupplierOrderSizeQuantityRow) => {
    const size = row.size.trim();
    if (customSizeRowIds.has(row.id)) return true;
    if (!size) return false;

    return !normalizedSizeOptions.some(
      (option) => option.toLocaleLowerCase() === size.toLocaleLowerCase()
    );
  };

  return (
    <FormField label="Talles" required={required}>
      <Box display="flex" direction="col" gap="4" className="w-full">
        {rows.length === 0 && (
          <Typography variant="body2" color="muted">
            Sin talles cargados.
          </Typography>
        )}
        {rows.map((row, index) => (
          <Box
            key={row.id}
            display="flex"
            gap="2"
            className="flex-wrap items-end"
          >
            <div className="min-w-[100px] flex-1">
              <ProductOptionSelect
                id={`${idPrefix}-size-${index}`}
                label="Talle"
                value={row.size}
                options={normalizedSizeOptions}
                isCustom={isCustomSizeRow(row)}
                onChange={(value) => updateRow(index, "size", value)}
                onCustomChange={(isCustom) => updateCustomSizeRow(row.id, isCustom)}
                customPlaceholder="Ingresá el talle"
                disabled={disabled}
                required={required}
              />
            </div>
            <div className="min-w-[80px] w-[120px]">
              <FormField htmlFor={`${idPrefix}-quantity-${index}`} label="Cantidad" required={required}>
                <Input
                  id={`${idPrefix}-quantity-${index}`}
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(event) =>
                    updateRow(index, "quantity", normalizeQuantityValue(event.target.value))
                  }
                  onBlur={() => {
                    if (row.quantity === "") {
                      updateRow(index, "quantity", "1");
                    }
                  }}
                  disabled={disabled}
                  placeholder="1"
                  required={required}
                />
              </FormField>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 mb-0.5"
              disabled={disabled || rows.length <= minRows}
              onClick={() => removeRow(index)}
              aria-label={`Quitar talle ${index + 1}`}
            >
              Quitar
            </Button>
          </Box>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={disabled}
          onClick={addRow}
        >
          Agregar talle
        </Button>
      </Box>
    </FormField>
  );
}
