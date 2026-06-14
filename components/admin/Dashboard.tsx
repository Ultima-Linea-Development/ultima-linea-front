import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import { ADMIN_PAGE_PADDING_CLASS } from "@/components/admin/AdminTable";
import AdminSectionLinks from "./AdminSectionLinks";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <Box className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", ADMIN_PAGE_PADDING_CLASS)}>
      <Typography variant="h1" className="col-span-full mb-3 sm:mb-0">
        Administración
      </Typography>
      <AdminSectionLinks />
    </Box>
  );
}
