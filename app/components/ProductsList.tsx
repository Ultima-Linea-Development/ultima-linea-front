import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Container from "@/components/layout/Container";
import Div from "@/components/ui/Div";
import Paragraph from "@/components/ui/Paragraph";
import { productsApi, type Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

async function ProductsList() {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  let response;
  try {
    const [responseResult] = await Promise.all([
      productsApi.getAll(),
      delay(500),
    ]);
    response = responseResult;
  } catch (error) {
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

  const products = response.data.products || [];
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
      <Box display="grid" cols={3} gap={8}>
        {activeProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            team={product.team || ""}
            price={formatPrice(product.price)}
            image={product.image_urls[0] || ""}
          />
        ))}
      </Box>
    </Container>
  );
}

export default ProductsList;
