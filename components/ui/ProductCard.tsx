import Typography from "@/components/ui/Typography";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  id: string;
  name: string;
  team: string;
  price: string;
  image: string;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  team,
  price,
  image,
  className,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <div
        className={cn(
          "flex flex-col overflow-hidden border border-transparent bg-card transition-colors hover:border-black cursor-pointer",
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
          <Typography variant="h6" className="text-base">
            {price}
          </Typography>
          <Typography variant="body2">
            {name.length > 50 ? `${name.substring(0, 50)}...` : name}
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            {team}
          </Typography>
        </div>
      </div>
    </Link>
  );
}
