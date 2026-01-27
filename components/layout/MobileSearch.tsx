"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import SearchInput from "@/components/ui/SearchInput";

export default function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => setIsOpen(!isOpen);
  const closeSearch = () => setIsOpen(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        className="md:hidden"
        aria-label="Toggle search"
      >
        <Icon name="search" size={28} />
      </Button>
      
      <>
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-[55] md:hidden transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeSearch}
          aria-hidden={!isOpen}
        />
        <div
          className={cn(
            "fixed top-[80px] right-0 left-0 w-full bg-white border-b border-gray-200 z-[60] md:hidden",
            "shadow-lg transition-transform duration-300 ease-in-out px-4 py-3",
            isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          )}
        >
          <SearchInput onBlur={closeSearch} onSubmit={closeSearch} />
        </div>
      </>
    </>
  );
}
