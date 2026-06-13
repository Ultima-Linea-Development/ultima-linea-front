"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import SearchInput from "@/components/ui/SearchInput";
import MobileOverlay from "@/components/layout/MobileOverlay";
import MobilePanel from "@/components/layout/MobilePanel";

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

      <MobileOverlay isOpen={isOpen} onClose={closeSearch} />
      <MobilePanel isOpen={isOpen} variant="search">
        <SearchInput onBlur={closeSearch} onSubmit={closeSearch} />
      </MobilePanel>
    </>
  );
}
