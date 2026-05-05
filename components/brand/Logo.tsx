import Image from "next/image";
import Link from "next/link";

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
        width={40}
        height={40}
        priority
      />
    </Link>
  );
}
