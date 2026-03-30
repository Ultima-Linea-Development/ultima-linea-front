"use client";

import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { emptySizeStockRow, type SizeStockRow } from "@/lib/product-inventory";

type ProductSizeStockFieldsProps = {
  rows: SizeStockRow[];
  onRowsChange: (rows: SizeStockRow[]) => void;
  disabled?: boolean;
  idPrefix?: string;
};

export default function ProductSizeStockFields({
  rows,
  onRowsChange,
  disabled = false,
  idPrefix = "size-stock",
}: ProductSizeStockFieldsProps) {
  const addRow = () => onRowsChange([...rows, emptySizeStockRow()]);

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    onRowsChange(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof SizeStockRow, value: string) => {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    onRowsChange(next);
  };

  return (
    <Box display="flex" direction="col" gap="4" className="w-full">
      <Typography variant="body2" mb={1}>
        Talles y stock *
      </Typography>
      {rows.map((row, index) => (
        <Box
          key={row.id}
          display="flex"
          gap="2"
          className="flex-wrap items-end">
          <div className="min-w-[100px] flex-1">
            <Label htmlFor={`${idPrefix}-size-${index}`} display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Talle
              </Typography>
              <Input
                id={`${idPrefix}-size-${index}`}
                type="text"
                value={row.size}
                onChange={(e) => updateRow(index, "size", e.target.value)}
                disabled={disabled}
                placeholder="S"
              />
            </Label>
          </div>
          <div className="min-w-[80px] w-[120px]">
            <Label htmlFor={`${idPrefix}-stock-${index}`} display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Stock
              </Typography>
              <Input
                id={`${idPrefix}-stock-${index}`}
                type="number"
                min={0}
                value={row.stock}
                onChange={(e) => updateRow(index, "stock", e.target.value)}
                disabled={disabled}
                placeholder="0"
              />
            </Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 mb-0.5"
            disabled={disabled || rows.length <= 1}
            onClick={() => removeRow(index)}
            aria-label={`Quitar talle ${index + 1}`}>
            Quitar
          </Button>
        </Box>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-fit" disabled={disabled} onClick={addRow}>
        Agregar talle
      </Button>
    </Box>
  );
}
