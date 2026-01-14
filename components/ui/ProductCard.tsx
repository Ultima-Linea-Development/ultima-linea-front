import Typography from "@/components/ui/Typography";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  name: string;
  team: string;
  price: string;
  image: string;
  className?: string;
};

export default function ProductCard({
  name,
  team,
  price,
  image,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={image}
          alt={`${name} - ${team}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 space-y-2">
        <Typography variant="h6" className="text-sm">
          {name}
        </Typography>
        <Typography variant="body2" className="text-muted-foreground">
          {team}
        </Typography>
        <Typography variant="h6" className="text-base">
          {price}
        </Typography>
      </div>
    </div>
  );
}
