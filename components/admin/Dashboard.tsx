import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminSectionLinks from "./AdminSectionLinks";

export default function Dashboard() {
  return (
    <Box display="flex" direction="col" gap="6">
      <Typography variant="h1">Administración</Typography>
      <AdminSectionLinks />
    </Box>
  );
}
