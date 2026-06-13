import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SocialIconLinkProps = {
  href: string;
  "aria-label": string;
  icon: ReactNode;
  label?: ReactNode;
  variant?: "icon" | "withLabel";
  className?: string;
};

const iconVariantClass =
  "inline-flex text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function SocialIconLink({
  href,
  "aria-label": ariaLabel,
  icon,
  label,
  variant = "icon",
  className,
}: SocialIconLinkProps) {
  if (variant === "withLabel") {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-3 text-base transition-opacity hover:opacity-80",
          className
        )}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black">
          {icon}
        </span>
        {label ? (
          <span className="underline-offset-4 hover:underline">{label}</span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(iconVariantClass, className)}
    >
      {icon}
    </Link>
  );
}
