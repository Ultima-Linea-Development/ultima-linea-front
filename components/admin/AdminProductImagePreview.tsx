"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const IMAGE_SIZES = {
  sm: "32px",
  md: "40px",
  lg: "48px",
} as const;

type AdminProductImagePreviewProps = {
  imageUrl?: string;
  alt?: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
};

export default function AdminProductImagePreview({
  imageUrl,
  alt = "",
  size = "md",
  className,
}: AdminProductImagePreviewProps) {
  const sizeClass = SIZE_CLASS[size];

  if (!imageUrl) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-muted text-muted-foreground text-xs",
          sizeClass,
          className
        )}
        aria-hidden
      >
        —
      </span>
    );
  }

  return (
    <span className={cn("relative inline-flex shrink-0 overflow-hidden", sizeClass, className)}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        sizes={IMAGE_SIZES[size]}
        unoptimized
      />
    </span>
  );
}
