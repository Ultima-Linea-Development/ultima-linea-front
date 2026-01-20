import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Container from "@/components/layout/Container";
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
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Error al cargar los productos. Por favor, intenta más tarde.
        </p>
      </div>
    );
  }

  if (response.error || !response.data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {response.error || "No se pudieron cargar los productos"}
        </p>
      </div>
    );
  }

  const activeProducts = (response.data || []).filter(
    (product) => product.is_active
  );

  if (activeProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <Container>
      <Typography variant="h2" className="uppercase mb-2">Últimos ingresos</Typography>
      <Box display="grid" cols={3} gap={8}>
        {activeProducts.map((product: Product) => (
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
    </Container>
  );
}

export default ProductsList;
