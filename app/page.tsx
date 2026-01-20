import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Banner from "@/components/ui/Banner";
import ProductsList from "./components/ProductsList";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";


export default function Home() {
  return (
    <>
      <Banner image="/banner-home.png" />
      <Container>
        <Box display="flex" direction="col" justify="start" align="start" gap="2">
          <Suspense fallback={<Spinner className="mx-auto" />}>
            <ProductsList />
          </Suspense>
        </Box>
      </Container>
    </>
  );
}
