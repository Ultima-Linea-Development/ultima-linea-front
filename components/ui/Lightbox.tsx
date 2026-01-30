"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrev?: () => void;
  onNext?: () => void;
  alt?: string;
};

export default function Lightbox({
  open,
  onClose,
  images,
  currentIndex,
  onPrev,
  onNext,
  alt = "Imagen",
}: LightboxProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || images.length === 0) return null;

  const currentUrl = images[currentIndex];
  const hasMultiple = images.length > 1;
  const canPrev = hasMultiple && currentIndex > 0;
  const canNext = hasMultiple && currentIndex < images.length - 1;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada"
    >
      <button
        type="button"
        className="absolute inset-0 focus:outline-none"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div
        className="relative z-10 flex h-full w-full max-w-[90vw] max-h-[90vh] items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && canPrev && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Imagen anterior"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 shrink-0 z-20"
          >
            <Icon name="chevronLeft" className="size-8" />
          </Button>
        )}
        <div className="relative h-full w-full flex items-center justify-center">
          <Image
            src={currentUrl}
            alt={`${alt} ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>
        {hasMultiple && canNext && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Siguiente imagen"
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 shrink-0 z-20"
          >
            <Icon name="chevronRight" className="size-8" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Cerrar"
          onClick={onClose}
          className={cn(
            "absolute top-2 right-2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 shrink-0 z-20"
          )}
        >
          <Icon name="close" className="size-6" />
        </Button>
      </div>
    </div>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
