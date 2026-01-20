import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Button 
      variant="link" 
      className={cn(
        "font-semibold text-md relative h-full flex items-center px-4 rounded-none",
        "no-underline hover:no-underline hover:bg-transparent",
        "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-foreground after:scale-x-0 after:transition-transform after:origin-left after:z-20",
        "hover:after:scale-x-100",
        "[font-family:var(--font-archivo-black)]"
      )} 
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
