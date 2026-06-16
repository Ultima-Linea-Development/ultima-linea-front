import type { ReactNode } from "react";
import AdminProductImagePreview from "@/components/admin/AdminProductImagePreview";

type AdminSearchSuggestionRowProps = {
  imageUrl?: string;
  children: ReactNode;
  trailing?: ReactNode;
};

export default function AdminSearchSuggestionRow({
  imageUrl,
  children,
  trailing,
}: AdminSearchSuggestionRowProps) {
  return (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <AdminProductImagePreview imageUrl={imageUrl} size="sm" />
        <span className="min-w-0">{children}</span>
      </span>
      {trailing ? (
        <span className="shrink-0 text-muted-foreground text-xs">{trailing}</span>
      ) : null}
    </>
  );
}
