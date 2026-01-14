import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Button variant="link" className="font-semibold text-md" asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
