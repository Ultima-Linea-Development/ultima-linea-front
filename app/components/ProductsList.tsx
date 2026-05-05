import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Container from "@/components/layout/Container";
import Div from "@/components/ui/Div";
import Paragraph from "@/components/ui/Paragraph";
import { productsApi, type Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const CATALOG_PAGE_SIZE = 100;

function dedupeProductsById(products: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of products) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

async function fetchFullCatalog() {
  const first = await productsApi.getAll({ page: 1, per_page: CATALOG_PAGE_SIZE });
  if (first.error || !first.data) return first;

  const { products, total_pages, total } = first.data;
  if (total_pages <= 1) return first;

  const merged = [...products];
  for (let page = 2; page <= total_pages; page++) {
    const r = await productsApi.getAll({ page, per_page: CATALOG_PAGE_SIZE });
    if (r.error || !r.data) return r;
    merged.push(...r.data.products);
  }

  return {
    data: {
      products: merged,
      page: 1,
      per_page: merged.length,
      total,
      total_pages: 1,
    },
    status: first.status,
  };
}

async function ProductsList() {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  let response;
  try {
    const [responseResult] = await Promise.all([fetchFullCatalog(), delay(500)]);
    response = responseResult;
  } catch {
    await delay(500);
    return (
      <Div textAlign="center" py={8}>
        <Paragraph color="muted">
          Error al cargar los productos. Por favor, intenta más tarde.
        </Paragraph>
      </Div>
    );
  }

  if (response.error || !response.data) {
    return (
      <Div textAlign="center" py={8}>
        <Paragraph color="muted">
          {response.error || "No se pudieron cargar los productos"}
        </Paragraph>
      </Div>
    );
  }

  const products = dedupeProductsById(response.data.products || []);
  const activeProducts = products.filter(
    (product) => product.is_active
  );

  if (activeProducts.length === 0) {
    return (
      <Div textAlign="center" py={8}>
        <Paragraph color="muted">No hay productos disponibles</Paragraph>
      </Div>
    );
  }

  return (
    <Container>
      <Typography variant="h2" uppercase={true} mb={2}>Últimos ingresos</Typography>
      <Box display="grid" cols={4} gap={8}>
        {activeProducts.map((product: Product) => (
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
    </Container>
  );
}

export default ProductsList;
