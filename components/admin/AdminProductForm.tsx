"use client";

import { FormEvent, useEffect, useState } from "react";
import Box from "@/components/layout/Box";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Div from "@/components/ui/Div";
import { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";
import ProductSizeStockFields from "@/components/admin/ProductSizeStockFields";
import ProductOptionSelect from "@/components/admin/ProductOptionSelect";
import Typography from "@/components/ui/Typography";
import { getToken } from "@/lib/auth";
import {
  adminProductsApi,
  adminUploadApi,
  productsApi,
  type CreateProductRequest,
  type ProductOptionsResponse,
} from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import FormField from "@/components/ui/FormField";
import Select from "@/components/ui/Select";
import { validateRequiredProductFields } from "@/lib/product-form-validation";
import { emptySizeStockRow, rowsToPayload, type SizeStockRow } from "@/lib/product-inventory";

const CATEGORY_OPTIONS: Array<{ value: CreateProductRequest["category"]; label: string }> = [
  { value: "club", label: "Club" },
  { value: "national", label: "Selección" },
  { value: "retro", label: "Retro" },
];

type AdminProductFormProps = {
  onSuccess: () => void;
  onCancel?: () => void;
};

function getInitialFormState() {
  return {
    name: "",
    description: "",
    team: "",
    league: "",
    isCustomTeam: false,
    isCustomLeague: false,
    season: "",
    price: "",
    sizeRows: [emptySizeStockRow()] as SizeStockRow[],
    imageFiles: [] as File[],
    category: "club" as CreateProductRequest["category"],
  };
}

export default function AdminProductForm({ onSuccess, onCancel }: AdminProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [league, setLeague] = useState("");
  const [isCustomTeam, setIsCustomTeam] = useState(false);
  const [isCustomLeague, setIsCustomLeague] = useState(false);
  const [season, setSeason] = useState("");
  const [price, setPrice] = useState("");
  const [sizeRows, setSizeRows] = useState<SizeStockRow[]>(() => [emptySizeStockRow()]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<CreateProductRequest["category"]>("club");
  const [productOptions, setProductOptions] = useState<ProductOptionsResponse>({
    teams: [],
    leagues: [],
    sizes: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadProductOptions = async () => {
      const response = await productsApi.getOptions();

      if (isMounted && response.data) {
        setProductOptions(response.data);
      }
    };

    void loadProductOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetForm = () => {
    const initial = getInitialFormState();
    setName(initial.name);
    setDescription(initial.description);
    setTeam(initial.team);
    setLeague(initial.league);
    setIsCustomTeam(initial.isCustomTeam);
    setIsCustomLeague(initial.isCustomLeague);
    setSeason(initial.season);
    setPrice(initial.price);
    setSizeRows(initial.sizeRows);
    setImageFiles(initial.imageFiles);
    setCategory(initial.category);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const token = getToken();
    if (!token) {
      setError("Sesión expirada. Volvé a iniciar sesión.");
      setIsSubmitting(false);
      return;
    }

    const requiredError = validateRequiredProductFields({ name, team, league, season });
    if (requiredError) {
      setError(requiredError);
      setIsSubmitting(false);
      return;
    }

    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError("Precio debe ser un número válido.");
      setIsSubmitting(false);
      return;
    }

    const inventory = rowsToPayload(sizeRows);
    if (!inventory) {
      setError("Completá al menos un talle con stock válido (número ≥ 0).");
      setIsSubmitting(false);
      return;
    }

    if (imageFiles.length === 0) {
      setError("Subí al menos una imagen.");
      setIsSubmitting(false);
      return;
    }

    const teamSlug = generateSlug(team) || "producto";
    const productSlug = generateSlug(name) || `producto-${Date.now()}`;

    const formData = new FormData();
    formData.append("team_slug", teamSlug);
    formData.append("product_slug", productSlug);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const uploadResponse = await adminUploadApi.uploadProductImages(formData, token);

      if (uploadResponse.error || !uploadResponse.data?.urls?.length) {
        const msg =
          uploadResponse.status === 401
            ? "Sesión expirada o token inválido. Volvé a iniciar sesión."
            : uploadResponse.error || "Error al subir las imágenes.";
        setError(msg);
        setIsSubmitting(false);
        return;
      }

      const payload: CreateProductRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        team: team.trim(),
        league: league.trim(),
        season: season.trim(),
        price: priceNum,
        sizes: inventory.sizes,
        stock_by_sizes: inventory.stock_by_sizes,
        image_urls: uploadResponse.data.urls,
        category,
      };

      const response = await adminProductsApi.create(payload, token);

      if (response.error || !response.data) {
        setError(response.error || "Error al crear el producto");
        setIsSubmitting(false);
        return;
      }

      resetForm();
      onSuccess();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} spacing="md">
      <Div spacing="md">
        <FormField htmlFor="name" label="Nombre" required>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nombre del producto"
            disabled={isSubmitting}
          />
        </FormField>
      </Div>

      <Div spacing="md">
        <FormField htmlFor="description" label="Descripción">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </FormField>
      </Div>

      <Box display="flex" gap="4" className="flex-wrap">
        <Div spacing="md" className="flex-1 min-w-[200px]">
          <ProductOptionSelect
            id="team"
            label="Equipo"
            value={team}
            options={productOptions.teams}
            isCustom={isCustomTeam}
            onChange={setTeam}
            onCustomChange={setIsCustomTeam}
            customPlaceholder="Ingresá el equipo"
            required
          />
        </Div>
        <Div spacing="md" className="flex-1 min-w-[200px]">
          <ProductOptionSelect
            id="league"
            label="Liga"
            value={league}
            options={productOptions.leagues}
            isCustom={isCustomLeague}
            onChange={setLeague}
            onCustomChange={setIsCustomLeague}
            customPlaceholder="Ingresá la liga"
            required
          />
        </Div>
      </Box>

      <Box display="flex" gap="4" className="flex-wrap">
        <Div spacing="md" className="flex-1 min-w-[120px]">
          <FormField htmlFor="season" label="Temporada" required>
            <Input
              id="season"
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="24/25"
              required
              disabled={isSubmitting}
            />
          </FormField>
        </Div>
        <Div spacing="md" className="flex-1 min-w-[120px]">
          <FormField htmlFor="category" label="Categoría" required>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CreateProductRequest["category"])}
              required
              disabled={isSubmitting}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>
        </Div>
      </Box>

      <Box display="flex" gap="4" className="flex-wrap">
        <Div spacing="md" className="flex-1 min-w-[120px]">
          <FormField htmlFor="price" label="Precio" required>
            <Input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="50000"
              disabled={isSubmitting}
            />
          </FormField>
        </Div>
      </Box>

      <Div spacing="md">
        <ProductSizeStockFields
          idPrefix="add"
          rows={sizeRows}
          onRowsChange={setSizeRows}
          disabled={isSubmitting}
          sizeOptions={productOptions.sizes}
          required
        />
      </Div>

      <Div spacing="md" className="space-y-2">
        <FormField label="Imágenes del producto" required>
          <ImageUploadDropzone files={imageFiles} onFilesChange={setImageFiles} />
        </FormField>
      </Div>

      {error && (
        <InlineAlert variant="destructive">
          <Typography variant="body2" color="destructive">
            {error}
          </Typography>
        </InlineAlert>
      )}

      <Box display="flex" gap="2" className="flex-wrap">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear producto"}
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
