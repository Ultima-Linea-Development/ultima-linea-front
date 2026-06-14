import Box from "@/components/layout/Box";
import AdminLoadingShimmer from "@/components/admin/AdminLoadingShimmer";
import { cn } from "@/lib/utils";

type AdminDataLoadingProps = {
  className?: string;
  minHeight?: string;
};

export default function AdminDataLoading({
  className,
  minHeight = "min-h-[12rem]",
}: AdminDataLoadingProps) {
  return (
    <Box
      display="flex"
      direction="col"
      className={cn("w-full", minHeight, className)}
      aria-busy="true"
      aria-label="Cargando"
    >
      <AdminLoadingShimmer className="h-full min-h-[inherit] w-full rounded-sm" />
    </Box>
  );
}
