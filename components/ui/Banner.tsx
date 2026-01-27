import Image from "next/image";
import { cn } from "@/lib/utils";
import Div from "@/components/ui/Div";
import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";

type BannerProps = {
  image: string;
  alt?: string;
  className?: string;
  title?: string;
  titleBackground?: "black" | "white" | "transparent";
  titleColor?: "white" | "black";
};

export default function Banner({
  image,
  alt = "Banner",
  className,
  title,
  titleBackground = "white",
  titleColor = "black",
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
    <Box className={cn("relative w-full h-[700px]", className)}>
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
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
    </Box>
  );
}
