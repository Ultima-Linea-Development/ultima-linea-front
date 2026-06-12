import Box from "@/components/layout/Box";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

type AdminDataLoadingProps = {
  className?: string;
};

export default function AdminDataLoading({ className }: AdminDataLoadingProps) {
  return (
    <Box
      display="flex"
      direction="col"
      justify="start"
      align="start"
      className={cn("w-full", className)}
    >
      <Spinner fullscreen={false} />
    </Box>
  );
}
