import Box from "@/components/layout/Box";
import Modal from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import { InlineAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import { type ComponentProps, type ReactNode } from "react";

type ButtonVariant = ComponentProps<typeof Button>["variant"];

export type ConfirmAction = {
  label: string;
  variant: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  loadingLabel?: string;
};

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: ReactNode;
  error?: string;
  actions: ConfirmAction[];
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  title,
  message,
  error,
  actions,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Box display="flex" direction="col" gap="4">
        <Typography variant="body2">{message}</Typography>
        {error ? (
          <InlineAlert variant="destructive">
            <Typography variant="body2" color="destructive">
              {error}
            </Typography>
          </InlineAlert>
        ) : null}
        <Box display="flex" gap="2" className="flex-wrap">
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.disabled && action.loadingLabel ? action.loadingLabel : action.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
