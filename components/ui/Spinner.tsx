import Image from "next/image";
import { LOGO_ASPECT, logoImageStyle } from "@/components/brand/logoConfig";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  fullscreen?: boolean;
};

export default function Spinner({ className, fullscreen = true }: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullscreen && "fixed inset-0 z-[100] bg-white",
        className
      )}
      role="status"
      aria-label="Cargando"
    >
      <Image
        src="/images/brand/ultima-linea-logo.png"
        alt="Última Línea"
        width={LOGO_ASPECT.width}
        height={LOGO_ASPECT.height}
        style={logoImageStyle}
        className="animate-shimmer"
        priority
      />
    </div>
  );
}
