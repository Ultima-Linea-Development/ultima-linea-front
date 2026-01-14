import Link from "next/link";
import Typography from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function FooterLink({
  href,
  children,
  className,
}: FooterLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground no-underline transition-colors hover:text-muted-foreground",
        className
      )}
    >
      <Typography variant="body2" as="span">
        {children}
      </Typography>
    </Link>
  );
}
