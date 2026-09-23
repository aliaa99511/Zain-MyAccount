import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type { ConfirmDialogConfig } from "../types";

interface ConfirmDialogProps {
  config: ConfirmDialogConfig;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export const ConfirmDialog = ({
  config,
  onConfirm,
  onClose,
  loading,
}: ConfirmDialogProps) => {
  const {
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "primary",
  } = config;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>

      {description && (
        <DialogContent>
          {typeof description === "string" ? (
            <Typography>{description}</Typography>
          ) : (
            description
          )}
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </>
  );
};
