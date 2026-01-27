"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMobileMenu } from "@/components/layout/MobileMenu";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
};

export default function NavLink({ href, children, mobile = false }: NavLinkProps) {
  const mobileMenu = useMobileMenu();

  const handleClick = () => {
    if (mobile && mobileMenu) {
      mobileMenu.closeMenu();
    }
  };

  return (
    <Button 
      variant="link" 
      className={cn(
        "font-semibold text-md relative flex items-center px-4 rounded-none",
        mobile ? "h-auto py-3 w-full justify-start" : "h-full",
        "no-underline hover:no-underline hover:bg-transparent",
        !mobile && "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-foreground after:scale-x-0 after:transition-transform after:origin-left after:z-20 hover:after:scale-x-100",
        "[font-family:var(--font-archivo-black)]"
      )} 
      asChild
      onClick={handleClick}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
