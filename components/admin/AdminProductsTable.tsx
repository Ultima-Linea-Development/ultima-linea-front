"use client";

import { useRef, useEffect } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Icon from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

type AdminProductsTableProps = {
  products: Product[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
};

export default function AdminProductsTable({
  products,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  selectedIds = [],
  onSelectionChange,
}: AdminProductsTableProps) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const cellClass = "px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2";
  const thClass = "px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-3 font-medium whitespace-nowrap";

  const selectedSet = new Set(selectedIds);
  const visibleIds = products.map((p) => p.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedSet.has(id));

  const handleToggleRow = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedSet.has(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleToggleAll = () => {
    if (!onSelectionChange) return;
    if (allVisibleSelected) {
      onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
    } else {
      const merged = new Set([...selectedIds, ...visibleIds]);
      onSelectionChange(Array.from(merged));
    }
  };

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
  }, [someVisibleSelected, allVisibleSelected]);

  return (
    <Box display="flex" direction="col" gap="4">
      <div className="overflow-x-auto border border-border -mx-4 sm:mx-0">
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              {onSelectionChange && (
                <th className={cn(thClass, "w-10")}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={handleToggleAll}
                    aria-label="Seleccionar todos"
                    className="size-4 cursor-pointer"
                  />
                </th>
              )}
              <th className={thClass}>
                <Typography variant="body2">Imagen</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Nombre</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Equipo</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Categoría</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Precio</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Stock</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Activo</Typography>
              </th>
              <th className={thClass}>
                <Typography variant="body2">Acciones</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={onSelectionChange ? 9 : 8}
                  className={`${cellClass} py-8 text-center`}
                >
                  <Typography variant="body2" color="muted">
                    No hay productos
                  </Typography>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-border last:border-b-0 hover:bg-muted/30",
                    selectedSet.has(p.id) && "bg-muted/50"
                  )}
                >
                  {onSelectionChange && (
                    <td className={cellClass}>
                      <input
                        type="checkbox"
                        checked={selectedSet.has(p.id)}
                        onChange={() => handleToggleRow(p.id)}
                        aria-label={`Seleccionar ${p.name}`}
                        className="size-4 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className={cellClass}>
                    {p.image_urls?.[0] ? (
                      <img
                        src={p.image_urls[0]}
                        alt=""
                        className="h-10 w-10 sm:h-12 sm:w-12 object-cover shrink-0"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className={cn(cellClass, "min-w-[120px] max-w-[180px]")}>
                    <span className="line-clamp-2">
                      <Typography variant="body2">{p.name}</Typography>
                    </span>
                  </td>
                  <td className={cellClass}>
                    <span className="whitespace-nowrap truncate block max-w-[100px] sm:max-w-none">
                      <Typography variant="body2">{p.team ?? "—"}</Typography>
                    </span>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{p.category ?? "—"}</Typography>
                  </td>
                  <td className={cellClass}>
                    <span className="whitespace-nowrap">
                      <Typography variant="body2">{formatPrice(p.price)}</Typography>
                    </span>
                  </td>
                  <td className={cellClass}>
                    <Typography variant="body2">{p.stock}</Typography>
                  </td>
                  <td className={cellClass}>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                        p.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {p.is_active ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className={cn(cellClass, "whitespace-nowrap")}>
                    <Box display="flex" className="items-center gap-1 sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Editar"
                        onClick={() => onEdit?.(p)}
                        className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                      >
                        <Icon name="edit" className="size-4 sm:size-5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar"
                        onClick={() => onDelete?.(p)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                      >
                        <Icon name="delete" className="size-4 sm:size-5" />
                      </Button>
                    </Box>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Box display="flex" className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <span className="order-2 sm:order-1">
            <Typography variant="body2" color="muted">
              Mostrando {from}–{to} de {total}
            </Typography>
          </span>
          <Box display="flex" gap="2" className="items-center justify-center sm:justify-end order-1 sm:order-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <Typography variant="body2">
              Página {page} de {totalPages}
            </Typography>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export { PER_PAGE };
