import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";
import Section from "@/components/layout/Section";
import FooterLink from "@/components/navigation/FooterLink";
import Typography from "@/components/ui/Typography";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8">
      <Container>
        <Grid cols={3} gap={8}>
          <Section>
            <Typography variant="h6" className="mb-2">
              Última Línea
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              Tu tienda de confianza para los mejores productos.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h6" className="mb-2">
              Enlaces
            </Typography>
            <Section>
              <FooterLink href="#">Inicio</FooterLink>
              <FooterLink href="#">Productos</FooterLink>
              <FooterLink href="#">Acerca de</FooterLink>
              <FooterLink href="#">Contacto</FooterLink>
            </Section>
          </Section>

          <Section>
            <Typography variant="h6" className="mb-2">
              Contacto
            </Typography>
            <Section>
              <Typography variant="body2" className="text-muted-foreground">
                Email: info@ultimalinea.com
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Teléfono: +1 234 567 890
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                Dirección: Calle Principal 123
              </Typography>
            </Section>
          </Section>
        </Grid>

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
