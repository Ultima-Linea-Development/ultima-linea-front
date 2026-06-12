import Typography from "@/components/ui/Typography";
import type { AdminUser } from "@/lib/api";

type AdminUserSearchSuggestionProps = {
  user: AdminUser;
};

export default function AdminUserSearchSuggestion({ user }: AdminUserSearchSuggestionProps) {
  const name = `${user.first_name} ${user.last_name}`.trim();

  return (
    <>
      <span className="min-w-0">
        <Typography variant="body2" as="span">
          {name || user.email}
        </Typography>
      </span>
      <span className="shrink-0 text-muted-foreground text-xs">{user.email}</span>
    </>
  );
}
