import Typography from "@/components/ui/Typography";
import { type ReactNode } from "react";

type ParagraphProps = {
  color?: "muted" | "default";
  children: ReactNode;
};

export default function Paragraph({ color = "default", children }: ParagraphProps) {
  return (
    <Typography variant="body" color={color === "muted" ? "muted" : "default"}>
      {children}
    </Typography>
  );
}
