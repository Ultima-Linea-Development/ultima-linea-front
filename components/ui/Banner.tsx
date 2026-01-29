import Image from "next/image";
import { cn } from "@/lib/utils";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";

type BannerProps = {
  image: string;
  imageMobile?: string;
  alt?: string;
  className?: string;
  title?: string;
  titleBackground?: "black" | "white" | "transparent";
  titleColor?: "white" | "black";
  /** Relación de aspecto para altura automática (ej: "21/9", "16/9"). Por defecto "21/9". Ignorado si fillViewport. */
  aspectRatio?: string;
  /** Relación de aspecto en mobile. Por defecto "4/3". Ignorado si fillViewport. */
  aspectRatioMobile?: string;
  /** Si true, el banner ocupa la altura disponible del viewport (menos header) y la imagen rellena con object-cover. */
  fillViewport?: boolean;
};

export default function Banner({
  image,
  imageMobile,
  alt = "Banner",
  className,
  title,
  titleBackground = "white",
  titleColor = "black",
  aspectRatio = "21/9",
  aspectRatioMobile = "4/3",
  fillViewport = false,
}: BannerProps) {
  const backgroundStyles = {
    black: "bg-black/70",
    white: "bg-white",
    transparent: "bg-transparent",
  };

  const textStyles = {
    white: "text-white",
    black: "text-black",
  };

  return (
    <Box
      className={cn(
        "relative w-full overflow-visible",
        fillViewport && "h-[calc(100dvh-5rem)]",
        !fillViewport && "h-auto",
        "max-md:w-screen max-md:min-w-screen max-md:box-border",
        "max-md:ml-[calc(50%-50vw)] max-md:mr-[calc(50%-50vw)]",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full",
          fillViewport ? "h-full" : "w-full"
        )}
        style={
          !fillViewport
            ? ({
                "--aspect-mobile": aspectRatioMobile,
                "--aspect-desktop": aspectRatio,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className={cn(
            "relative w-full",
            fillViewport
              ? "h-full min-h-0"
              : "aspect-[var(--aspect-mobile)] md:aspect-[var(--aspect-desktop)]"
          )}
        >
          <Image
            src={image}
            alt={alt}
            fill
            className={cn(
              fillViewport ? "object-cover" : "object-contain",
              imageMobile && "hidden md:block"
            )}
            priority
          />
          {imageMobile && (
            <Image
              src={imageMobile}
              alt={alt}
              fill
              className="object-cover block md:hidden"
              priority
            />
          )}
          {title && (
            <Box className="absolute inset-0 flex items-center justify-center">
              <Box
                className={cn(
                  "px-8 py-4 max-w-2xl",
                  backgroundStyles[titleBackground],
                  textStyles[titleColor]
                )}
              >
                <Typography variant="h1" uppercase align="center">
                  {title}
                </Typography>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </Box>
  );
}
