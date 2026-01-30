"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";
import Typography from "@/components/ui/Typography";
import Form from "@/components/ui/Form";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Div from "@/components/ui/Div";
import Alert from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/AdminShell";
import ImageUploadDropzone from "@/components/ui/ImageUploadDropzone";
import { isAdmin, getUserFromToken, clearAuth, getToken } from "@/lib/auth";
import { adminProductsApi, adminUploadApi, type CreateProductRequest } from "@/lib/api";
import { generateSlug } from "@/lib/utils";

const CATEGORY_OPTIONS: Array<{ value: CreateProductRequest["category"]; label: string }> = [
  { value: "club", label: "Club" },
  { value: "national", label: "Selección" },
  { value: "retro", label: "Retro" },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [league, setLeague] = useState("");
  const [season, setSeason] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<CreateProductRequest["category"]>("club");

  useEffect(() => {
    const checkAuth = () => {
      const user = getUserFromToken();

      if (!user || !isAdmin()) {
        clearAuth();
        router.push("/login?redirect=/admin/products");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    const token = getToken();
    if (!token) {
      setError("Sesión expirada. Volvé a iniciar sesión.");
      setIsSubmitting(false);
      return;
    }

    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setError("Precio debe ser un número válido.");
      setIsSubmitting(false);
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError("Stock debe ser un número válido.");
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
        team: team.trim() || undefined,
        league: league.trim() || undefined,
        season: season.trim() || undefined,
        price: priceNum,
        stock: stockNum,
        size: size.trim() || undefined,
        image_urls: uploadResponse.data.urls,
        category,
      };

      const response = await adminProductsApi.create(payload, token);

      if (response.error || !response.data) {
        setError(response.error || "Error al crear el producto");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setName("");
      setDescription("");
      setTeam("");
      setLeague("");
      setSeason("");
      setPrice("");
      setStock("");
      setSize("");
      setImageFiles([]);
      setCategory("club");
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" direction="col" gap="4" className="min-h-[60vh] items-center justify-center">
          <Spinner />
        </Box>
      </Container>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <AdminShell>
      <Box display="flex" direction="col" gap="6" className="max-w-2xl">
        <Typography variant="h3">Alta de producto</Typography>

        <Form onSubmit={handleSubmit} spacing="md">
          <Div spacing="md">
            <Label htmlFor="name" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Nombre *
              </Typography>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Test Product - XL"
              />
            </Label>
          </Div>

          <Div spacing="md">
            <Label htmlFor="description" display="block" spacing="sm">
              <Typography variant="body2" mb={1}>
                Descripción
              </Typography>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Camiseta de prueba"
              />
            </Label>
          </Div>

          <Box display="flex" gap="4" className="flex-wrap">
            <Div spacing="md" className="flex-1 min-w-[200px]">
              <Label htmlFor="team" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Equipo
                </Typography>
                <Input
                  id="team"
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Test Team"
                />
              </Label>
            </Div>
            <Div spacing="md" className="flex-1 min-w-[200px]">
              <Label htmlFor="league" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Liga
                </Typography>
                <Input
                  id="league"
                  type="text"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  placeholder="club"
                />
              </Label>
            </Div>
          </Box>

          <Box display="flex" gap="4" className="flex-wrap">
            <Div spacing="md" className="flex-1 min-w-[120px]">
              <Label htmlFor="season" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Temporada
                </Typography>
                <Input
                  id="season"
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  placeholder="24/25"
                />
              </Label>
            </Div>
            <Div spacing="md" className="flex-1 min-w-[120px]">
              <Label htmlFor="category" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Categoría
                </Typography>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CreateProductRequest["category"])}
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
          </Box>

          <Box display="flex" gap="4" className="flex-wrap">
            <Div spacing="md" className="flex-1 min-w-[120px]">
              <Label htmlFor="price" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Precio *
                </Typography>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="25000"
                />
              </Label>
            </Div>
            <Div spacing="md" className="flex-1 min-w-[120px]">
              <Label htmlFor="stock" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Stock *
                </Typography>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  placeholder="5"
                />
              </Label>
            </Div>
            <Div spacing="md" className="flex-1 min-w-[120px]">
              <Label htmlFor="size" display="block" spacing="sm">
                <Typography variant="body2" mb={1}>
                  Talle
                </Typography>
                <Input
                  id="size"
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="XL"
                />
              </Label>
            </Div>
          </Box>

          <Div spacing="md" className="space-y-2">
            <Typography variant="body2" mb={1}>
              Imágenes del producto *
            </Typography>
            <ImageUploadDropzone
              files={imageFiles}
              onFilesChange={setImageFiles}
            />
          </Div>

          {error && (
            <Alert variant="destructive">
              <Typography variant="body2" color="destructive">
                {error}
              </Typography>
            </Alert>
          )}

          {success && (
            <Alert variant="default">
              <Typography variant="body2">
                Producto creado correctamente.
              </Typography>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear producto"}
          </Button>
        </Form>
      </Box>
    </AdminShell>
  );
}
