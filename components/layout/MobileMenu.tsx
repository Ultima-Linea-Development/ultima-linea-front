"use client";

import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
import MobileOverlay from "@/components/layout/MobileOverlay";
import MobilePanel from "@/components/layout/MobilePanel";
import { type ReactNode } from "react";

type MobileMenuContextType = {
  closeMenu: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType | null>(null);

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  return context;
};

type MobileMenuProps = {
  children: ReactNode;
};

export default function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ closeMenu }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        <Icon name={isOpen ? "close" : "menu"} size={28} />
      </Button>

      <MobileOverlay isOpen={isOpen} onClose={closeMenu} />
      <MobilePanel isOpen={isOpen} variant="menu">
        {children}
      </MobilePanel>
    </MobileMenuContext.Provider>
  );
}
