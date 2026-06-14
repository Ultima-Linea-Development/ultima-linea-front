import AdminLoadingShimmer from "@/components/admin/AdminLoadingShimmer";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  staggerIndex?: number;
};

export default function Skeleton({ className, staggerIndex }: SkeletonProps) {
  return <AdminLoadingShimmer className={cn("rounded-sm", className)} staggerIndex={staggerIndex} />;
}
