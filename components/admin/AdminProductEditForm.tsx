"use client";

import { useState, useEffect, FormEvent } from "react";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Form from "@/components/ui/Form";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Div from "@/components/ui/Div";
import Alert from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";
import type { Product, UpdateProductRequest } from "@/lib/api";
import { adminUploadApi } from "@/lib/api";
import { generateSlug, normalizeShirtType, type ShirtType } from "@/lib/utils";
import {
  productToRows,
  rowsToPayload,
  type SizeStockRow,
} from "@/lib/product-inventory";
import ProductSizeStockFields from "@/components/admin/ProductSizeStockFields";

const CATEGORY_OPTIONS: Array<{ value: "club" | "national" | "retro"; label: string }> = [
  { value: "club", label: "Club" },
  { value: "national", label: "Selección" },
  { value: "retro", label: "Retro" },
];

const SHIRT_TYPE_OPTIONS: Array<{ value: ShirtType; label: string }> = [
  { value: "fan", label: "Fan" },
  { value: "player", label: "Jugador" },
];

type AdminProductEditFormProps = {
  product: Product;
  onSave: (payload: UpdateProductRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string;
  getToken: () => string | null;
};

export default function AdminProductEditForm({
  product,
  onSave,
  onCancel,
  isSubmitting = false,
  error = "",
  getToken,
}: AdminProductEditFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [team, setTeam] = useState(product.team ?? "");
  const [league, setLeague] = useState(product.league ?? "");
  const [season, setSeason] = useState(product.season ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [sizeRows, setSizeRows] = useState<SizeStockRow[]>(() => productToRows(product));
  const [inventoryError, setInventoryError] = useState("");
  const [category, setCategory] = useState<Product["category"]>(product.category ?? "club");
  const [shirtType, setShirtType] = useState<ShirtType>(
    () => normalizeShirtType(product.type) ?? "fan"
  );
  const [isActive, setIsActive] = useState(product.is_active);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(product.image_urls ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentImageUrls(product.image_urls ?? []);
      setNewFiles([]);
      setImageError("");
      setSizeRows(productToRows(product));
      setInventoryError("");
      setShirtType(normalizeShirtType(product.type) ?? "fan");
    });
  }, [product]);

  const removeCurrentImage = (index: number) => {
    setCurrentImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImageError("");
    setInventoryError("");
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) return;
    const inventory = rowsToPayload(sizeRows);
    if (!inventory) {
      setInventoryError("Completá al menos un talle con stock válido (número ≥ 0).");
      return;
    }

    let finalUrls = [...currentImageUrls];
    if (newFiles.length > 0) {
      const token = getToken();
      if (!token) {
        setImageError("Sesión expirada. Volvé a iniciar sesión.");
        return;
      }
      const teamSlug = generateSlug(team) || "producto";
      const productSlug = generateSlug(name) || `producto-${Date.now()}`;
      const formData = new FormData();
      formData.append("team_slug", teamSlug);
      formData.append("product_slug", productSlug);
      newFiles.forEach((file) => formData.append("images", file));
      const uploadResponse = await adminUploadApi.uploadProductImages(formData, token);
      if (uploadResponse.error || !uploadResponse.data?.urls?.length) {
        setImageError(uploadResponse.error ?? "Error al subir las imágenes.");
        return;
      }
      finalUrls = [...currentImageUrls, ...uploadResponse.data.urls];
    }
    if (finalUrls.length === 0) {
      setImageError("El producto debe tener al menos una imagen.");
      return;
    }

    const payload: UpdateProductRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      team: team.trim() || undefined,
      league: league.trim() || undefined,
      season: season.trim() || undefined,
      price: priceNum,
      sizes: inventory.sizes,
      stock_by_sizes: inventory.stock_by_sizes,
      category,
      type: shirtType,
      is_active: isActive,
      image_urls: finalUrls,
    };
    onSave(payload);
  };

  return (
    <Box display="flex" direction="col" gap="4">
      <Form onSubmit={handleSubmit} spacing="md">
        <Box display="flex" gap="4" className="flex-wrap">
          <Div spacing="md" className="flex-1 min-w-[200px]">
            <Label htmlFor="edit-name" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Nombre *
              </Typography>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Label>
          </Div>
          <Div spacing="md" className="flex-1 min-w-[200px]">
            <Label htmlFor="edit-description" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Descripción
              </Typography>
              <Input
                id="edit-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>
          </Div>
        </Box>
        <Box display="flex" gap="4" className="flex-wrap">
          <Div spacing="md" className="flex-1 min-w-[120px]">
            <Label htmlFor="edit-team" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Equipo
              </Typography>
              <Input
                id="edit-team"
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </Label>
          </Div>
          <Div spacing="md" className="flex-1 min-w-[120px]">
            <Label htmlFor="edit-league" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Liga
              </Typography>
              <Input
                id="edit-league"
                type="text"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
              />
            </Label>
          </Div>
          <Div spacing="md" className="flex-1 min-w-[120px]">
            <Label htmlFor="edit-season" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Temporada
              </Typography>
              <Input
                id="edit-season"
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              />
            </Label>
          </Div>
          <Div spacing="md" className="flex-1 min-w-[120px]">
            <Label htmlFor="edit-category" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Categoría
              </Typography>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Product["category"])}
                className="w-full py-2 px-4 bg-gray-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Label>
          </Div>
          <Div spacing="md" className="flex-1 min-w-[120px]">
            <Label htmlFor="edit-shirt-type" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Tipo
              </Typography>
              <select
                id="edit-shirt-type"
                value={shirtType}
                onChange={(e) => setShirtType(e.target.value as ShirtType)}
                className="w-full py-2 px-4 bg-gray-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {SHIRT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Label>
          </Div>
        </Box>
        <Box display="flex" gap="4" className="flex-wrap items-end">
          <Div spacing="md" className="min-w-[100px]">
            <Label htmlFor="edit-price" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Precio *
              </Typography>
              <Input
                id="edit-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Label>
          </Div>
          <Div spacing="md" className="min-w-0 w-full max-w-md">
            <ProductSizeStockFields
              idPrefix="edit"
              rows={sizeRows}
              onRowsChange={setSizeRows}
              disabled={isSubmitting}
            />
          </Div>
          <Div spacing="md" className="flex items-center gap-2">
            <input
              id="edit-is-active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4"
            />
            <Label htmlFor="edit-is-active">
              <Typography variant="body2">Activo</Typography>
            </Label>
          </Div>
        </Box>

        <Div spacing="md">
          <Typography variant="body2" mb={1}>
            Imágenes actuales
          </Typography>
          {currentImageUrls.length === 0 && newFiles.length === 0 ? (
            <Typography variant="body2" color="muted">
              No hay imágenes. Agregá nuevas abajo.
            </Typography>
          ) : (
            <Box display="flex" gap="2" className="flex-wrap">
              {currentImageUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="relative h-20 w-20 shrink-0 border border-border overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Quitar imagen"
                    className="absolute top-0 right-0 h-6 w-6 bg-black/60 text-white hover:bg-black/80"
                    onClick={() => removeCurrentImage(index)}
                  >
                    <Icon name="close" className="size-3" />
                  </Button>
                </div>
              ))}
            </Box>
          )}
        </Div>

        <Div spacing="md">
          <Typography variant="body2" mb={1}>
            Agregar o reemplazar imágenes
          </Typography>
          <ImageUploadDropzone files={newFiles} onFilesChange={setNewFiles} />
        </Div>

        {(error || imageError || inventoryError) && (
          <Alert variant="destructive">
            <Typography variant="body2" color="destructive">
              {error || imageError || inventoryError}
            </Typography>
          </Alert>
        )}
        <Box display="flex" gap="2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
