import { ADMIN_LOADING_SHIMMER_CLASS } from "@/lib/admin-interactive-styles";
import { cn } from "@/lib/utils";

type AdminLoadingShimmerProps = {
  className?: string;
  staggerIndex?: number;
};

export default function AdminLoadingShimmer({
  className,
  staggerIndex,
}: AdminLoadingShimmerProps) {
  return (
    <div
      className={cn(ADMIN_LOADING_SHIMMER_CLASS, className)}
      style={
        staggerIndex != null
          ? { animationDelay: `${staggerIndex * 90}ms` }
          : undefined
      }
      aria-hidden="true"
    />
  );
}
