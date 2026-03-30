import type { Metadata } from "next";
import type { ReactNode } from "react";
import { productsApi, type Product } from "@/lib/api";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Div from "@/components/ui/Div";
import ProductImageGallery from "@/components/ui/ProductImageGallery";
import { formatPrice } from "@/lib/utils";
import { getSiteOrigin } from "@/lib/site-origin";
import { buildWhatsAppConsultUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

const categoryDisplay: Record<NonNullable<Product["category"]>, string> = {
  club: "Club",
  national: "Selección",
  retro: "Retro",
};

function ProductAttributeRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box
      display="flex"
      justify="between"
      align="center"
      className="w-full gap-4 py-3 first:pt-0 last:pb-0"
    >
      <span className="shrink-0 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-medium leading-snug text-foreground">
        {children}
      </span>
    </Box>
  );
}

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
  const origin = await getSiteOrigin();
  const productHref = origin ? `${origin}/product/${slug}` : "";
  const whatsappMessage = productHref
    ? `Hola, quisiera hacer una consulta sobre el producto: ${product.name}\n${productHref}`
    : `Hola, quisiera hacer una consulta sobre el producto: ${product.name}`;
  const whatsappProductUrl = buildWhatsAppConsultUrl(whatsappMessage);

  return (
    <Container>
      <Box
        display="grid"
        cols={2}
        gap={8}
        className="mt-8 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr]"
      >
        <Box className="min-w-0">
          <ProductImageGallery
            imageUrls={imageUrls}
            productName={product.name}
          />
        </Box>

        <Box display="flex" direction="col" gap="4" className="w-full min-w-0">
          <Box display="flex" direction="col" gap="2">
            <Typography variant="h1" uppercase>
              {product.name}
            </Typography>
            <Typography variant="h3" as="p">
              {formatPrice(product.price)}
            </Typography>
          </Box>

          {product.description && (
            <Div spacing="md">
              <Typography variant="body">{product.description}</Typography>
            </Div>
          )}

          <Div border="top" pt={4} className="w-full min-w-0">
            <div className="box-border w-full divide-y divide-border/80 border border-border/80 bg-muted/40 px-4 py-5 sm:px-6 sm:py-6">
              {product.team && (
                <ProductAttributeRow label="Equipo">{product.team}</ProductAttributeRow>
              )}
              {product.league && (
                <ProductAttributeRow label="Liga">{product.league}</ProductAttributeRow>
              )}
              {product.season && (
                <ProductAttributeRow label="Temporada">{product.season}</ProductAttributeRow>
              )}
              {product.category && (
                <ProductAttributeRow label="Categoría">
                  {categoryDisplay[product.category]}
                </ProductAttributeRow>
              )}
            </div>
          </Div>

          <Button asChild>
            <a
              href={whatsappProductUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar sobre el producto
            </a>
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
