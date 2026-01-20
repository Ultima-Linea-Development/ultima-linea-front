import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Spinner from "@/components/ui/Spinner";
import { productsApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-muted-foreground">
          Ingresa un término de búsqueda
        </Typography>
      </div>
    );
  }

  const response = await productsApi.search(query);

  if (response.error || !response.data) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" className="text-muted-foreground">
          {response.error || "Error al realizar la búsqueda"}
        </Typography>
      </div>
    );
  }

  const { count, results } = response.data;

  if (count === 0) {
    return (
      <div className="text-center py-8">
        <Typography variant="h3" className="mb-2">
          No se encontraron resultados
        </Typography>
        <Typography variant="body" className="text-muted-foreground">
          No hay productos que coincidan con &quot;{query}&quot;
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Typography variant="body">
        Búsqueda de:
      </Typography>
      <Box display="flex" direction="row" align="end" gap="2">
        <Typography variant="h2" className="uppercase">
          "{query}"
        </Typography>
        <Typography variant="body2" className="text-muted-foreground ">
          [{count}]
        </Typography>
      </Box>
      <Box display="grid" cols={3} gap={8}>
        {results.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            team={product.team || ""}
            price={formatPrice(product.price)}
            image={product.image_urls[0] || ""}
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
    <Container>
      <Box display="flex" direction="col" justify="start" align="start" gap="2">
        <Suspense fallback={<Spinner className="mx-auto" />}>
          <SearchResults query={query} />
        </Suspense>
      </Box>
    </Container>
  );
}
