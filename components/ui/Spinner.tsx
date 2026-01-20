import Image from "next/image";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};

export default function Spinner({ className }: SpinnerProps) {
  return (
    <Image
      src="/ultima-linea-logo.png"
      alt="Última Línea"
      width={40}
      height={40}
      className={cn("animate-shimmer", className)}
      priority
      role="status"
      aria-label="Cargando"
    />
  );
}
