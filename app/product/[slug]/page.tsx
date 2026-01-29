import type { Metadata } from "next";
import { productsApi } from "@/lib/api";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Div from "@/components/ui/Div";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await productsApi.getBySlug(slug);

  if (response.error || !response.data) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible",
    };
  }

  const product = response.data;
  const title = product.name;
  const description =
    product.description ||
    `${product.name}${product.team ? ` - ${product.team}` : ""}${product.season ? ` ${product.season}` : ""
    } en Última Línea`;

  return {
    title,
    description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const response = await productsApi.getBySlug(slug);

  if (response.error || !response.data) {
    notFound();
  }

  const product = response.data;
  const imageUrls = product.image_urls ?? [];

  return (
    <Container>
      <Box
        display="grid"
        cols={2}
        gap={8}
        className="mt-8 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr]"
      >
        <Box display="grid" cols={2} gap={2} className="min-w-0">
          {imageUrls.map((url, index) => (
            <Div
              key={url}
              position="relative"
              aspect="square"
              overflow="hidden"
            >
              <Image
                src={url}
                alt={`${product.name} - imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 45vw, 35vw"
                priority={index === 0}
              />
            </Div>
          ))}
        </Box>

        <Box display="flex" direction="col" gap="4">
          <Box display="flex" direction="col" gap="2">
            <Typography variant="h1">{product.name}</Typography>
            <Typography variant="h4" color="gray">
              {formatPrice(product.price)}
            </Typography>
          </Box>

          {product.description && (
            <Div spacing="md">
              <Typography variant="body">{product.description}</Typography>
            </Div>
          )}

          <Div spacing="md" border="top" pt={4}>
            {product.team && (
              <Box display="flex" justify="between">
                <Typography variant="body2" color="gray">Equipo:</Typography>
                <Typography variant="body2">{product.team}</Typography>
              </Box>
            )}
            {product.league && (
              <Box display="flex" justify="between">
                <Typography variant="body2" color="gray">Liga:</Typography>
                <Typography variant="body2">{product.league}</Typography>
              </Box>
            )}
            {product.season && (
              <Box display="flex" justify="between">
                <Typography variant="body2" color="gray">Temporada:</Typography>
                <Typography variant="body2">{product.season}</Typography>
              </Box>
            )}
            {product.category && (
              <Box display="flex" justify="between">
                <Typography variant="body2" color="gray">Categoría:</Typography>
                <Typography variant="body2" uppercase>{product.category}</Typography>
              </Box>
            )}
            <Box display="flex" justify="between">
              <Typography variant="body2" color="gray">Stock:</Typography>
              <Typography variant="body2">{product.stock} unidades</Typography>
            </Box>
          </Div>
        </Box>
      </Box>
    </Container>
  );
}
