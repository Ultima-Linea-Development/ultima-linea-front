import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";
import Typography from "@/components/ui/Typography";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  {
    id: 1,
    name: "Camiseta Home",
    team: "Barcelona",
    price: "$50.000",
    image: "https://photo.yupoo.com/huang-66/17ea32ee/e22ef1a2.jpg",
  },
  {
    id: 2,
    name: "Camiseta Away",
    team: "Real Madrid",
    price: "$60.000",
    image: "https://photo.yupoo.com/huang-66/ea9e3e9e/b9dea4cc.jpeg",
  },
  {
    id: 3,
    name: "Camiseta Home",
    team: "Manchester United",
    price: "$50.000",
    image: "https://photo.yupoo.com/huang-66/aca5f874/0be670fb.jpg",
  },
  {
    id: 4,
    name: "Camiseta Away",
    team: "Liverpool",
    price: "$94.99",
    image: "https://photo.yupoo.com/huang-66/a90418cd/c5e63ac3.jpg",
  },
  {
    id: 5,
    name: "Camiseta Home",
    team: "Bayern Munich",
    price: "$89.99",
    image: "https://photo.yupoo.com/huang-66/643e0f90/4133028b.jpeg",
  },
  {
    id: 6,
    name: "Camiseta Away",
    team: "PSG",
    price: "$94.99",
    image: "https://photo.yupoo.com/huang-66/49d2cc50/a637a67b.jpg",
  },
];

export default function Home() {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <Typography variant="h1" className="uppercase mb-2">
          Camisetas
        </Typography>
      </div>

      <Grid cols={3} gap={8}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            team={product.team}
            price={product.price}
            image={product.image}
          />
        ))}
      </Grid>
    </Container>
  );
}
