import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import { ADMIN_PAGE_PADDING_CLASS } from "@/components/admin/AdminTable";
import AdminSectionLinks from "./AdminSectionLinks";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <Box display="flex" direction="col" gap="6" className="w-full min-w-0">
      <div className={cn("flex flex-col gap-6", ADMIN_PAGE_PADDING_CLASS)}>
        <Typography variant="h1">Administración</Typography>
        <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AdminSectionLinks />
        </Box>
      </div>
    </Box>
  );
}
