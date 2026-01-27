import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import FooterLink from "@/components/navigation/FooterLink";
import Typography from "@/components/ui/Typography";
import Logo from "@/components/brand/Logo";
import Footer from "@/components/ui/Footer";
import Div from "@/components/ui/Div";

export default function FooterComponent() {
  return (
    <Footer marginTop="auto" border="top" padding="md">
      <Container>
        <Box display="grid" cols={3} gap={8}>
          <Box display="flex" direction="col" gap="2">
            <Logo />
          </Box>

          <Box display="flex" direction="col" gap="2">
            <Typography variant="h6" mb={2}>
              Enlaces
            </Typography>
            <Box display="flex" direction="col" gap="2">
              <FooterLink href="#">Inicio</FooterLink>
              <FooterLink href="#">Productos</FooterLink>
              <FooterLink href="#">Acerca de</FooterLink>
              <FooterLink href="#">Contacto</FooterLink>
            </Box>
          </Box>

          <Box display="flex" direction="col" gap="2">
            <Typography variant="h6" mb={2}>
              Contacto
            </Typography>
            <Box display="flex" direction="col" gap="2">
              <Typography variant="body2" color="muted">
                Email: info@ultimalinea.com
              </Typography>
              <Typography variant="body2" color="muted">
                Teléfono: +1 234 567 890
              </Typography>
              <Typography variant="body2" color="muted">
                Dirección: Calle Principal 123
              </Typography>
            </Box>
          </Box>
        </Box>

        <Div mt={8} border="top" pt={6} textAlign="center">
          <Typography variant="body2" color="muted">
            © {new Date().getFullYear()} Última Línea. Todos los derechos
            reservados.
          </Typography>
        </Div>
      </Container>
    </Footer>
  );
}
