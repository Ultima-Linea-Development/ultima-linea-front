import Image from "next/image";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-white",
        "flex items-center justify-center",
        className
      )}
      role="status"
      aria-label="Cargando"
    >
      <Image
        src="/images/brand/ultima-linea-logo.png"
        alt="Última Línea"
        width={40}
        height={40}
        className="animate-shimmer"
        priority
      />
    </div>
  );
}
