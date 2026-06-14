import Typography from "@/components/ui/Typography";
import AdminTextLink from "@/components/admin/AdminTextLink";
import { cn } from "@/lib/utils";

type AdminCatalogStatusLinksProps = {
  todoCount: number;
  inactiveCount: number;
  showInactive: boolean;
  onShowTodo: () => void;
  onShowInactive: () => void;
  className?: string;
};

export default function AdminCatalogStatusLinks({
  todoCount,
  inactiveCount,
  showInactive,
  onShowTodo,
  onShowInactive,
  className,
}: AdminCatalogStatusLinksProps) {
  return (
    <nav
      aria-label="Filtrar por estado del catálogo"
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      <AdminTextLink selected={!showInactive} onClick={onShowTodo}>
        <Typography variant="body2" as="span">
          Todo ({todoCount})
        </Typography>
      </AdminTextLink>
      <Typography variant="body2" color="muted" as="span" aria-hidden="true">
        |
      </Typography>
      <AdminTextLink selected={showInactive} onClick={onShowInactive}>
        <Typography variant="body2" as="span">
          Inactivos ({inactiveCount})
        </Typography>
      </AdminTextLink>
    </nav>
  );
}
