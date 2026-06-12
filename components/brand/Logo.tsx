import Image from "next/image";
import Link from "next/link";
import { LOGO_ASPECT, logoImageStyle } from "./logoConfig";

type LogoProps = {
  variant?: "default" | "white";
};

export default function Logo({ variant = "default" }: LogoProps) {
  const src =
    variant === "white"
      ? "/images/brand/ultima-linea-logo-white.png"
      : "/images/brand/ultima-linea-logo.png";

  return (
    <Link href="/">
      <Image
        src={src}
        alt="Última Línea"
        width={LOGO_ASPECT.width}
        height={LOGO_ASPECT.height}
        style={logoImageStyle}
        priority
      />
    </Link>
  );
}
