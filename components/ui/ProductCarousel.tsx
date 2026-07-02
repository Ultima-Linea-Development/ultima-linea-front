"use client";

import * as React from "react";
import Link from "next/link";
import Box from "@/components/layout/Box";
import ProductCard from "@/components/ui/ProductCard";
import Typography from "@/components/ui/Typography";
import Icon from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";
import { zIndex } from "@/lib/design-tokens";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  seeAllHref?: string;
  className?: string;
};

export default function ProductCarousel({
  title,
  products,
  seeAllHref,
  className,
}: ProductCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [navTopPx, setNavTopPx] = React.useState<number | null>(null);

  const updateCarouselMetrics = React.useCallback(() => {
    const container = containerRef.current;
    const element = scrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanScrollPrev(element.scrollLeft > 1);
    setCanScrollNext(element.scrollLeft < maxScrollLeft - 1);

    if (!container) return;

    const firstItem = element.querySelector(":scope > div");
    const imageArea = firstItem?.querySelector(".aspect-square");
    if (!(imageArea instanceof HTMLElement)) {
      setNavTopPx(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const imageRect = imageArea.getBoundingClientRect();
    setNavTopPx(imageRect.top - containerRect.top + imageRect.height / 2);
  }, []);

  React.useEffect(() => {
    const element = scrollRef.current;
    const container = containerRef.current;
    if (!element) return;

    updateCarouselMetrics();

    element.addEventListener("scroll", updateCarouselMetrics, { passive: true });
    const resizeObserver = new ResizeObserver(updateCarouselMetrics);
    resizeObserver.observe(element);
    if (container) resizeObserver.observe(container);

    return () => {
      element.removeEventListener("scroll", updateCarouselMetrics);
      resizeObserver.disconnect();
    };
  }, [products, updateCarouselMetrics]);

  const scrollByItem = (direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;

    const firstItem = element.querySelector(":scope > div");
    if (!(firstItem instanceof HTMLElement)) return;

    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    const itemStride = firstItem.offsetWidth + gap;
    if (itemStride <= 0) return;

    const currentIndex = Math.round(element.scrollLeft / itemStride);
    const maxIndex = Math.max(
      0,
      Math.round((element.scrollWidth - element.clientWidth) / itemStride)
    );
    const targetIndex = Math.min(
      maxIndex,
      Math.max(0, currentIndex + direction)
    );

    element.scrollTo({
      left: targetIndex * itemStride,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  const showNavigation = canScrollPrev || canScrollNext;

  const renderSeeAllButton = (className?: string) =>
    seeAllHref ? (
      <Button variant="ctaOutline" size="cta" className={className} asChild>
        <Link href={seeAllHref}>Ver todo</Link>
      </Button>
    ) : null;

  return (
    <Box display="flex" direction="col" gap="2" className={cn("w-full min-w-0", className)}>
      <Box
        display="flex"
        className="items-end justify-between gap-4 w-full"
      >
        <Typography variant="h2" uppercase>
          {title}
        </Typography>
        {renderSeeAllButton("hidden shrink-0 sm:inline-flex")}
      </Box>

      <div ref={containerRef} className="relative w-full min-w-0 px-5">
        {showNavigation ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canScrollPrev}
              onClick={() => scrollByItem(-1)}
              aria-label="Ver productos anteriores"
              className="absolute left-5 inline-flex -translate-x-1/2 -translate-y-1/2 bg-background shadow-sm"
              style={{
                top: navTopPx ?? undefined,
                zIndex: zIndex.dropdown,
              }}
            >
              <Icon name="chevronLeft" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!canScrollNext}
              onClick={() => scrollByItem(1)}
              aria-label="Ver más productos"
              className="absolute right-5 inline-flex translate-x-1/2 -translate-y-1/2 bg-background shadow-sm"
              style={{
                top: navTopPx ?? undefined,
                zIndex: zIndex.dropdown,
              }}
            >
              <Icon name="chevronRight" aria-hidden />
            </Button>
          </>
        ) : null}

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(50%-1rem)] shrink-0 snap-start sm:w-[calc(33.333%-1.34rem)] lg:w-[calc(25%-1.5rem)]"
            >
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                team={product.team || ""}
                price={formatPrice(product.price)}
                image={product.image_urls[0] || ""}
                hoverImage={product.image_urls?.[1]}
              />
            </div>
          ))}
        </div>
      </div>

      {seeAllHref ? (
        <div className="w-full px-5 sm:hidden">
          {renderSeeAllButton("flex w-full min-w-0")}
        </div>
      ) : null}
    </Box>
  );
}
