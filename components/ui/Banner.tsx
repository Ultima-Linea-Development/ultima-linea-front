import Image from "next/image";
import { cn } from "@/lib/utils";

type BannerProps = {
  image: string;
  alt?: string;
  className?: string;
};

export default function Banner({
  image,
  alt = "Banner",
  className,
}: BannerProps) {
  return (
    <div className={cn("relative w-full h-[700px]", className)}>
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
