import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Spinner from "@/components/ui/Spinner";
import Div from "@/components/ui/Div";
import { productsApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Búsqueda",
  description: "Busca camisetas de fútbol en nuestro catálogo. Encuentra las camisetas que estás buscando.",
};

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <Div textAlign="center" py={8}>
        <Typography variant="body" color="muted">
          Ingresa un término de búsqueda
        </Typography>
      </Div>
    );
  }

  const response = await productsApi.search(query);

  if (response.error || !response.data) {
    return (
      <Div textAlign="center" py={8}>
        <Typography variant="body" color="muted">
          {response.error || "Error al realizar la búsqueda"}
        </Typography>
      </Div>
    );
  }

  const { total, results } = response.data;

  if (total === 0) {
    return (
      <Div textAlign="center" py={8}>
        <Typography variant="h3" mb={2}>
          No se encontraron resultados
        </Typography>
        <Typography variant="body" color="muted">
          No hay productos que coincidan con &quot;{query}&quot;
        </Typography>
      </Div>
    );
  }

  return (
    <>
      <Typography variant="body">
        Búsqueda de:
      </Typography>
      <Box display="flex" direction="row" align="end" gap="2">
        <Typography variant="h2" uppercase={true}>
          "{query}"
        </Typography>
        <Typography variant="body2" color="muted">
          [{total}]
        </Typography>
      </Box>
      <Box display="grid" cols={4} gap={8} className="w-full">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            team={product.team || ""}
            price={formatPrice(product.price)}
            image={product.image_urls[0] || ""}
            hoverImage={product.image_urls?.[1]}
          />
        ))}
      </Box>
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <Container fullWidth>
      <Box display="flex" direction="col" justify="start" align="start" gap="2" className="w-full">
        <Suspense fallback={<Spinner />}>
          <SearchResults query={query} />
        </Suspense>
      </Box>
    </Container>
  );
}
