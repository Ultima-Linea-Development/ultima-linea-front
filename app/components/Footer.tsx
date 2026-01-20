import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import FooterLink from "@/components/navigation/FooterLink";
import Typography from "@/components/ui/Typography";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8">
      <Container>
        <Box display="grid" cols={3} gap={8}>
          <Box display="flex" direction="col" gap="2">
            <Logo />
          </Box>

          <Box display="flex" direction="col" gap="2">
            <Typography variant="h6" className="mb-2">
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
            <Typography variant="h6" className="mb-2">
              Contacto
            </Typography>
            <Box display="flex" direction="col" gap="2">
              <Typography variant="body2" className="text-muted-foreground">
                Email: info@ultimalinea.com
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Teléfono: +1 234 567 890
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Dirección: Calle Principal 123
              </Typography>
            </Box>
          </Box>
        </Box>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <Typography variant="body2" className="text-muted-foreground">
            © {new Date().getFullYear()} Última Línea. Todos los derechos
            reservados.
          </Typography>
        </div>
      </Container>
    </footer>
  );
}
