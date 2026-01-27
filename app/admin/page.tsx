import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Panel de Administración",
  description: "Panel de administración de Última Línea",
};

export default function AdminPage() {
  return (
    <Container>
      <Box display="flex" direction="col" gap="4">
        <Typography variant="h1">Panel de Administración</Typography>
        <Typography variant="body">
          Bienvenido al panel de administración de Última Línea.
        </Typography>
      </Box>
    </Container>
  );
}
