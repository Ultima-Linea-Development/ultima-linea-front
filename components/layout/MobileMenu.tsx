"use client";

import { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/Icons";
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
      
      <>
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-[55] md:hidden transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={closeMenu}
          aria-hidden={!isOpen}
        />
        <div
          className={cn(
            "fixed top-[80px] right-0 w-[340px] max-w-[85vw] h-[calc(100vh-80px)] bg-white border-l border-gray-200 z-[60] md:hidden",
            "shadow-lg transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          )}
        >
          <div className="flex flex-col py-4 h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </>
    </MobileMenuContext.Provider>
  );
}
