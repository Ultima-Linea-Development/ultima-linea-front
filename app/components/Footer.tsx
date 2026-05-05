import Container from "@/components/layout/Container";
import Box from "@/components/layout/Box";
import FooterLink from "@/components/navigation/FooterLink";
import Typography from "@/components/ui/Typography";
import Logo from "@/components/brand/Logo";
import Footer from "@/components/ui/Footer";
import Div from "@/components/ui/Div";
import { Button } from "@/components/ui/button";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import {
  WHATSAPP_ARREPENTIMIENTO_URL,
  WHATSAPP_CONSULT_URL,
} from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/ultimalineastore/";

const linkDark =
  "text-zinc-300 no-underline transition-colors hover:text-white";

/** Misma presentación que el icono de Instagram */
const socialIconLinkClass =
  "inline-flex text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function FooterComponent() {
  return (
    <Footer
      marginTop="auto"
      border="none"
      padding="md"
      className="border-t border-zinc-800 bg-black text-zinc-100"
    >
      <Container className="max-w-[1200px] py-10 md:py-12">
        <Box display="grid" cols={4} gap={8}>
          <Box display="flex" direction="col" gap="4">
            <Logo variant="white" />
            <Typography variant="h6" className="text-white uppercase">
              Enlaces
            </Typography>
            <Box display="flex" direction="col" gap="2">
              <FooterLink href="/" className={linkDark}>
                Inicio
              </FooterLink>
              <FooterLink href="/guia-de-talles" className={linkDark}>
                Guía de talles
              </FooterLink>
              <FooterLink
                href={WHATSAPP_CONSULT_URL}
                external
                className={linkDark}
              >
                Contacto
              </FooterLink>
            </Box>
          </Box>

          <Box display="flex" direction="col" gap="3">
            <Typography variant="h6" mb={2} className="text-white uppercase">
              Contacto
            </Typography>
            <Link
              href={WHATSAPP_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Última Línea"
              className={socialIconLinkClass}
            >
              <FaWhatsapp className="size-7" aria-hidden />
            </Link>
          </Box>

          <Box display="flex" direction="col" gap="3">
            <Typography variant="h6" mb={2} className="text-white uppercase">
              Síguenos
            </Typography>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Última Línea"
              className={socialIconLinkClass}
            >
              <FaInstagram className="size-7" aria-hidden />
            </a>
          </Box>

          <Box display="flex" direction="col" gap="3">
            <Typography variant="h6" mb={2} className="text-white uppercase">
              Asistencia
            </Typography>
            <Button
              variant="outline"
              size="sm"
              className="w-fit rounded-none border-white/80 bg-transparent text-white hover:border-white hover:bg-white hover:text-black"
              asChild
            >
              <Link
                href={WHATSAPP_ARREPENTIMIENTO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Botón de arrepentimiento
              </Link>
            </Button>
          </Box>
        </Box>

        <Div
          mt={8}
          border="top"
          pt={6}
          textAlign="center"
          className="border-zinc-800"
        >
          <Typography variant="caption" className="mb-3 text-zinc-500">
            San Rafael, Mendoza, Argentina.
          </Typography>
          <Typography variant="caption" className="text-zinc-500">
            © {new Date().getFullYear()} Última Línea. Todos los derechos
            reservados.
          </Typography>
        </Div>
      </Container>
    </Footer>
  );
}
