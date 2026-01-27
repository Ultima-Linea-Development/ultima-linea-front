import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Typography from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para consultas, pedidos o cualquier duda sobre nuestros productos.",
};

export default function ContactPage() {
  return (
    <Container>
      <Typography variant="h1">Contacto</Typography>
    </Container>
  );
}
