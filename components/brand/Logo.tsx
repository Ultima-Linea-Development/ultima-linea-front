import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/ultima-linea-logo.png"
        alt="Última Línea"
        width={140}
        height={50}
        priority
        className="h-auto"
      />
    </Link>
  );
}
