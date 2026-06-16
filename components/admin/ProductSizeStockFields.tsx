"use client";

import { useMemo, useState } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import { emptySizeStockRow, type SizeStockRow } from "@/lib/product-inventory";
import ProductOptionSelect from "@/components/admin/ProductOptionSelect";
import { adminIconTriggerClassName } from "@/lib/admin-interactive-styles";
import { cn } from "@/lib/utils";

type ProductSizeStockPriceField = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

type ProductSizeStockFieldsProps = {
  rows: SizeStockRow[];
  onRowsChange: (rows: SizeStockRow[]) => void;
  disabled?: boolean;
  idPrefix?: string;
  sizeOptions?: string[];
  required?: boolean;
  minRows?: number;
  priceField?: ProductSizeStockPriceField;
};

export default function ProductSizeStockFields({
  rows,
  onRowsChange,
  disabled = false,
  idPrefix = "size-stock",
  sizeOptions = [],
  required = false,
  minRows = 1,
  priceField,
}: ProductSizeStockFieldsProps) {
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

  const addRow = () => onRowsChange([...rows, emptySizeStockRow()]);

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

  const updateRow = (index: number, field: keyof SizeStockRow, value: string) => {
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

  const isCustomSizeRow = (row: SizeStockRow) => {
    const size = row.size.trim();
    if (customSizeRowIds.has(row.id)) return true;
    if (!size) return false;

    return !normalizedSizeOptions.some(
      (option) => option.toLocaleLowerCase() === size.toLocaleLowerCase()
    );
  };

  return (
    <FormField label="Talles y stock" required={required}>
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-4",
          priceField && "md:grid-cols-2 md:items-start"
        )}
      >
        <Box display="flex" direction="col" gap="4" className="min-w-0">
          {rows.length === 0 && (
            <Typography variant="body2" color="muted">
              Sin talles cargados.
            </Typography>
          )}
          {rows.map((row, index) => (
            <div key={row.id} className="flex w-full min-w-0 items-end gap-2">
              <div className="min-w-0 flex-1">
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
              <div className="w-[100px] shrink-0">
                <FormField htmlFor={`${idPrefix}-stock-${index}`} label="Stock" required={required}>
                  <Input
                    id={`${idPrefix}-stock-${index}`}
                    type="number"
                    min={0}
                    value={row.stock}
                    onChange={(e) => updateRow(index, "stock", e.target.value)}
                    disabled={disabled}
                    placeholder="0"
                    required={required}
                  />
                </FormField>
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={disabled || rows.length <= minRows}
                aria-label={`Quitar talle ${index + 1}`}
                className={cn(
                  adminIconTriggerClassName,
                  "mb-0.5 shrink-0 text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                <Icon name="delete" className="size-5" />
              </button>
            </div>
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
        {priceField ? (
          <div className="min-w-[200px]">
            <FormField htmlFor={priceField.id} label="Precio" required={required}>
              <Input
                id={priceField.id}
                type="number"
                min={0}
                value={priceField.value}
                onChange={(e) => priceField.onChange(e.target.value)}
                disabled={disabled}
                placeholder="50000"
                required={required}
              />
            </FormField>
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
