"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";

const MD_BREAKPOINT = 768;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

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
  const isDesktop = useIsDesktop();
  const [desktopAspect, setDesktopAspect] = useState<string | null>(null);
  const onDesktopLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.naturalWidth && target.naturalHeight) {
        setDesktopAspect(`${target.naturalWidth}/${target.naturalHeight}`);
      }
    },
    []
  );

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
      >
        <div
          className={cn(
            "relative w-full",
            fillViewport && "h-full min-h-0"
          )}
          style={
            !fillViewport
              ? {
                  aspectRatio: isDesktop
                    ? (desktopAspect ?? aspectRatio)
                    : aspectRatioMobile,
                }
              : undefined
          }
        >
          <Image
            src={image}
            alt={alt}
            fill
            className={cn(
              "object-contain",
              imageMobile && "hidden md:block"
            )}
            onLoad={onDesktopLoad}
            priority
          />
          {imageMobile && (
            <Image
              src={imageMobile}
              alt={alt}
              fill
              className="object-contain block md:hidden"
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
