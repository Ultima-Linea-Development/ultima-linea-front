import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/brand/ultima-linea-logo.png"
        alt="Última Línea"
        width={40}
        height={40}
        priority
      />
    </Link>
  );
}
