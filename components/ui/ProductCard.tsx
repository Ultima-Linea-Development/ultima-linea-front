import Typography from "@/components/ui/Typography";
import Image from "next/image";
import Link from "next/link";
import Div from "@/components/ui/Div";
import Box from "@/components/layout/Box";
import { generateSlug } from "@/lib/utils";

type ProductCardProps = {
  id: string;
  slug?: string;
  name: string;
  team: string;
  price: string;
  image: string;
  className?: string;
};

export default function ProductCard({
  id,
  slug,
  name,
  team,
  price,
  image,
  className,
}: ProductCardProps) {
  const productSlug = slug || generateSlug(name);
  const productPath = `${productSlug}-${id}`;
  return (
    <Link href={`/product/${productPath}`}>
      <Box
        display="flex"
        direction="col"
        className={className}
      >
        <Div
          position="relative"
          overflow="hidden"
          border="all"
          background="muted"
          transition={true}
          cursor="pointer"
          aspect="square"
          width="full"
          borderColor="transparent"
          hoverBorder="black"
        >
          <Image
            src={image}
            alt={`${name} - ${team}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Div>
        <Div p={4} spacing="md">
          <Typography variant="h6">
            {price}
          </Typography>
          <Typography variant="body2">
            {name.length > 50 ? `${name.substring(0, 50)}...` : name}
          </Typography>
          <Typography variant="body2" color="gray">
            {team}
          </Typography>
        </Div>
      </Box>
    </Link>
  );
}
