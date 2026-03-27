"use client";

import * as React from "react";
import Image from "next/image";
import Box from "@/components/layout/Box";
import Lightbox from "@/components/ui/Lightbox";

const ZOOM_SCALE = 1.75;

type ZoomableImageProps = {
  url: string;
  alt: string;
  priority: boolean;
  onClick: () => void;
  "aria-label": string;
};

function ZoomableImage({
  url,
  alt,
  priority,
  onClick,
  "aria-label": ariaLabel,
}: ZoomableImageProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [pan, setPan] = React.useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPan({ x, y });
    },
    []
  );

  const handleMouseEnter = React.useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = React.useCallback(() => setIsHovering(false), []);

  const scale = isHovering ? ZOOM_SCALE : 1;
  const transformOrigin = isHovering
    ? `${pan.x * 100}% ${pan.y * 100}%`
    : "50% 50%";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-square min-w-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
      aria-label={ariaLabel}
    >
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin,
        }}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 45vw, 35vw"
        priority={priority}
        draggable={false}
      />
    </button>
  );
}

type ProductImageGalleryProps = {
  imageUrls: string[];
  productName: string;
};

export default function ProductImageGallery({
  imageUrls,
  productName,
}: ProductImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goPrev = () =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : imageUrls.length - 1));
  const goNext = () =>
    setLightboxIndex((i) => (i < imageUrls.length - 1 ? i + 1 : 0));

  if (imageUrls.length === 0) return null;

  return (
    <>
      <Box display="grid" cols={2} gap={2} className="min-w-0 grid-cols-2">
        {imageUrls.map((url, index) => (
          <ZoomableImage
            key={url}
            url={url}
            alt={`${productName} - imagen ${index + 1}`}
            priority={index === 0}
            onClick={() => openLightbox(index)}
            aria-label={`Ver imagen ${index + 1} de ${productName} en tamaño completo`}
          />
        ))}
      </Box>
      <Lightbox
        open={lightboxOpen}
        onClose={closeLightbox}
        images={imageUrls}
        currentIndex={lightboxIndex}
        onPrev={imageUrls.length > 1 ? goPrev : undefined}
        onNext={imageUrls.length > 1 ? goNext : undefined}
        alt={productName}
      />
    </>
  );
}
