import Container from "@/components/layout/Container";
import NavBar from "@/components/layout/NavBar";
import NavLinks from "@/components/layout/NavLinks";
import NavLink from "@/components/navigation/NavLink";
import Logo from "@/components/brand/Logo";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 background uppercase">
      <Container>
        <NavBar>
          <Logo />
          <NavLinks>
            <NavLink href="/">Inicio</NavLink>
            <NavLink href="/contact">Contacto</NavLink>
          </NavLinks>
        </NavBar>
      </Container>
    </nav>
  );
}
