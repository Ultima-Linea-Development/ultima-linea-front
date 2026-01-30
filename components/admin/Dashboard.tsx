import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import AdminShell from "./AdminShell";

export default function Dashboard() {
  return (
    <AdminShell>
      <Box display="flex" direction="col" gap="4">
        <Typography variant="h2">Panel de administración</Typography>
      </Box>
    </AdminShell>
  );
}
