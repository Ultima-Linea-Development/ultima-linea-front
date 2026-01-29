import Box from "@/components/layout/Box";
import Typography from "@/components/ui/Typography";
import Logo from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import AdminLogoutLink from "./AdminLogoutLink";

export default function Dashboard() {
  return (
    <Box display="flex" className="h-full">
      <aside className={cn("w-64 border-r border-border bg-background p-6 h-full overflow-y-auto flex flex-col")}>
        <Box display="flex" direction="col" gap="8" className="flex-1">
          <Box>
            <Logo />
          </Box>
          {/* Navegación de la sidebar */}
        </Box>
        
        <Box className="mt-auto pt-4 border-t border-border">
          <AdminLogoutLink />
        </Box>
      </aside>
    </Box >
  );
}
