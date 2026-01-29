import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Banner from "@/components/ui/Banner";
import ProductsList from "./components/ProductsList";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";

export const metadata: Metadata = {
  title: "Última Línea - Camisetas de Fútbol Retro y Actuales en Argentina",
  description:
    "Última Línea - Tienda especializada en camisetas de fútbol retro y actuales. Encuentra camisetas oficiales de los mejores equipos y selecciones del mundo.",
};

export default function Home() {
  return (
    <>
      <Banner
        image="/images/banners/banner-home.png"
        imageMobile="/images/banners/banner-home-mobile.png"
      />
      <Container>
        <Box display="flex" direction="col" justify="start" align="start" gap="2">
          <Suspense fallback={<Spinner />}>
            <ProductsList />
          </Suspense>
        </Box>
      </Container>
    </>
  );
}
