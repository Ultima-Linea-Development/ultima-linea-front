"use client";

import * as React from "react";
import Image from "next/image";
import Box from "@/components/layout/Box";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
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
  const [isExpanded, setIsExpanded] = React.useState(false);

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

  const hasToggle = imageUrls.length > 4;
  const alwaysVisibleImages = hasToggle ? imageUrls.slice(0, 2) : imageUrls;
  const desktopCollapsedImages = hasToggle ? imageUrls.slice(2, 4) : [];
  const extraImages = hasToggle ? imageUrls.slice(2) : [];

  return (
    <>
      <Box display="grid" cols={2} gap={2} className="min-w-0 grid-cols-2">
        {alwaysVisibleImages.map((url, index) => (
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
      {hasToggle && !isExpanded && (
        <Box display="grid" cols={2} gap={2} className="mt-2 hidden min-w-0 grid-cols-2 sm:grid">
          {desktopCollapsedImages.map((url, index) => {
            const imageIndex = index + 2;
            return (
              <ZoomableImage
                key={url}
                url={url}
                alt={`${productName} - imagen ${imageIndex + 1}`}
                priority={false}
                onClick={() => openLightbox(imageIndex)}
                aria-label={`Ver imagen ${imageIndex + 1} de ${productName} en tamaño completo`}
              />
            );
          })}
        </Box>
      )}
      {hasToggle && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded
              ? "mt-2 max-h-[2000px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0 pointer-events-none"
          }`}
          aria-hidden={!isExpanded}
        >
          <Box display="grid" cols={2} gap={2} className="min-w-0 grid-cols-2">
            {extraImages.map((url, index) => {
              const imageIndex = index + 2;
              return (
                <ZoomableImage
                  key={url}
                  url={url}
                  alt={`${productName} - imagen ${imageIndex + 1}`}
                  priority={false}
                  onClick={() => openLightbox(imageIndex)}
                  aria-label={`Ver imagen ${imageIndex + 1} de ${productName} en tamaño completo`}
                />
              );
            })}
          </Box>
        </div>
      )}
      {hasToggle && (
        <div className="-mt-6 relative z-10 flex justify-center">
          <Button
            type="button"
            variant="ctaOutline"
            size="xl"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="min-w-[10.5rem] h-10 min-h-10 px-4 py-2 text-sm normal-case tracking-normal sm:min-w-[12.5rem] sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm sm:normal-case sm:tracking-normal"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Ocultar imágenes" : "Mostrar más imágenes"}
          >
            {isExpanded ? "Mostrar menos" : "Mostrar más"}
            <Icon
              name="chevronRight"
              className={`transition-transform duration-200 ${
                isExpanded ? "-rotate-90" : "rotate-90"
              }`}
              aria-hidden
            />
          </Button>
        </div>
      )}
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
