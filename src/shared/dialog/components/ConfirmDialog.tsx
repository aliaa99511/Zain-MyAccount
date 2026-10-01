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
    cancelText,
    confirmColor = "primary",
  } = config;

  return (
    <>
      <DialogTitle sx={{p:2}}>{title}</DialogTitle>

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
        {cancelText && <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>}

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
          sx={{flexGrow: 1}}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </>
  );
};
