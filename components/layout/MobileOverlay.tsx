import { zIndex } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type MobileOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ zIndex: zIndex.mobileOverlay }}
      onClick={onClose}
      aria-hidden={!isOpen}
    />
  );
}
